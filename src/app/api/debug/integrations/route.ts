import { NextResponse } from "next/server";
import { db } from "@/db";
import { integrations } from "@/db/schema";

export async function GET() {
    try {
        const all = await db.select().from(integrations);
        return NextResponse.json(all);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
