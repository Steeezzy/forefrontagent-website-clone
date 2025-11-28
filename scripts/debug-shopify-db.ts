
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

async function verify() {
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

    console.log("Dumping Shopify integrations...");
    const results = await db.select().from(integrations).where(eq(integrations.type, 'shopify'));

    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
}

verify().catch(console.error);
