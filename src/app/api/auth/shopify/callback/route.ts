import { NextRequest, NextResponse } from "next/server";
import shopify from "@/lib/shopify";
import { db } from "@/db";
import { integrations } from "@/db/schema";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    console.log("Shopify Callback:", { shop, code, state });

    if (!shop || !code) {
        console.error("Missing shop or code");
        return NextResponse.json({ error: "Missing shop or code" }, { status: 400 });
    }

    try {
        // Decode state to get botId
        let botId = 1; // Default fallback
        if (state) {
            try {
                const decodedState = JSON.parse(decodeURIComponent(state)); // or just state if not double encoded
                // Note: In the auth route we did encodeURIComponent(state), so it might come back decoded or not depending on Next.js handling.
                // searchParams.get() usually decodes once.
                // Let's try parsing directly, if it fails, it might be a simple string nonce from old flow.
                if (decodedState.botId) {
                    botId = decodedState.botId;
                }
            } catch (e) {
                console.log("State is not JSON or invalid:", state);
            }
        }

        console.log("Exchanging token for shop:", shop);

        // Manual exchange to avoid library complexity for now
        const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code,
            })
        });

        const tokenData = await tokenRes.json();
        console.log("Token Response:", tokenData);

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error("Failed to get access token: " + JSON.stringify(tokenData));
        }

        // Inject ScriptTag
        const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const widgetUrl = `${host}/tsukai-widget.js`;
        console.log("Injecting Widget:", widgetUrl);

        const scriptRes = await fetch(`https://${shop}/admin/api/2024-01/script_tags.json`, {
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

        console.log("Script Injection Status:", scriptRes.status);
        if (!scriptRes.ok) {
            const scriptErr = await scriptRes.json();
            console.error("Script Injection Error:", scriptErr);
        }

        // Save to DB
        await db.insert(integrations).values({
            botId,
            type: "shopify",
            credentialsEncrypted: accessToken,
            config: { shopUrl: shop },
            createdAt: new Date().toISOString(),
        });

        console.log("Integration Saved to DB");

        // Redirect to dashboard with success message
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?success=true`);

    } catch (error: any) {
        console.error("OAuth Callback Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
