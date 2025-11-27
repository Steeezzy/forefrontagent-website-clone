// packages/workers/embedWorker.ts
// A simple worker skeleton that listens to a Redis/BullMQ queue named 'embed-jobs',
// chunks uploaded documents or text, generates embeddings, and inserts into `embeddings` table.
//
// For local dev you can run: node packages/workers/embedWorker.js (after transpile)

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { embedText } from "@/lib/gemini";
import { db } from "@/db/index";
import { v4 as uuidv4 } from "uuid";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const worker = new Worker(
    "embed-jobs",
    async (job) => {
        const { botId, content, sourceRef } = job.data;
        // Basic chunking by sentences / paragraphs. Improve with token-based chunker for production.
        const chunks: string[] = chunkText(content, 800); // 800 chars ~ approx tokens - adjust
        for (let i = 0; i < chunks.length; i++) {
            const chunkText = chunks[i];
            const vector = await embedText(chunkText); // number[]
            const id = uuidv4();
            await db.insert("embeddings").values({
                id,
                bot_id: botId,
                chunk_id: `${id}_c${i}`,
                text_excerpt: chunkText,
                vector: JSON.stringify(vector),
                source_ref: sourceRef ?? null,
                created_at: new Date().toISOString()
            });
        }
        return { ok: true, inserted: chunks.length };
    },
    { connection }
);

function chunkText(text: string, maxLen = 1000) {
    const paragraphs = text.split("\n\n").filter(Boolean);
    const out: string[] = [];
    let cur = "";
    for (const p of paragraphs) {
        if ((cur + "\n\n" + p).length > maxLen) {
            if (cur) out.push(cur);
            cur = p;
        } else {
            cur = cur ? cur + "\n\n" + p : p;
        }
    }
    if (cur) out.push(cur);
    return out;
}

worker.on("completed", (job) => {
    console.log("embed job completed", job.id);
});
worker.on("failed", (job, err) => {
    console.error("embed job failed", job?.id, err);
});
