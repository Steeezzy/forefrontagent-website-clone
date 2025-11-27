import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const hmac = req.headers.get('X-Shopify-Hmac-Sha256');
        const body = await req.text();

        // Verify HMAC
        const secret = process.env.SHOPIFY_API_SECRET;
        if (secret) {
            const hash = crypto.createHmac('sha256', secret).update(body).digest('base64');
            if (hash !== hmac) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const topic = req.headers.get('X-Shopify-Topic');
        const data = JSON.parse(body);

        console.log(`Received Shopify webhook: ${topic}`, data);

        // TODO: Handle specific topics (products/update, orders/create)

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Shopify webhook error:", error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
