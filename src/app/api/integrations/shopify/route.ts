import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { integrations } from "@/db/schema";

export async function POST(req: NextRequest) {
    try {
        const { shopUrl, accessToken, botId } = await req.json();

        if (!shopUrl || !accessToken || !botId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Clean shop URL
        const cleanShopUrl = shopUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

        // 1. Verify credentials by fetching shop info
        const shopRes = await fetch(`https://${cleanShopUrl}/admin/api/2024-01/shop.json`, {
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },
        });

        if (!shopRes.ok) {
            return NextResponse.json(
                { error: "Invalid Shopify credentials. Please check your URL and Access Token." },
                { status: 401 }
            );
        }

        // 2. Inject ScriptTag
        // This adds our widget JS to their store
        // Note: In production, use your real domain (e.g., https://tsukai.com/tsukai-widget.js)
        // For local dev with Cloudflare tunnel, use that URL
        // We'll try to detect the host or use a placeholder
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const widgetUrl = `${protocol}://${host}/tsukai-widget.js`;

        const scriptRes = await fetch(`https://${cleanShopUrl}/admin/api/2024-01/script_tags.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script_tag: {
                    event: "onload",
                    src: widgetUrl,
                    display_scope: "all",
                },
            }),
        });

        if (!scriptRes.ok) {
            const errorData = await scriptRes.json();
            console.error("Script injection failed:", errorData);
            // Continue anyway to save credentials, but warn
        }

        // 3. Save integration to DB
        await db.insert(integrations).values({
            botId,
            type: "shopify",
            credentialsEncrypted: accessToken, // TODO: Encrypt this in production!
            config: { shopUrl: cleanShopUrl },
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Shopify connection error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to connect to Shopify" },
            { status: 500 }
        );
    }
}
