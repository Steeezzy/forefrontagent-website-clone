import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;
    const { searchParams } = new URL(request.url);

    // Validate botId
    const parsedBotId = parseInt(botId);
    if (!botId || isNaN(parsedBotId)) {
      return NextResponse.json(
        { 
          error: 'Valid bot ID is required',
          code: 'INVALID_BOT_ID' 
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userIdParam = searchParams.get('userId');

    // Build query with botId filter
    let query = db.select()
      .from(conversations)
      .where(eq(conversations.botId, parsedBotId))
      .orderBy(desc(conversations.createdAt));

    // Add userId filter if provided
    if (userIdParam) {
      const parsedUserId = parseInt(userIdParam);
      if (!isNaN(parsedUserId)) {
        query = db.select()
          .from(conversations)
          .where(
            and(
              eq(conversations.botId, parsedBotId),
              eq(conversations.userId, parsedUserId)
            )
          )
          .orderBy(desc(conversations.createdAt));
      }
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;

    // Validate botId
    const parsedBotId = parseInt(botId);
    if (!botId || isNaN(parsedBotId)) {
      return NextResponse.json(
        { 
          error: 'Valid bot ID is required',
          code: 'INVALID_BOT_ID' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, sessionId, metadata } = body;

    // Sanitize string inputs
    const sanitizedSessionId = sessionId ? sessionId.trim() : null;

    // Validate userId if provided
    let sanitizedUserId = null;
    if (userId !== undefined && userId !== null) {
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
        return NextResponse.json(
          { 
            error: 'User ID must be a valid integer',
            code: 'INVALID_USER_ID' 
          },
          { status: 400 }
        );
      }
      sanitizedUserId = parsedUserId;
    }

    // Validate metadata if provided
    let sanitizedMetadata = {};
    if (metadata !== undefined && metadata !== null) {
      if (typeof metadata !== 'object' || Array.isArray(metadata)) {
        return NextResponse.json(
          { 
            error: 'Metadata must be a valid object',
            code: 'INVALID_METADATA' 
          },
          { status: 400 }
        );
      }
      sanitizedMetadata = metadata;
    }

    // Create new conversation
    const newConversation = await db.insert(conversations)
      .values({
        botId: parsedBotId,
        userId: sanitizedUserId,
        sessionId: sanitizedSessionId,
        metadata: sanitizedMetadata,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newConversation[0], { status: 201 });
  } catch (error) {
    console.error('POST conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}