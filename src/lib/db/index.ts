
// src/lib/db/index.ts
// DB helper wrappers for your Drizzle/Turso setup.
// Replace `db` import with your actual drizzle export as needed.

import { v4 as uuidv4 } from "uuid";
/* TODO: adjust this import to match your Drizzle/Turso db export path */
import { db } from "@/db/index"; // <-- ensure this path matches your project
import { bots, conversations, messages, usage, embeddings } from "@/db/schema";
import { eq, desc } from "drizzle-orm"; // may or may not be used depending on your drizzle usage

export type Bot = typeof bots.$inferSelect & { file_ids?: string[]; chat_model?: string };

// NOTE: replace generic db calls below with actual Drizzle queries according to your schema.
// The functions are intentionally generic and annotated with TODOs.

export async function getBotById(botId: string): Promise<Bot | null> {
    // Cast ID to number as per schema
    const id = parseInt(botId);
    if (isNaN(id)) return null;
    const rows = await db.select().from(bots).where(eq(bots.id, id)).limit(1);
    return (rows?.[0] as Bot) ?? null;
}

export async function saveConversationIfNew(payload: { id?: string; botId: string; userId?: string | null }) {
    if (payload.id) {
        // Schema uses integer ID for conversations, but payload might have string UUID if from client?
        // Schema says: id: integer('id').primaryKey({ autoIncrement: true })
        // If payload.id is provided, it might be a session_id or we need to adjust schema to support UUIDs.
        // For now, assuming payload.id is NOT the primary key but maybe session_id?
        // Or if we strictly follow schema, we can't insert a UUID into an integer PK.
        // Let's assume payload.id is actually session_id for now if it's a string.

        // However, the user code expects to return a conversation with an ID.
        // Let's try to find by ID if it's a number, otherwise by session_id.

        const idNum = parseInt(payload.id);
        if (!isNaN(idNum)) {
            const existing = await db.select().from(conversations).where(eq(conversations.id, idNum)).limit(1);
            if (existing?.length) return existing[0];
        }
    }

    const [newConv] = await db.insert(conversations).values({
        botId: parseInt(payload.botId),
        userId: payload.userId ? parseInt(payload.userId) : null,
        metadata: {},
        createdAt: new Date().toISOString()
    }).returning();

    return newConv;
}

export async function saveMessage(opts: {
    conversationId: string;
    botId: string;
    role: "user" | "assistant" | "system";
    text: string;
    metadata?: any;
}) {
    const row = {
        conversationId: parseInt(opts.conversationId),
        // bot_id is not in messages table in schema, only conversation_id
        role: opts.role,
        text: opts.text,
        metadata: opts.metadata ?? {},
        createdAt: new Date().toISOString()
    };
    await db.insert(messages).values(row);
    return row;
}

export async function recordUsage(opts: { botId: string; tokens: number; costEstimate?: number }) {
    const [newUsage] = await db.insert(usage).values({
        botId: parseInt(opts.botId),
        tokens: opts.tokens,
        cost: String(opts.costEstimate ?? 0),
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
    }).returning();
    return { id: newUsage.id };
}

export async function getConversationById(convId: string, opts?: { limit?: number }) {
    const limit = opts?.limit ?? 10;
    const rows = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, parseInt(convId)))
        .orderBy(desc(messages.createdAt))
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
    const rows = await db.select().from(embeddings).where(eq(embeddings.botId, parseInt(botId))).limit(1000);
    const scored = rows.map((r) => {
        const vec = r.vector as unknown as number[];
        const score = cosineSim(qEmbedding, vec);
        return { id: r.id, text_excerpt: r.textExcerpt, source_ref: r.sourceRef, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
}

