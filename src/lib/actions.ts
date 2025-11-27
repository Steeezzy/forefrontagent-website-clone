// src/lib/actions.ts
// Executors for model function calls (book_appointment, lookup_order, create_lead)
// These are safe server-side handlers. Validate inputs before actions.
// TODO: fetch integration credentials from `integrations` table.

import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/index"; // adjust to your drizzle db export

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
        await db.insert("appointments").values({
            id,
            bot_id: bot.id,
            conversation_id: conv.id,
            service: args.service,
            date: args.date,
            time: args.time ?? null,
            created_at: new Date().toISOString()
        });
    } catch (err) {
        console.error("bookAppointment DB error", err);
    }

    // TODO: If Google Calendar integration exists, use stored OAuth token to create calendar event.
    return { ok: true, booking_id: id, service: args.service, date: args.date, time: args.time ?? null };
}

async function lookupOrder(bot: any, args: { order_id: string }) {
    if (!args?.order_id) throw new Error("order_id required");
    // TODO: Fetch Shopify credentials from integrations table and call Shopify Admin API
    // Replace with actual fetch:
    // const shopToken = await getIntegrationToken(bot.id, 'shopify');
    // return fetchShopifyOrder(shopToken, args.order_id)

    // Stub response:
    return { ok: true, order: { id: args.order_id, status: "processing", total: "₹1234.00" } };
}

async function createLead(bot: any, args: { name: string; email?: string; phone?: string; source?: string }) {
    const id = uuidv4();
    await db.insert("leads").values({
        id,
        bot_id: bot.id,
        name: args.name,
        email: args.email ?? null,
        phone: args.phone ?? null,
        source: args.source ?? "bot",
        created_at: new Date().toISOString()
    });
    return { ok: true, lead_id: id };
}
