
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

async function run() {
    // Load .env
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

    const { db } = await import('../src/db/index');
    const { integrations } = await import('../src/db/schema');

    console.log("Deleting invalid Shopify integration records...");

    // Delete where credentials look like the mock data
    const result = await db.delete(integrations).where(eq(integrations.credentialsEncrypted, 'enc_shop_1234abcd'));

    console.log("Deleted mock records.");
    process.exit(0);
}

run().catch(console.error);
