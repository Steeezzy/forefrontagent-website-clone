import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    try {
        const { botId } = await params;

        // Validate botId
        const parsedBotId = parseInt(botId);
        if (isNaN(parsedBotId)) {
            return NextResponse.json(
                { error: 'Valid botId is required', code: 'INVALID_BOT_ID' },
                { status: 400 }
            );
        }

        const results = await db
            .select()
            .from(leads)
            .where(eq(leads.botId, parsedBotId))
            .orderBy(desc(leads.createdAt));

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error('GET leads error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
