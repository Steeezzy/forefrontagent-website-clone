import { db } from '@/db';
import { bots } from '@/db/schema';

async function main() {
    const sampleBots = [
        {
            ownerId: 1,
            name: 'Customer Support Bot',
            domain: 'support.company.com',
            settings: { language: 'en', tone: 'friendly', maxTokens: 500 },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 1,
            name: 'Sales Assistant',
            domain: 'shop.example.com',
            settings: { language: 'en', tone: 'professional', timezone: 'UTC' },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 2,
            name: 'HR Helper',
            domain: 'hr.company.com',
            settings: { language: 'en', tone: 'friendly' },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 2,
            name: 'Product Recommender',
            domain: null,
            settings: { language: 'es', tone: 'casual', timezone: 'America/New_York' },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 3,
            name: 'FAQ Bot',
            domain: 'example.com',
            settings: { language: 'en' },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 4,
            name: 'Booking Assistant',
            domain: null,
            settings: { timezone: 'UTC', language: 'en', tone: 'professional' },
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 4,
            name: 'Tech Support AI',
            domain: 'support.techcompany.com',
            settings: {},
            createdAt: new Date().toISOString(),
        },
        {
            ownerId: 5,
            name: 'Marketing Bot',
            domain: null,
            settings: { language: 'en', tone: 'enthusiastic', timezone: 'America/Los_Angeles' },
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(bots).values(sampleBots);
    
    console.log('✅ Bots seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});