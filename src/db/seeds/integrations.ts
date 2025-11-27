import { db } from '@/db';
import { integrations } from '@/db/schema';

async function main() {
    const sampleIntegrations = [
        {
            botId: 1,
            type: 'shopify',
            credentialsEncrypted: 'enc_shop_1234abcd',
            config: {
                store: 'mystore.myshopify.com',
                version: '2023-10',
                apiKey: 'shpat_xxxxx',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            type: 'whatsapp',
            credentialsEncrypted: 'enc_wa_xyz789',
            config: {
                phone: '+1234567890',
                verified: true,
                businessId: 'wa_biz_123',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            type: 'calendar',
            credentialsEncrypted: 'enc_cal_def456',
            config: {
                provider: 'google',
                calendar_id: 'primary',
                timezone: 'America/New_York',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            type: 'stripe',
            credentialsEncrypted: 'enc_stripe_ghi789',
            config: {
                mode: 'test',
                webhook_secret: 'whsec_test123',
                publishableKey: 'pk_test_xxxxx',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            type: 'gmail',
            credentialsEncrypted: null,
            config: {
                email: 'support@company.com',
                label: 'customer-support',
                autoReply: true,
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            type: 'slack',
            credentialsEncrypted: 'enc_slack_jkl012',
            config: {
                workspace: 'my-company',
                channel: '#support',
                botToken: 'xoxb-xxxxx',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            type: 'zendesk',
            credentialsEncrypted: 'enc_zen_mno345',
            config: {
                subdomain: 'mycompany',
                email: 'support@mycompany.com',
                apiToken: 'zd_token_xxxxx',
            },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            type: 'salesforce',
            credentialsEncrypted: 'enc_sf_pqr678',
            config: {
                instanceUrl: 'https://mycompany.salesforce.com',
                version: 'v58.0',
                sandbox: false,
            },
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(integrations).values(sampleIntegrations);
    
    console.log('✅ Integrations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});