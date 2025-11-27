import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bots } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single bot by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const bot = await db
        .select()
        .from(bots)
        .where(eq(bots.id, parseInt(id)))
        .limit(1);

      if (bot.length === 0) {
        return NextResponse.json(
          { error: 'Bot not found', code: 'BOT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(bot[0], { status: 200 });
    }

    // List bots with filters
    let query: any = db.select().from(bots);
    const conditions = [];


    // Filter by owner
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(bots.ownerId, parseInt(userId)));
    }

    // Search by name or domain
    if (search) {
      const searchCondition = or(
        like(bots.name, `%${search}%`),
        like(bots.domain, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(bots.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerId, name, domain, settings } = body;

    // Validate required fields
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required', code: 'MISSING_OWNER_ID' },
        { status: 400 }
      );
    }

    if (typeof ownerId !== 'number' || isNaN(ownerId)) {
      return NextResponse.json(
        { error: 'Valid owner ID is required', code: 'INVALID_OWNER_ID' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Bot name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: 'Bot name cannot be empty', code: 'EMPTY_NAME' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      ownerId,
      name: trimmedName,
      createdAt: new Date().toISOString(),
    };

    if (domain) {
      insertData.domain = domain.trim();
    }

    if (settings) {
      if (typeof settings !== 'object') {
        return NextResponse.json(
          { error: 'Settings must be a valid object', code: 'INVALID_SETTINGS' },
          { status: 400 }
        );
      }
      insertData.settings = JSON.stringify(settings);
    }

    const newBot = await db.insert(bots).values(insertData).returning();

    return NextResponse.json(newBot[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Prevent updating protected fields
    if ('id' in body || 'ownerId' in body || 'createdAt' in body) {
      return NextResponse.json(
        {
          error: 'Cannot update id, ownerId, or createdAt fields',
          code: 'PROTECTED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check if bot exists
    const existingBot = await db
      .select()
      .from(bots)
      .where(eq(bots.id, parseInt(id)))
      .limit(1);

    if (existingBot.length === 0) {
      return NextResponse.json(
        { error: 'Bot not found', code: 'BOT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (trimmedName.length === 0) {
        return NextResponse.json(
          { error: 'Bot name cannot be empty', code: 'EMPTY_NAME' },
          { status: 400 }
        );
      }
      updateData.name = trimmedName;
    }

    if (body.domain !== undefined) {
      updateData.domain = body.domain ? body.domain.trim() : null;
    }

    if (body.settings !== undefined) {
      if (typeof body.settings !== 'object') {
        return NextResponse.json(
          { error: 'Settings must be a valid object', code: 'INVALID_SETTINGS' },
          { status: 400 }
        );
      }
      updateData.settings = JSON.stringify(body.settings);
    }

    // Only update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingBot[0], { status: 200 });
    }

    const updatedBot = await db
      .update(bots)
      .set(updateData)
      .where(eq(bots.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBot[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if bot exists
    const existingBot = await db
      .select()
      .from(bots)
      .where(eq(bots.id, parseInt(id)))
      .limit(1);

    if (existingBot.length === 0) {
      return NextResponse.json(
        { error: 'Bot not found', code: 'BOT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(bots)
      .where(eq(bots.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Bot deleted successfully',
        bot: deleted[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}