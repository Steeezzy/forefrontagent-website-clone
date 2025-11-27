import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GENAI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function geminiChat(params: {
    model: string;
    systemPrompt?: string;
    messages: { role: string; content: string }[];
    tools?: any[];
}) {
    if (!genAI) throw new Error("GENAI_API_KEY is not set");

    const model = genAI.getGenerativeModel({ model: params.model });

    const chat = model.startChat({
        history: params.messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        })),
        systemInstruction: params.systemPrompt,
    });

    const result = await chat.sendMessage("");
    const response = await result.response;
    const text = response.text();

    return {
        text,
        tokens: response.usageMetadata?.totalTokenCount || 0,
    };
}

export async function geminiEmbed(text: string) {
    if (!genAI) throw new Error("GENAI_API_KEY is not set");

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

export async function geminiFileSearch(params: {
    model: string;
    fileIds: string[];
    query: string;
}) {
    // Placeholder for File Search implementation
    // Real implementation would involve uploading files to Gemini and using the retrieval tool
    return {
        text: "File search response placeholder (Not implemented yet)",
        tokens: 0,
        cost: 0,
    };
}
