import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Assuming auth helper exists, or we use headers
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // For now, we'll assume a single user or get user from header/session
    // In a real app, use session validation
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Mock user ID for now if auth isn't fully set up in this context
    // or try to get from query param for testing
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual user ID from session
    const userId = 1;

    const userBots = await db.select().from(bots).where(eq(bots.ownerId, userId)).limit(limit);

    return NextResponse.json(userBots);
  } catch (error: any) {
    console.error("Error fetching bots:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, domain, settings } = body;

    // TODO: Replace with actual user ID
    const userId = 1;

    const [newBot] = await db.insert(bots).values({
      ownerId: userId,
      name: name || "My Agent",
      domain,
      settings: settings || {},
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(newBot);
  } catch (error: any) {
    console.error("Error creating bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Bot ID required" }, { status: 400 });
    }

    const [updatedBot] = await db.update(bots)
      .set({
        ...body,
        settings: body.settings, // Ensure settings is treated as JSON
      })
      .where(eq(bots.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBot);
  } catch (error: any) {
    console.error("Error updating bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}