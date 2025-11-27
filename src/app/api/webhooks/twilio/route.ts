import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        const from = body.From as string; // whatsapp:+1234567890
        const bodyText = body.Body as string;

        console.log(`Received Twilio message from ${from}: ${bodyText}`);

        // TODO: Forward to /api/message logic
        // 1. Identify bot based on To number
        // 2. Call chat engine
        // 3. Reply via Twilio API

        return new NextResponse('<Response></Response>', {
            headers: { 'Content-Type': 'text/xml' }
        });
    } catch (error) {
        console.error("Twilio webhook error:", error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
