import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { integrations } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const botId = params.botId;
    
    // Validate botId
    if (!botId || isNaN(parseInt(botId))) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const parsedBotId = parseInt(botId);
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Filter parameters
    const type = searchParams.get('type');

    // Build query
    let query = db
      .select()
      .from(integrations)
      .where(eq(integrations.botId, parsedBotId))
      .orderBy(desc(integrations.createdAt))
      .limit(limit)
      .offset(offset);

    // Apply type filter if provided
    if (type) {
      query = db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.botId, parsedBotId),
            eq(integrations.type, type.trim())
          )
        )
        .orderBy(desc(integrations.createdAt))
        .limit(limit)
        .offset(offset);
    }

    const results = await query;

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
    const botId = params.botId;
    
    // Validate botId
    if (!botId || isNaN(parseInt(botId))) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const parsedBotId = parseInt(botId);
    const body = await request.json();

    // Extract and validate required fields
    const { type, credentialsEncrypted, config } = body;

    // Validate required field: type
    if (!type || typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json(
        { error: 'Type is required and must be a non-empty string', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedType = type.trim();
    const sanitizedCredentials = credentialsEncrypted 
      ? typeof credentialsEncrypted === 'string' ? credentialsEncrypted.trim() : credentialsEncrypted
      : null;

    // Prepare insert data
    const insertData: {
      botId: number;
      type: string;
      credentialsEncrypted: string | null;
      config: any;
      createdAt: string;
    } = {
      botId: parsedBotId,
      type: sanitizedType,
      credentialsEncrypted: sanitizedCredentials,
      config: config || {},
      createdAt: new Date().toISOString(),
    };

    // Insert and return new integration
    const newIntegration = await db
      .insert(integrations)
      .values(insertData)
      .returning();

    return NextResponse.json(newIntegration[0], { status: 201 });
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
    const botId = params.botId;
    
    // Validate botId
    if (!botId || isNaN(parseInt(botId))) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const parsedBotId = parseInt(botId);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate integration ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid integration ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id);

    // Verify the integration exists and belongs to the specified botId
    const existingIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.id, parsedId),
          eq(integrations.botId, parsedBotId)
        )
      )
      .limit(1);

    if (existingIntegration.length === 0) {
      return NextResponse.json(
        { error: 'Integration not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the integration
    const deleted = await db
      .delete(integrations)
      .where(
        and(
          eq(integrations.id, parsedId),
          eq(integrations.botId, parsedBotId)
        )
      )
      .returning();

    return NextResponse.json(
      {
        message: 'Integration deleted successfully',
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