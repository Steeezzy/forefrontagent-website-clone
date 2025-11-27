import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { botKnowledge } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;
    const { searchParams } = new URL(request.url);

    // Validate botId
    const parsedBotId = parseInt(botId);
    if (isNaN(parsedBotId)) {
      return NextResponse.json(
        { error: 'Valid botId is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    // Extract query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const sourceType = searchParams.get('sourceType');

    // Build query
    let query = db
      .select()
      .from(botKnowledge)
      .where(eq(botKnowledge.botId, parsedBotId));

    // Apply sourceType filter if provided
    if (sourceType) {
      query = db
        .select()
        .from(botKnowledge)
        .where(
          and(
            eq(botKnowledge.botId, parsedBotId),
            eq(botKnowledge.sourceType, sourceType)
          )
        );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
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
    if (isNaN(parsedBotId)) {
      return NextResponse.json(
        { error: 'Valid botId is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { sourceType, sourceUrl, content, metadata } = body;

    // Sanitize string inputs
    const sanitizedSourceType = sourceType ? sourceType.trim() : null;
    const sanitizedSourceUrl = sourceUrl ? sourceUrl.trim() : null;
    const sanitizedContent = content ? content.trim() : null;

    // Prepare insert data
    const insertData = {
      botId: parsedBotId,
      sourceType: sanitizedSourceType,
      sourceUrl: sanitizedSourceUrl,
      content: sanitizedContent,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };

    // Insert and return created knowledge entry
    const newKnowledge = await db
      .insert(botKnowledge)
      .values(insertData)
      .returning();

    return NextResponse.json(newKnowledge[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate botId
    const parsedBotId = parseInt(botId);
    if (isNaN(parsedBotId)) {
      return NextResponse.json(
        { error: 'Valid botId is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    // Validate id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid id is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id);

    // Check if knowledge entry exists and belongs to the specified bot
    const existingKnowledge = await db
      .select()
      .from(botKnowledge)
      .where(
        and(
          eq(botKnowledge.id, parsedId),
          eq(botKnowledge.botId, parsedBotId)
        )
      )
      .limit(1);

    if (existingKnowledge.length === 0) {
      return NextResponse.json(
        { error: 'Knowledge entry not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the knowledge entry
    const deleted = await db
      .delete(botKnowledge)
      .where(
        and(
          eq(botKnowledge.id, parsedId),
          eq(botKnowledge.botId, parsedBotId)
        )
      )
      .returning();

    return NextResponse.json(
      {
        message: 'Knowledge entry deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}