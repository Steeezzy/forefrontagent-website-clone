import { db } from '@/db';
import { usage } from '@/db/schema';

async function main() {
    const today = new Date();
    const sampleUsage = [
        {
            botId: 1,
            tokens: 5420,
            cost: "0.01",
            date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 1,
            tokens: 12340,
            cost: "0.02",
            date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            tokens: 8900,
            cost: "0.02",
            date: new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            tokens: 25600,
            cost: "0.05",
            date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            tokens: 45200,
            cost: "0.09",
            date: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            tokens: 18750,
            cost: "0.04",
            date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            tokens: 32100,
            cost: "0.06",
            date: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            tokens: 7850,
            cost: "0.02",
            date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            tokens: 15600,
            cost: "0.03",
            date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            tokens: 41300,
            cost: "0.08",
            date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            tokens: 28900,
            cost: "0.06",
            date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            tokens: 11200,
            cost: "0.02",
            date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            tokens: 36500,
            cost: "0.07",
            date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            tokens: 22400,
            cost: "0.04",
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            tokens: 48300,
            cost: "0.10",
            date: new Date(today.getTime()).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(usage).values(sampleUsage);
    
    console.log('✅ Usage seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});