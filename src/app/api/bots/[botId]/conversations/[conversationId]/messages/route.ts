import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ botId: string; conversationId: string }> }
) {
    try {
        const { botId, conversationId } = await params;

        // Validate IDs
        const parsedBotId = parseInt(botId);
        const parsedConversationId = parseInt(conversationId);

        if (isNaN(parsedBotId) || isNaN(parsedConversationId)) {
            return NextResponse.json(
                { error: 'Valid IDs are required', code: 'INVALID_ID' },
                { status: 400 }
            );
        }

        const results = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, parsedConversationId))
            .orderBy(asc(messages.createdAt));

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error('GET messages error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
