import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bots, messages, usage } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { geminiChat, geminiEmbed, geminiFileSearch } from '@/lib/gemini';
import { redis } from '@/lib/redis';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { botId, message, userId } = body;

        if (!botId || !message) {
            return NextResponse.json({ error: 'Missing botId or message' }, { status: 400 });
        }

        const bot = await db.query.bots.findFirst({
            where: eq(bots.id, botId),
        });

        if (!bot) {
            return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
        }

        // TODO: Flow check logic here

        // RAG Logic
        let responseText = "";
        let totalTokens = 0;

        // Check if bot has file search enabled (assuming settings structure)
        const settings = JSON.parse(bot.settings as string);

        if (settings.useFileSearch && settings.fileIds && settings.fileIds.length > 0) {
            // File Search Mode
            const aiResp = await geminiFileSearch({ model: 'gemini-1.5-flash', fileIds: settings.fileIds, query: message });
            responseText = aiResp.text;
            totalTokens = aiResp.tokens;
        } else {
            // Vector Search Mode (Simplified)
            // 1. Embed query
            // const qEmb = await geminiEmbed(message);
            // 2. Search embeddings (Need vector search capability in DB or external vector DB)
            // For now, just direct chat
            const aiResp = await geminiChat({
                model: 'gemini-1.5-flash',
                messages: [{ role: 'user', content: message }],
                systemPrompt: `You are a helpful assistant for ${bot.name}.`
            });
            responseText = aiResp.text;
            totalTokens = aiResp.tokens;
        }

        // Save messages
        // Note: conversationId handling needs to be robust (create if not exists)
        // For this snippet, assuming we have a conversationId or create one.
        // tailored for simplicity in this step.

        // Record usage
        await db.insert(usage).values({
            botId,
            tokens: totalTokens,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ text: responseText });

    } catch (error) {
        console.error("Error in chat endpoint:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
