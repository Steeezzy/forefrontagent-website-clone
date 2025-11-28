
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

async function verify() {
    // 1. Load .env manually BEFORE importing db
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log("Loading .env from:", envPath);
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn("⚠️ .env file not found at:", envPath);
    }

    // 2. Dynamic import of DB (this ensures env vars are set first)
    const { db } = await import('../src/db/index');
    const { integrations } = await import('../src/db/schema');

    console.log("Checking for Shopify integrations...");
    const results = await db.select().from(integrations).where(eq(integrations.type, 'shopify'));

    if (results.length === 0) {
        console.log("❌ No Shopify integrations found.");
    } else {
        console.log(`✅ Found ${results.length} Shopify integration(s)!`);
        results.forEach(i => {
            console.log(`- Bot ID: ${i.botId}`);
            console.log(`- Shop: ${(i.config as any)?.shop}`);
            console.log(`- Encrypted Token: ${i.credentialsEncrypted ? 'Present' : 'Missing'}`);
        });
    }
    process.exit(0);
}

verify().catch(console.error);
