
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) process.env[key] = value;
        }
    });
}

async function run() {
    const { executeFunctionCall } = await import('../src/lib/actions');
    const { db } = await import('../src/db/index');
    const { bots } = await import('../src/db/schema');

    const orderId = process.argv[2];
    if (!orderId) {
        console.error("Usage: npx tsx scripts/test-shopify-order.ts <ORDER_ID>");
        process.exit(1);
    }

    console.log(`Testing lookup_order for Order ID: ${orderId}...`);

    // Get the first bot
    const botList = await db.select().from(bots).limit(1);
    if (botList.length === 0) {
        console.error("❌ No bots found in DB. Please create a bot first.");
        process.exit(1);
    }
    const bot = botList[0];
    console.log(`Using Bot ID: ${bot.id}`);

    try {
        const result = await executeFunctionCall(bot, { id: 'test-conv' }, 'lookup_order', { order_id: orderId });
        console.log("---------------------------------------------------");
        console.log("Result:", JSON.stringify(result, null, 2));
        console.log("---------------------------------------------------");
    } catch (error) {
        console.error("❌ Error executing action:", error);
    }
    process.exit(0);
}

run().catch(console.error);
