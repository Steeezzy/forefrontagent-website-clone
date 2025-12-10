import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { message, conversationId, botId, userId, channel = "web" } = await req.json();

        if (!message || !botId) {
            return NextResponse.json(
                { error: "Message and botId are required" },
                { status: 400 }
            );
        }

        // Get or create conversation
        let conversation;
        if (conversationId) {
            const existing = await db.query.conversations.findFirst({
                where: eq(conversations.id, conversationId),
            });
            conversation = existing;
        } else {
            // Create new conversation
            const [newConv] = await db
                .insert(conversations)
                .values({
                    botId,
                    userId,
                    // Store channel in metadata since it's not in schema
                    metadata: { channel },
                    createdAt: new Date().toISOString(),
                })
                .returning();
            conversation = newConv;
        }

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        // Save user message
        await db.insert(messages).values({
            conversationId: conversation.id,
            role: "user",
            text: message,
            createdAt: new Date().toISOString(),
        });

        // Get conversation history for context
        const history = await db.query.messages.findMany({
            where: eq(messages.conversationId, conversation.id),
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
            limit: 10,
        });

        // Get bot's knowledge base (if any)
        // Note: botKnowledge table might not be queried correctly if not imported or if schema differs
        // Assuming botKnowledge is available in db.query
        // If not, we skip it for now or fix imports if needed. 
        // The previous code used db.query.knowledgeBase which might be wrong if the table export name is botKnowledge
        // Let's check schema export name: export const botKnowledge = ...
        // Drizzle query key depends on how it's exported in db/index.ts. 
        // Usually it matches the export name. Let's assume 'botKnowledge'.

        let contextText = "";
        try {
            // Safe check in case knowledgeBase is not in db query builder
            // @ts-ignore
            const knowledgeBase = await db.query.botKnowledge?.findMany({
                where: eq(conversations.botId, botId),
                limit: 5,
            });

            if (knowledgeBase) {
                contextText = knowledgeBase
                    .map((kb: any) => kb.content)
                    .join("\n\n");
            }
        } catch (e) {
            console.warn("Knowledge base query failed, proceeding without context", e);
        }

        // Prepare conversation history
        const chatHistory = history
            .reverse()
            .map((msg) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
            }));

        // Initialize the model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are Tsukai, an intelligent AI customer service agent.

${contextText ? `KNOWLEDGE BASE:\n${contextText}\n\n` : ""}

Use the knowledge base to answer questions accurately. If you don't know something, admit it and offer to connect the customer with a human agent.

Adapt your tone based on the channel:
- web/shopify: Professional and helpful
- whatsapp/instagram: Casual with occasional emojis
- discord/slack: Community-friendly
- email: Detailed and formal

Keep responses concise and actionable.`,
        });

        // Start chat with history
        const chat = model.startChat({
            history: chatHistory.slice(0, -1), // Exclude the current message
        });

        // Generate response
        const result = await chat.sendMessage(message);
        const aiResponse = result.response.text();

        // Save AI response
        await db.insert(messages).values({
            conversationId: conversation.id,
            role: "assistant",
            text: aiResponse,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            response: aiResponse,
            conversationId: conversation.id,
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process chat" },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve conversation history
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json(
                { error: "conversationId is required" },
                { status: 400 }
            );
        }

        const history = await db.query.messages.findMany({
            where: eq(messages.conversationId, parseInt(conversationId)),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        });

        return NextResponse.json({
            success: true,
            messages: history,
        });
    } catch (error: any) {
        console.error("Get History Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get history" },
            { status: 500 }
        );
    }
}
