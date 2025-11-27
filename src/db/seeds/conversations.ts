import { db } from '@/db';
import { conversations } from '@/db/schema';

async function main() {
    const sampleConversations = [
        {
            botId: 1,
            userId: 1,
            sessionId: null,
            metadata: { channel: 'web', referrer: 'google' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 1,
            userId: 2,
            sessionId: null,
            metadata: { channel: 'mobile', device: 'iOS' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            userId: null,
            sessionId: 'sess_abc123',
            metadata: { channel: 'web', ip: '192.168.1.1' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            userId: 3,
            sessionId: null,
            metadata: { channel: 'web', referrer: 'facebook' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            userId: null,
            sessionId: 'sess_xyz789',
            metadata: { channel: 'mobile', device: 'Android' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            userId: 4,
            sessionId: null,
            metadata: { channel: 'web', referrer: 'direct' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            userId: null,
            sessionId: 'sess_def456',
            metadata: { channel: 'web', ip: '192.168.1.100' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            userId: 5,
            sessionId: null,
            metadata: { channel: 'mobile', device: 'iOS', referrer: 'twitter' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            userId: 1,
            sessionId: null,
            metadata: { channel: 'web' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            userId: null,
            sessionId: 'sess_ghi789',
            metadata: { channel: 'mobile', device: 'Android', ip: '10.0.0.50' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            userId: 2,
            sessionId: null,
            metadata: { channel: 'web', referrer: 'linkedin' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            userId: null,
            sessionId: 'sess_jkl012',
            metadata: { channel: 'web', ip: '172.16.0.10' },
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(conversations).values(sampleConversations);
    
    console.log('✅ Conversations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});