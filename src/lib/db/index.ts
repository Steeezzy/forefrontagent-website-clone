// src/lib/db/index.ts
// DB helper wrappers for your Drizzle/Turso setup.
// Replace `db` import with your actual drizzle export as needed.

import { v4 as uuidv4 } from "uuid";
/* TODO: adjust this import to match your Drizzle/Turso db export path */
import { db } from "@/db/index"; // <-- ensure this path matches your project
import { sql } from "drizzle-orm"; // may or may not be used depending on your drizzle usage

export type Bot = { id: string; name: string; file_ids?: string[]; chat_model?: string };

// NOTE: replace generic db calls below with actual Drizzle queries according to your schema.
// The functions are intentionally generic and annotated with TODOs.

export async function getBotById(botId: string): Promise<Bot | null> {
    const rows: any[] = await db.select().from("bots").where({ id: botId }).limit(1);
    return rows?.[0] ?? null;
}

export async function saveConversationIfNew(payload: { id?: string; botId: string; userId?: string | null }) {
    if (payload.id) {
        const existing = await db.select().from("conversations").where({ id: payload.id }).limit(1);
        if (existing?.length) return existing[0];
    }
    const id = payload.id ?? uuidv4();
    await db.insert("conversations").values({
        id,
        bot_id: payload.botId,
        user_id: payload.userId ?? null,
        metadata: {},
        created_at: new Date().toISOString()
    });
    const conv = await db.select().from("conversations").where({ id }).limit(1);
    return conv?.[0];
}

export async function saveMessage(opts: {
    conversationId: string;
    botId: string;
    role: "user" | "assistant" | "system";
    text: string;
    metadata?: any;
}) {
    const id = uuidv4();
    const row = {
        id,
        conversation_id: opts.conversationId,
        bot_id: opts.botId,
        role: opts.role,
        text: opts.text,
        metadata: opts.metadata ?? {},
        created_at: new Date().toISOString()
    };
    await db.insert("messages").values(row);
    return row;
}

export async function recordUsage(opts: { botId: string; tokens: number; costEstimate?: number }) {
    const id = uuidv4();
    await db.insert("usage").values({
        id,
        bot_id: opts.botId,
        tokens: opts.tokens,
        cost: opts.costEstimate ?? 0,
        date: new Date().toISOString().slice(0, 10)
    });
    return { id };
}

export async function getConversationById(convId: string, opts?: { limit?: number }) {
    const limit = opts?.limit ?? 10;
    const rows: any[] = await db
        .select()
        .from("messages")
        .where({ conversation_id: convId })
        .orderBy(sql`created_at DESC`)
        .limit(limit);
    return rows.reverse();
}

/**
 * vectorSearch(botId, qEmbedding, topK)
 * Performs in-process cosine similarity on stored vectors.
 * This is acceptable for small datasets; for production use a dedicated vector DB.
 */
function cosineSim(a: number[], b: number[]) {
    let dot = 0,
        na = 0,
        nb = 0;
    for (let i = 0; i < a.length; i++) {
        const ai = a[i] ?? 0;
        const bi = b[i] ?? 0;
        dot += ai * bi;
        na += ai * ai;
        nb += bi * bi;
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function vectorSearch(botId: string, qEmbedding: number[], topK = 5) {
    // WARNING: This pulls a limited number of rows into memory for similarity scoring.
    // For large datasets, use Pinecone/Supabase Vector/pgvector.
    const rows: any[] = await db.select().from("embeddings").where({ bot_id: botId }).limit(1000);
    const scored = rows.map((r) => {
        const vec = Array.isArray(r.vector) ? r.vector : JSON.parse(r.vector || "[]");
        const score = cosineSim(qEmbedding, vec);
        return { id: r.id, text_excerpt: r.text_excerpt, source_ref: r.source_ref, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
}
