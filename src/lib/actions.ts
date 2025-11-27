import { db } from "@/db/index";
import { v4 as uuidv4 } from "uuid";
import { appointments, leads } from "@/db/schema";

/**
 * executeFunctionCall
 * name: function name returned by model
 * args: parsed object
 */
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

/**
 * bookAppointment - Google Calendar integration example (stub)
 * Expected args: { service: string, date: "YYYY-MM-DD", time: "HH:MM" }
 */
async function bookAppointment(bot: any, conv: any, args: { service: string; date: string; time?: string }) {
    // Validate inputs:
    if (!args.service || !args.date) throw new Error("service and date required");

    // TODO: Use saved OAuth tokens for the bot (store in integrations table)
    // Example stub: create a local booking row and return confirmation
    const id = uuidv4();
    const row = {
        id,
        botId: bot.id,
        conversationId: conv.id,
        service: args.service,
        date: args.date,
        time: args.time ?? null,
        createdAt: new Date().toISOString()
    };
    await db.insert(appointments).values(row);
    return { ok: true, booking_id: id, ...row };
}

/**
 * lookupOrder - Shopify order lookup stub
 * Expected args: { order_id: string }
 */
async function lookupOrder(bot: any, args: { order_id: string }) {
    if (!args.order_id) throw new Error("order_id required");
    // TODO: Use integration credentials (shopify access token) stored in integrations table
    // Example: fetch from shopify admin API:
    // const res = await fetch(`https://${shopDomain}/admin/api/2025-01/orders/${args.order_id}.json`, { headers: { 'X-Shopify-Access-Token': token }});
    // const order = await res.json();
    // For now return a stub:
    return { ok: true, order: { id: args.order_id, status: "processing", total: "₹1234.00" } };
}

/**
 * createLead - Save lead in DB
 * Expected args: { name: string, email?: string, phone?: string, source?: string }
 */
async function createLead(bot: any, args: { name: string; email?: string; phone?: string; source?: string }) {
    const id = uuidv4();
    await db.insert(leads).values({
        id,
        botId: bot.id,
        name: args.name,
        email: args.email ?? null,
        phone: args.phone ?? null,
        source: args.source ?? "bot",
        createdAt: new Date().toISOString()
    });
    return { ok: true, lead_id: id };
}
