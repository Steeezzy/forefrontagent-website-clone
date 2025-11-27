import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { usage } from '@/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const { botId } = params;
    
    // Validate botId
    if (!botId || isNaN(parseInt(botId))) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const botIdInt = parseInt(botId);
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Date range filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where conditions
    const conditions = [eq(usage.botId, botIdInt)];
    
    if (startDate) {
      conditions.push(gte(usage.date, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(usage.date, endDate));
    }

    const whereCondition = conditions.length > 1 
      ? and(...conditions) 
      : conditions[0];

    // Fetch records
    const records = await db
      .select()
      .from(usage)
      .where(whereCondition)
      .orderBy(desc(usage.date))
      .limit(limit)
      .offset(offset);

    // Calculate totals
    const totalsResult = await db
      .select({
        totalTokens: sql<number>`COALESCE(SUM(${usage.tokens}), 0)`,
        totalCost: sql<string>`COALESCE(SUM(CAST(${usage.cost} AS REAL)), 0)`
      })
      .from(usage)
      .where(whereCondition);

    const totals = {
      totalTokens: totalsResult[0]?.totalTokens || 0,
      totalCost: totalsResult[0]?.totalCost || '0'
    };

    return NextResponse.json({
      records,
      totals
    }, { status: 200 });

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
    if (!botId || isNaN(parseInt(botId))) {
      return NextResponse.json(
        { error: 'Valid bot ID is required', code: 'INVALID_BOT_ID' },
        { status: 400 }
      );
    }

    const botIdInt = parseInt(botId);
    const body = await request.json();
    const { tokens, cost, date } = body;

    // Validate required fields
    if (tokens === undefined || tokens === null) {
      return NextResponse.json(
        { error: 'Tokens field is required', code: 'MISSING_TOKENS' },
        { status: 400 }
      );
    }

    if (cost === undefined || cost === null) {
      return NextResponse.json(
        { error: 'Cost field is required', code: 'MISSING_COST' },
        { status: 400 }
      );
    }

    // Validate tokens
    const tokensInt = parseInt(tokens);
    if (isNaN(tokensInt) || tokensInt < 0) {
      return NextResponse.json(
        { error: 'Tokens must be a valid non-negative integer', code: 'INVALID_TOKENS' },
        { status: 400 }
      );
    }

    // Validate cost
    const costNum = typeof cost === 'string' ? parseFloat(cost) : cost;
    if (isNaN(costNum) || costNum < 0) {
      return NextResponse.json(
        { error: 'Cost must be a valid non-negative number', code: 'INVALID_COST' },
        { status: 400 }
      );
    }

    // Convert cost to string for storage
    const costString = costNum.toString();

    // Generate timestamps
    const now = new Date();
    const createdAt = now.toISOString();
    const usageDate = date || now.toISOString().split('T')[0];

    // Insert new usage record
    const newUsage = await db
      .insert(usage)
      .values({
        botId: botIdInt,
        tokens: tokensInt,
        cost: costString,
        date: usageDate,
        createdAt
      })
      .returning();

    return NextResponse.json(newUsage[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}