import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { integrations, bots } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');
    const code = searchParams.get('code');
    const hmac = searchParams.get('hmac');
    const state = searchParams.get('state'); // Nonce

    if (!shop || !code || !hmac) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify HMAC
    const map = Object.fromEntries(searchParams.entries());
    delete map['hmac'];
    const message = Object.keys(map)
        .sort()
        .map((key) => `${key}=${map[key]}`)
        .join('&');

    const generatedHmac = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET!)
        .update(message)
        .digest('hex');

    if (generatedHmac !== hmac) {
        return NextResponse.json({ error: 'Invalid HMAC' }, { status: 400 });
    }

    // Exchange code for access token
    try {
        const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: SHOPIFY_API_KEY,
                client_secret: SHOPIFY_API_SECRET,
                code,
            }),
        });

        const data = await response.json();
        const accessToken = data.access_token;

        if (!accessToken) {
            return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
        }

        // Store in DB
        // TODO: In a real app, we need to know which bot this integration belongs to.
        // For now, we'll assume a single bot or find the bot associated with this shop if we had that mapping.
        // Since we don't have the botId in the callback state (we could have passed it!), we'll default to the first bot or a placeholder.
        // BETTER APPROACH: Pass botId in the 'state' parameter during auth.

        // Let's assume we passed botId in state like "nonce_botId"
        // But for this MVP, let's just find the first bot to attach it to, or create a new integration entry.

        const botList = await db.select().from(bots).limit(1);
        if (botList.length === 0) {
            return NextResponse.json({ error: 'No bots found to attach integration to' }, { status: 404 });
        }
        const botId = botList[0].id;

        // Check if integration exists
        const existing = await db.select().from(integrations).where(
            eq(integrations.botId, botId)
        );

        // Simple encryption (placeholder) - in production use a proper encryption library
        const encryptedToken = Buffer.from(accessToken).toString('base64');

        await db.insert(integrations).values({
            botId,
            type: 'shopify',
            credentialsEncrypted: encryptedToken,
            config: { shop },
            createdAt: new Date().toISOString()
        });

        return NextResponse.redirect(`https://${shop}/admin/apps/${SHOPIFY_API_KEY}`);

    } catch (error) {
        console.error('Shopify OAuth error:', error);
        return NextResponse.json({ error: 'OAuth failed' }, { status: 500 });
    }
}
