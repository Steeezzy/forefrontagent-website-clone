import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'alice@example.com',
            name: 'Alice Johnson',
            role: 'admin',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'bob@example.com',
            name: 'Bob Smith',
            role: 'owner',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'charlie@example.com',
            name: 'Charlie Davis',
            role: 'user',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'diana@example.com',
            name: 'Diana Martinez',
            role: 'user',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'eve@example.com',
            name: 'Eve Thompson',
            role: 'user',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});