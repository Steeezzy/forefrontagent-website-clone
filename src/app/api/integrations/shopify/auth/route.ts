import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');

    if (!shop) {
        return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
    }

    // Validate shop domain (basic regex)
    const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    if (!shopRegex.test(shop)) {
        return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
    }

    const scopes = 'read_orders,read_products';
    const redirectUri = `${APP_URL}/api/integrations/shopify/callback`;
    const nonce = Math.random().toString(36).substring(7); // Simple nonce

    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`;

    return NextResponse.redirect(installUrl);
}
