import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = process.env.GENAI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const fileManager = apiKey ? new GoogleAIFileManager(apiKey) : null;

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

export async function uploadFileToGemini(path: string, mimeType: string) {
    if (!fileManager) throw new Error("GENAI_API_KEY is not set");

    const uploadResponse = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path.split('/').pop(),
    });

    return uploadResponse.file;
}

export async function geminiFileSearch(params: {
    model: string;
    fileIds: string[];
    query: string;
}) {
    if (!genAI) throw new Error("GENAI_API_KEY is not set");

    const model = genAI.getGenerativeModel({ model: params.model });

    // Construct a prompt that includes the file context
    // Note: In a real production scenario with Gemini 1.5 Pro, you can pass fileData parts directly.
    // For this implementation, we assume fileIds are valid Gemini File API URIs or names.

    const result = await model.generateContent([
        { text: params.query },
        ...params.fileIds.map(uri => ({
            fileData: {
                mimeType: "application/pdf", // Simplified: assuming PDF for now, should be dynamic
                fileUri: uri
            }
        }))
    ]);

    const response = await result.response;
    const text = response.text();

    return {
        text,
        tokens: response.usageMetadata?.totalTokenCount || 0,
        cost: 0, // Calculate based on tokens if needed
    };
}
