import { Job, Worker } from "bullmq";
import { redis } from "../lib/redis";
import { geminiEmbed } from "../lib/gemini";
import { chunkText } from "./chunker";
import { db } from "../db";
import { embeddings } from "../db/schema";

interface EmbedJobData {
    botId: number;
    text: string;
    sourceRef: string;
}

const worker = new Worker(
    "embed-jobs",
    async (job: Job<EmbedJobData>) => {
        const { botId, text, sourceRef } = job.data;

        const chunks = chunkText(text);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const vector = await geminiEmbed(chunk);

            await db.insert(embeddings).values({
                botId,
                chunkId: `${sourceRef}-${i}`,
                vector: JSON.stringify(vector),
                sourceRef,
                textExcerpt: chunk,
                createdAt: new Date().toISOString(),
            });
        }
    },
    { connection: redis }
);

export default worker;
