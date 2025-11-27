export function chunkText(text: string, maxTokens: number = 500): string[] {
    // Simple character-based chunking for now (approx 4 chars per token)
    const chunkSize = maxTokens * 4;
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }

    return chunks;
}
