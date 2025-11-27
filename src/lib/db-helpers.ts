import { db } from "@/db/index";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { bots, conversations, messages, usage, embeddings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Types
type Bot = typeof bots.$inferSelect;
type MessageRow = {
    conversation_id: number;
    bot_id: number;
    role: "user" | "assistant" | "system";
    text: string;
    metadata?: any;
};

// Basic helpers
export async function getBotById(botId: number): Promise<Bot | null> {
    const res = await db.select().from(bots).where(eq(bots.id, botId)).limit(1);
    return res?.[0] ?? null;
}

export async function saveConversationIfNew(payload: {
    id?: number;
    botId: number;
    userId?: number | null;
}) {
    if (payload.id) {
        const existing = await db.select().from(conversations).where(eq(conversations.id, payload.id)).limit(1);
        if (existing?.length) return existing[0];
    }

    // Note: ID is auto-increment integer in schema, so we let DB handle it if not provided
    // But the request implies UUIDs. Schema says integer. Sticking to schema for now.
    // If payload.id is provided, we assume it matches schema type.

    const [newConv] = await db.insert(conversations).values({
        botId: payload.botId,
        userId: payload.userId ?? null,
        metadata: {},
        createdAt: new Date().toISOString()
    }).returning();

    return newConv;
}

export async function saveMessage(row: MessageRow & { conversationId?: number; createdAt?: string }) {
    const message = {
        conversationId: row.conversationId ?? row.conversation_id,
        role: row.role,
        text: row.text,
        metadata: row.metadata ?? {},
        createdAt: new Date().toISOString()
    };
    await db.insert(messages).values(message);
    return message;
}

export async function recordUsage(opts: { botId: number; tokens: number; costEstimate?: number }) {
    const [newUsage] = await db.insert(usage).values({
        botId: opts.botId,
        tokens: opts.tokens,
        cost: String(opts.costEstimate ?? 0),
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
    }).returning();
    return { id: newUsage.id };
}

/**
 * getConversationById - fetch last N messages for a conversation
 */
export async function getConversationById(convId: number, opts?: { limit?: number }) {
    const limit = opts?.limit ?? 10;
    const rows = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, convId))
        .orderBy(desc(messages.createdAt))
        .limit(limit);
    // reverse to oldest->newest
    return rows.reverse();
}

/**
 * vectorSearch
 * Fetches all vectors for a bot, computes cosine similarity in JS,
 * and returns topK results: [{id, text_excerpt, source_ref, score}]
 */
function cosineSim(a: number[], b: number[]) {
    let dot = 0,
        na = 0,
        nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += (a[i] ?? 0) * (b[i] ?? 0);
        na += (a[i] ?? 0) ** 2;
        nb += (b[i] ?? 0) ** 2;
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function vectorSearch(botId: number, qEmbedding: number[], topK = 5) {
    // fetch embeddings for bot
    const rows = await db.select().from(embeddings).where(eq(embeddings.botId, botId)).limit(1000);

    const results = rows.map((r) => {
        // Vector is already JSON parsed by Drizzle due to { mode: 'json' }
        const vec = r.vector as unknown as number[];
        return {
            id: r.id,
            text_excerpt: r.textExcerpt,
            source_ref: r.sourceRef,
            score: cosineSim(qEmbedding, vec) || 0
        };
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
}
