// src/app/api/message/route.ts
// Next.js App Router route handler for chat messages.

import { NextRequest, NextResponse } from "next/server";
import { fileSearchQuery, embedText, chatWithContext } from "@/lib/gemini";
import { getBotById, saveConversationIfNew, saveMessage, vectorSearch, recordUsage, getConversationById } from "@/lib/db";
// import { shouldRunFlow, runFlow } from "@/lib/flows"; // optional - keep if you have flows
import { executeFunctionCall } from "@/lib/actions";

type Incoming = {
    botId: string;
    conversationId?: string;
    userId?: string;
    message: string;
    metadata?: Record<string, any>;
};

export async function POST(req: NextRequest) {
    try {
        const body: Incoming = await req.json();
        if (!body?.botId || !body?.message) {
            return NextResponse.json({ error: "botId and message required" }, { status: 400 });
        }

        const bot = await getBotById(body.botId);
        if (!bot) return NextResponse.json({ error: "bot not found" }, { status: 404 });

        const conv = await saveConversationIfNew({ id: body.conversationId, botId: body.botId, userId: body.userId });

        await saveMessage({
            conversationId: String(conv.id), // Convert back to string if needed by helper, or helper should accept number
            botId: String(bot.id),
            role: "user",
            text: body.message,
            metadata: body.metadata ?? {}
        });

        // Flow check (if you implemented flows)
        try {
            // const wantsFlow = typeof shouldRunFlow === "function" ? await shouldRunFlow(bot, body.message) : false;
            const wantsFlow = false; // Placeholder until flows are implemented
            if (wantsFlow) {
                // const flowResult = await runFlow({ bot, conversation: conv, message: body.message });
                // // Save flow messages if any
                // if (flowResult?.messages) {
                //   for (const m of flowResult.messages) {
                //     await saveMessage({ conversationId: conv.id, botId: bot.id, role: m.role, text: m.text, metadata: m.metadata ?? {} });
                //   }
                // }
                // return NextResponse.json({ ok: true, flow: true, result: flowResult });
            }
        } catch (e) {
            // fallback to RAG if flow runner fails
            console.warn("flow runner error", e);
        }

        // If bot has file_ids, use File Search (fast onboarding)
        if (bot.file_ids && Array.isArray(bot.file_ids) && bot.file_ids.length > 0) {
            const fileResp = await fileSearchQuery(bot.file_ids, body.message);
            await saveMessage({ conversationId: String(conv.id), botId: String(bot.id), role: "assistant", text: fileResp.text, metadata: { source: "file_search" } });
            if (fileResp.usage?.tokens) await recordUsage({ botId: String(bot.id), tokens: fileResp.usage.tokens });
            return NextResponse.json({ ok: true, text: fileResp.text, source: "file_search" });
        }

        // Classic RAG: embed query, vector search
        const qEmbedding = await embedText(body.message);
        const hits = await vectorSearch(String(bot.id), qEmbedding, 5);
        const contextPieces = hits.map((h) => `Source: ${h.source_ref}\n${h.text_excerpt}`).join("\n\n");

        const history = await getConversationById(String(conv.id), { limit: 6 });
        const convoText = history.map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.text}`).join("\n");

        const systemPrompt = `You are ForefrontAgent for ${bot.name}. Use only the provided knowledge. Be concise. If unsure, say "I don't know" and suggest contacting support.`;

        const prompt = [
            systemPrompt,
            "\n-- Retrieved Knowledge --\n",
            contextPieces,
            "\n-- Conversation --\n",
            convoText,
            `\nUser: ${body.message}\nAssistant:`
        ].join("\n");

        const functions = [
            {
                name: "book_appointment",
                description: "Book an appointment",
                parameters: { type: "object", properties: { service: { type: "string" }, date: { type: "string" }, time: { type: "string" } }, required: ["service", "date"] }
            },
            {
                name: "lookup_order",
                description: "Lookup an order by id",
                parameters: { type: "object", properties: { order_id: { type: "string" } }, required: ["order_id"] }
            },
            { name: "create_lead", description: "Create a lead", parameters: { type: "object", properties: { name: { type: "string" }, email: { type: "string" } }, required: ["name"] } }
        ];

        const geminiResp = await chatWithContext({ model: bot.chat_model || undefined, prompt, functions });

        if (geminiResp.function_call) {
            try {
                const fc = geminiResp.function_call;
                const execResult = await executeFunctionCall(bot, conv, fc.name, fc.arguments);
                await saveMessage({ conversationId: String(conv.id), botId: String(bot.id), role: "assistant", text: `Performed action: ${fc.name}`, metadata: { function: fc.name, result: execResult } });
                if (geminiResp.usage?.tokens) await recordUsage({ botId: String(bot.id), tokens: geminiResp.usage.tokens });
                return NextResponse.json({ ok: true, action: true, function: fc.name, result: execResult });
            } catch (err) {
                console.error("function exec error", err);
                return NextResponse.json({ ok: false, error: "function execution failed" }, { status: 500 });
            }
        }

        await saveMessage({ conversationId: String(conv.id), botId: String(bot.id), role: "assistant", text: geminiResp.text, metadata: { source: "rag", retrieved_ids: hits.map((h) => h.id) } });
        if (geminiResp.usage?.tokens) await recordUsage({ botId: String(bot.id), tokens: geminiResp.usage.tokens });

        return NextResponse.json({ ok: true, text: geminiResp.text, source: "rag" });
    } catch (err: any) {
        console.error("message route error", err);
        return NextResponse.json({ error: err?.message ?? "internal error" }, { status: 500 });
    }
}
