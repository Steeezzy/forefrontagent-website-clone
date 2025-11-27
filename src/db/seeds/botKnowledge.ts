import { db } from '@/db';
import { botKnowledge } from '@/db/schema';

async function main() {
    const sampleKnowledge = [
        {
            botId: 1,
            sourceType: 'faq',
            sourceUrl: null,
            content: 'Q: What are your business hours? A: We are open Monday through Friday from 9:00 AM to 5:00 PM EST. We are closed on weekends and major holidays.',
            metadata: { category: 'general', priority: 'high' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            sourceType: 'website',
            sourceUrl: 'https://example.com/about',
            content: 'Company Overview: We are a leading provider of innovative solutions in the technology sector. Founded in 2010, we have grown to serve over 10,000 customers worldwide with our cutting-edge products and exceptional customer service.',
            metadata: { section: 'about', lastCrawled: '2024-01-15' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            sourceType: 'upload',
            sourceUrl: null,
            content: 'Product Documentation Section 2.1: Getting Started Guide. Installation requirements include Node.js 18+, npm 9+, and at least 4GB of RAM. Follow the installation steps carefully to ensure proper configuration.',
            metadata: { filename: 'product-manual.pdf', page: 5, uploadedBy: 'admin' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 1,
            sourceType: 'faq',
            sourceUrl: null,
            content: 'Q: How do I reset my password? A: Click on the "Forgot Password" link on the login page. Enter your email address and we will send you a password reset link within 5 minutes.',
            metadata: { category: 'account', priority: 'high' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            sourceType: 'website',
            sourceUrl: 'https://shop.example.com/shipping',
            content: 'Shipping Policy: We offer free standard shipping on orders over $50. Standard delivery takes 5-7 business days. Express shipping is available for an additional fee and delivers within 2-3 business days.',
            metadata: { section: 'policies', lastCrawled: '2024-01-18' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            sourceType: 'upload',
            sourceUrl: null,
            content: 'Training Module 3: Advanced Features. This section covers advanced analytics, custom reporting, and API integration. Users must complete Modules 1 and 2 before accessing this content.',
            metadata: { filename: 'training-materials.docx', page: 12, version: '2.0' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            sourceType: 'faq',
            sourceUrl: null,
            content: 'Q: What payment methods do you accept? A: We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.',
            metadata: { category: 'billing', priority: 'medium' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 7,
            sourceType: 'website',
            sourceUrl: 'https://example.com/pricing',
            content: 'Pricing Plans: Starter Plan - $29/month includes 5 users and 10GB storage. Professional Plan - $79/month includes 20 users and 50GB storage. Enterprise Plan - Custom pricing with unlimited users and storage.',
            metadata: { section: 'pricing', lastCrawled: '2024-01-20' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 8,
            sourceType: 'upload',
            sourceUrl: null,
            content: 'Security Policy Section 4.2: Data Encryption. All customer data is encrypted at rest using AES-256 encryption. Data in transit is protected using TLS 1.3. We comply with SOC 2 Type II and GDPR requirements.',
            metadata: { filename: 'security-handbook.pdf', page: 23, classification: 'internal' },
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            sourceType: 'faq',
            sourceUrl: null,
            content: 'Q: Do you offer a free trial? A: Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial. You can upgrade to a paid plan at any time.',
            metadata: { category: 'sales', priority: 'high' },
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(botKnowledge).values(sampleKnowledge);
    
    console.log('✅ Bot knowledge seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});