// src/lib/actions.ts
// Executors for model function calls (book_appointment, lookup_order, create_lead)
// These are safe server-side handlers. Validate inputs before actions.
// TODO: fetch integration credentials from `integrations` table.

import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/index"; // adjust to your drizzle db export
import { appointments, leads } from "@/db/schema";

export async function executeFunctionCall(bot: any, conv: any, name: string, args: any) {
    switch (name) {
        case "book_appointment":
            return await bookAppointment(bot, conv, args);
        case "lookup_order":
            return await lookupOrder(bot, args);
        case "create_lead":
            return await createLead(bot, args);
        default:
            throw new Error("Unknown function: " + name);
    }
}

async function bookAppointment(bot: any, conv: any, args: { service: string; date: string; time?: string }) {
    if (!args?.service || !args?.date) throw new Error("service and date required");
    const id = uuidv4();

    // Example: insert into an 'appointments' table (create migration if needed)
    try {
        await db.insert(appointments).values({
            id,
            botId: parseInt(bot.id),
            conversationId: parseInt(conv.id),
            service: args.service,
            date: args.date,
            time: args.time ?? null,
            createdAt: new Date().toISOString()
        });
    } catch (err) {
        console.error("bookAppointment DB error", err);
    }

    // TODO: If Google Calendar integration exists, use stored OAuth token to create calendar event.
    return { ok: true, booking_id: id, service: args.service, date: args.date, time: args.time ?? null };
}

import { eq } from "drizzle-orm";
import { integrations } from "@/db/schema";

async function lookupOrder(bot: any, args: { order_id: string }) {
    if (!args?.order_id) throw new Error("order_id required");

    // Fetch Shopify credentials
    const integration = await db.query.integrations.findFirst({
        where: eq(integrations.botId, parseInt(bot.id))
    });

    if (!integration || integration.type !== 'shopify' || !integration.credentialsEncrypted) {
        console.warn("No Shopify integration found for bot", bot.id);
        return { ok: false, error: "Shopify integration not configured" };
    }

    // Decrypt token (simple base64 decode for MVP)
    const accessToken = Buffer.from(integration.credentialsEncrypted, 'base64').toString('utf-8');
    const shop = (integration.config as any)?.shop;

    if (!shop) {
        return { ok: false, error: "Shopify shop domain missing in config" };
    }

    try {
        const response = await fetch(`https://${shop}/admin/api/2023-10/orders/${args.order_id}.json`, {
            headers: {
                'X-Shopify-Access-Token': accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`Shopify API error: ${response.statusText}`);
        }

        const data = await response.json();
        return { ok: true, order: data.order };

    } catch (error) {
        console.error("Shopify lookup error", error);
        return { ok: false, error: "Failed to fetch order from Shopify" };
    }
}

async function createLead(bot: any, args: { name: string; email?: string; phone?: string; source?: string }) {
    const id = uuidv4();
    await db.insert(leads).values({
        id,
        botId: parseInt(bot.id),
        name: args.name,
        email: args.email ?? null,
        phone: args.phone ?? null,
        source: args.source ?? "bot",
        createdAt: new Date().toISOString()
    });
    return { ok: true, lead_id: id };
}
