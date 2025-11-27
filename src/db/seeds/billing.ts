import { db } from '@/db';
import { billing } from '@/db/schema';

async function main() {
    const sampleBilling = [
        {
            botId: 1,
            stripeCustomerId: null,
            planId: 'free',
            seats: 1,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            stripeCustomerId: null,
            planId: 'free',
            seats: 1,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            stripeCustomerId: 'cus_NffrFeUfNV2Hib',
            planId: 'starter',
            seats: 1,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            stripeCustomerId: 'cus_Ox4K9zY2mN8pQ3',
            planId: 'starter',
            seats: 2,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            stripeCustomerId: 'cus_PqL7mR5tV9wX2B',
            planId: 'starter',
            seats: 1,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            stripeCustomerId: 'cus_QrM8nS6uW0xY3C',
            planId: 'pro',
            seats: 3,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            stripeCustomerId: 'cus_RsN9oT7vX1yZ4D',
            planId: 'pro',
            seats: 5,
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            stripeCustomerId: 'cus_StO0pU8wY2zA5E',
            planId: 'enterprise',
            seats: 10,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(billing).values(sampleBilling);
    
    console.log('✅ Billing seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});