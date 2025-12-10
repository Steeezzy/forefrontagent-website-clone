import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { bots } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    console.log("Shopify Auth Start:", { shop, url: req.url });

    if (!shop) {
        return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    // 1. Authenticate User
    const user = await getCurrentUser(req);
    if (!user) {
        console.log("User not logged in, redirecting to login");
        const callbackUrl = encodeURIComponent(`/api/auth/shopify?shop=${shop}`);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?callbackUrl=${callbackUrl}`);
    }

    // 2. Get User's Bot (Default to first one for now)
    const userBots = await db.select().from(bots).where(eq(bots.ownerId, user.id)).limit(1);

    let botId;
    if (userBots.length > 0) {
        botId = userBots[0].id;
    } else {
        // Create a default bot if none exists? Or error?
        // For now, let's error to be safe, or we could create one.
        // Let's assume they should have a bot or we create a default one.
        console.log("No bot found for user, creating default");
        const [newBot] = await db.insert(bots).values({
            ownerId: user.id,
            name: "My First Bot",
            createdAt: new Date().toISOString()
        }).returning();
        botId = newBot.id;
    }

    // Sanitize shop
    const cleanShop = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");

    // Begin OAuth
    try {
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`;

        // Encode state with botId
        const state = JSON.stringify({
            nonce: Date.now().toString(),
            botId: botId
        });

        console.log("Constructing Auth URL:", { cleanShop, redirectUri, botId });

        // Manual construction to be safe
        const authUrl = `https://${cleanShop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=write_script_tags,read_script_tags&redirect_uri=${redirectUri}&state=${encodeURIComponent(state)}`;

        console.log("Redirecting to:", authUrl);
        return NextResponse.redirect(authUrl);

    } catch (error: any) {
        console.error("OAuth Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
