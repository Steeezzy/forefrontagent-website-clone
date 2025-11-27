import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { flows } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const botId = parseInt(params.botId);
    
    if (isNaN(botId)) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db
      .select()
      .from(flows)
      .where(eq(flows.botId, botId))
      .orderBy(desc(flows.createdAt))
      .limit(limit)
      .offset(offset);

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
    const botId = parseInt(params.botId);
    
    if (isNaN(botId)) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, nodes } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!nodes) {
      return NextResponse.json(
        { error: 'Nodes are required', code: 'MISSING_NODES' },
        { status: 400 }
      );
    }

    const newFlow = await db
      .insert(flows)
      .values({
        botId,
        name: name.trim(),
        nodes,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFlow[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const botId = parseInt(params.botId);
    
    if (isNaN(botId)) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid flow ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const flowId = parseInt(id);

    const existing = await db
      .select()
      .from(flows)
      .where(and(eq(flows.id, flowId), eq(flows.botId, botId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Flow not found', code: 'FLOW_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, nodes } = body;

    const updates: Partial<typeof flows.$inferInsert> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (nodes !== undefined) {
      updates.nodes = nodes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    const updated = await db
      .update(flows)
      .set(updates)
      .where(and(eq(flows.id, flowId), eq(flows.botId, botId)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Flow not found', code: 'FLOW_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
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
    const botId = parseInt(params.botId);
    
    if (isNaN(botId)) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid flow ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const flowId = parseInt(id);

    const existing = await db
      .select()
      .from(flows)
      .where(and(eq(flows.id, flowId), eq(flows.botId, botId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Flow not found', code: 'FLOW_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(flows)
      .where(and(eq(flows.id, flowId), eq(flows.botId, botId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Flow not found', code: 'FLOW_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Flow deleted successfully',
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