import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { botKnowledge } from '@/db/schema';
import { uploadFileToGemini } from '@/lib/gemini';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(req: NextRequest, { params }: { params: Promise<{ botId: string }> }) {
    try {
        const { botId } = await params;
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = join(tmpdir(), file.name);

        await writeFile(tempPath, buffer);

        // Upload to Gemini
        const geminiFile = await uploadFileToGemini(tempPath, file.type);

        // Clean up temp file
        await unlink(tempPath);

        // Save to DB
        await db.insert(botKnowledge).values({
            botId: parseInt(botId),
            sourceType: 'file',
            sourceUrl: geminiFile.uri,
            content: geminiFile.displayName,
            metadata: JSON.stringify({ fileId: geminiFile.name, mimeType: geminiFile.mimeType }),
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, file: geminiFile });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
