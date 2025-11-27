import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;

    // Validate conversationId is a valid integer
    if (!conversationId || isNaN(parseInt(conversationId))) {
      return NextResponse.json(
        { 
          error: 'Valid conversation ID is required',
          code: 'INVALID_CONVERSATION_ID' 
        },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parseInt(conversationId)))
      .orderBy(asc(messages.createdAt))
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
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;

    // Validate conversationId is a valid integer
    if (!conversationId || isNaN(parseInt(conversationId))) {
      return NextResponse.json(
        { 
          error: 'Valid conversation ID is required',
          code: 'INVALID_CONVERSATION_ID' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, text, metadata } = body;

    // Validate required fields
    if (!role || typeof role !== 'string' || role.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Role is required and must be a non-empty string',
          code: 'MISSING_ROLE' 
        },
        { status: 400 }
      );
    }

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Text is required and must be a non-empty string',
          code: 'MISSING_TEXT' 
        },
        { status: 400 }
      );
    }

    // Validate role is one of allowed values
    const allowedRoles = ['user', 'assistant', 'system'];
    const sanitizedRole = role.trim();
    
    if (!allowedRoles.includes(sanitizedRole)) {
      return NextResponse.json(
        { 
          error: `Role must be one of: ${allowedRoles.join(', ')}`,
          code: 'INVALID_ROLE' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedText = text.trim();

    // Prepare insert data
    const insertData: {
      conversationId: number;
      role: string;
      text: string;
      metadata?: object;
      createdAt: string;
    } = {
      conversationId: parseInt(conversationId),
      role: sanitizedRole,
      text: sanitizedText,
      createdAt: new Date().toISOString(),
    };

    // Add metadata if provided
    if (metadata !== undefined && metadata !== null) {
      if (typeof metadata === 'object' && !Array.isArray(metadata)) {
        insertData.metadata = metadata;
      } else {
        return NextResponse.json(
          { 
            error: 'Metadata must be a valid object',
            code: 'INVALID_METADATA' 
          },
          { status: 400 }
        );
      }
    }

    // Insert new message
    const newMessage = await db
      .insert(messages)
      .values(insertData)
      .returning();

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}