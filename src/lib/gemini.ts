// src/lib/gemini.ts
// Gemini (Vertex AI / Google GenAI) wrapper utilities.
// NOTE: adjust SDK imports to the SDK you have installed. This file uses
// example shapes and includes comments where to adapt to your environment.

import type { GenerateResponse } from "@google/generative-ai"; // adjust if needed
// If SDK not available, you can use REST fetch with ADC (Application Default Credentials).

const API_KEY = process.env.GENAI_API_KEY || "";
const DEFAULT_MODEL = process.env.GENAI_MODEL || "gemini-2.5-flash";
const EMBEDDING_MODEL = process.env.GENAI_EMBEDDING_MODEL || "gemini-embedding-001";

/**
 * IMPORTANT:
 * Replace the clients below with the actual SDK classes you install.
 * Example packages: @google/generative-ai, google-genai, @google-cloud/aiplatform
 *
 * If you don't install any SDK yet, keep these functions but implement
 * a fetch-based fallback (commented examples included).
 */

// Placeholder client objects — replace with actual SDK clients.
let textClient: any = null;
let embedClient: any = null;

// Lazy init (try to load SDK if available)
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const genai = require("@google/generative-ai");
    // Adjust client instantiation per SDK docs:
    textClient = new genai.TextServiceClient?.({ apiKey: API_KEY }) ?? genai;
    embedClient = new genai.EmbeddingsServiceClient?.({ apiKey: API_KEY }) ?? genai;
} catch (e) {
    // SDK not available — functions will throw if used.
    // Antigravity might leave as-is; run `npm i @google/generative-ai` or adapt to fetch.
}

/**
 * fileSearchQuery(fileIds, query)
 * Call Gemini file search (if using Gemini File Search).
 * Returns: { text: string, usage?: { tokens?: number } }
 */
export async function fileSearchQuery(fileIds: string[], query: string) {
    if (!textClient) {
        throw new Error("GenAI SDK not initialized. Install @google/generative-ai or implement REST fallback.");
    }

    try {
        // SDK-specific call (pseudo-code). Adapt per your SDK docs.
        const req: any = {
            model: DEFAULT_MODEL,
            messages: [{ role: "user", content: query }],
            // Many SDKs support a `fileIds` or `contextFiles` parameter — add accordingly.
            // fileIds
        };

        const res: any = await textClient.generate(req);
        const candidate = res?.candidates?.[0] || res?.output?.[0] || {};
        const text = candidate?.content?.map?.((c: any) => c?.text ?? c).join("") ?? String(candidate);
        const tokens = res?.usage?.total_tokens ?? undefined;
        return { text: String(text).trim(), usage: { tokens } };
    } catch (err) {
        console.error("fileSearchQuery error:", err);
        throw err;
    }
}

/**
 * embedText(text) -> Promise<number[]>
 */
export async function embedText(text: string): Promise<number[]> {
    if (!embedClient) {
        throw new Error("GenAI Embedding client not initialized. Install @google/generative-ai or implement REST fallback.");
    }
    try {
        const resp: any = await embedClient.embed?.({ model: EMBEDDING_MODEL, input: [text] }) || await embedClient.embedContent?.({ model: EMBEDDING_MODEL, input: [text] });
        // Parse embedding
        const vector = resp?.data?.[0]?.embedding || resp?.embeddings?.[0]?.embedding;
        if (!vector) throw new Error("No embedding returned");
        return vector as number[];
    } catch (err) {
        console.error("embedText error:", err);
        throw err;
    }
}

/**
 * chatWithContext({ model, prompt, functions })
 * prompt may be string or messages array
 * returns { text, function_call?, usage? }
 */
export async function chatWithContext(opts: {
    model?: string;
    prompt: string | Array<{ role: string; content: string }>;
    functions?: any[];
}) {
    if (!textClient) {
        throw new Error("GenAI chat client not initialized.");
    }

    try {
        const model = opts.model ?? DEFAULT_MODEL;
        const messages = typeof opts.prompt === "string" ? [{ role: "user", content: opts.prompt }] : opts.prompt;
        const req: any = { model, messages, temperature: 0.0, maxOutputTokens: 800 };
        if (opts.functions) req.functions = opts.functions;

        const res: any = await textClient.generate(req);
        const candidate = res?.candidates?.[0] || res?.output?.[0] || {};
        const text = candidate?.content?.map?.((c: any) => (c?.text ?? c))?.join("") ?? candidate?.content ?? "";
        const function_call = candidate?.metadata?.function_call ?? candidate?.function_call ?? undefined;
        const tokens = res?.usage?.total_tokens ?? undefined;
        return { text: String(text).trim(), function_call, usage: { tokens } };
    } catch (err) {
        console.error("chatWithContext error:", err);
        throw err;
    }
}
