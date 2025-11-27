import { db } from '@/db';
import { messages } from '@/db/schema';

async function main() {
    const sampleMessages = [
        // Conversation 1: Order Support
        {
            conversationId: 1,
            role: 'user',
            text: 'Hello, I need help with my order',
            metadata: JSON.stringify({ sentiment: 'neutral', intent: 'order_inquiry' }),
            createdAt: new Date('2024-01-15T10:00:00').toISOString(),
        },
        {
            conversationId: 1,
            role: 'assistant',
            text: "I'd be happy to help! Can you provide your order number?",
            metadata: JSON.stringify({ confidence: 0.95, intent: 'request_info' }),
            createdAt: new Date('2024-01-15T10:00:15').toISOString(),
        },
        {
            conversationId: 1,
            role: 'user',
            text: "It's #12345",
            metadata: JSON.stringify({ sentiment: 'neutral', order_number: '12345' }),
            createdAt: new Date('2024-01-15T10:00:45').toISOString(),
        },
        {
            conversationId: 1,
            role: 'assistant',
            text: 'Let me check that for you... Your order is currently being processed and will ship within 2-3 business days.',
            metadata: JSON.stringify({ confidence: 0.92, action: 'order_status_check' }),
            createdAt: new Date('2024-01-15T10:01:00').toISOString(),
        },

        // Conversation 2: Product Inquiry
        {
            conversationId: 2,
            role: 'system',
            text: 'Conversation started',
            metadata: JSON.stringify({ type: 'system_message' }),
            createdAt: new Date('2024-01-16T14:30:00').toISOString(),
        },
        {
            conversationId: 2,
            role: 'user',
            text: 'Do you have this product in blue?',
            metadata: JSON.stringify({ sentiment: 'positive', intent: 'product_inquiry' }),
            createdAt: new Date('2024-01-16T14:30:10').toISOString(),
        },
        {
            conversationId: 2,
            role: 'assistant',
            text: 'Yes! We have that product available in blue, size M and L. Would you like me to add it to your cart?',
            metadata: JSON.stringify({ confidence: 0.88, available_sizes: ['M', 'L'] }),
            createdAt: new Date('2024-01-16T14:30:25').toISOString(),
        },

        // Conversation 3: Booking Support
        {
            conversationId: 3,
            role: 'user',
            text: 'I need to reschedule my appointment',
            metadata: JSON.stringify({ sentiment: 'neutral', intent: 'booking_change' }),
            createdAt: new Date('2024-01-17T09:15:00').toISOString(),
        },
        {
            conversationId: 3,
            role: 'assistant',
            text: 'Of course! When would you like to reschedule to? I can show you available slots.',
            metadata: JSON.stringify({ confidence: 0.93 }),
            createdAt: new Date('2024-01-17T09:15:20').toISOString(),
        },
        {
            conversationId: 3,
            role: 'user',
            text: 'Next Wednesday afternoon would be perfect',
            metadata: JSON.stringify({ sentiment: 'positive', preferred_time: 'afternoon' }),
            createdAt: new Date('2024-01-17T09:16:00').toISOString(),
        },

        // Conversation 4: Technical Support
        {
            conversationId: 4,
            role: 'user',
            text: "I'm having trouble logging into my account",
            metadata: JSON.stringify({ sentiment: 'frustrated', intent: 'technical_support' }),
            createdAt: new Date('2024-01-18T11:00:00').toISOString(),
        },
        {
            conversationId: 4,
            role: 'assistant',
            text: "I'm sorry to hear that. Have you tried resetting your password?",
            metadata: JSON.stringify({ confidence: 0.87, troubleshooting_step: 1 }),
            createdAt: new Date('2024-01-18T11:00:15').toISOString(),
        },
        {
            conversationId: 4,
            role: 'user',
            text: "Yes, but I'm not receiving the reset email",
            metadata: JSON.stringify({ sentiment: 'frustrated', issue: 'email_not_received' }),
            createdAt: new Date('2024-01-18T11:01:30').toISOString(),
        },

        // Conversation 5: General Inquiry
        {
            conversationId: 5,
            role: 'system',
            text: 'Agent joined the conversation',
            metadata: JSON.stringify({ type: 'agent_join', agent_id: 'AGT001' }),
            createdAt: new Date('2024-01-19T15:45:00').toISOString(),
        },
        {
            conversationId: 5,
            role: 'user',
            text: 'What are your business hours?',
            metadata: JSON.stringify({ sentiment: 'neutral', intent: 'business_info' }),
            createdAt: new Date('2024-01-19T15:45:10').toISOString(),
        },
        {
            conversationId: 5,
            role: 'assistant',
            text: "We're open Monday through Friday, 9 AM to 6 PM EST. Is there anything else I can help you with?",
            metadata: JSON.stringify({ confidence: 0.98 }),
            createdAt: new Date('2024-01-19T15:45:25').toISOString(),
        },

        // Conversation 6: Refund Request
        {
            conversationId: 6,
            role: 'user',
            text: 'I would like to request a refund for order #67890',
            metadata: JSON.stringify({ sentiment: 'negative', intent: 'refund_request', order_number: '67890' }),
            createdAt: new Date('2024-01-20T10:30:00').toISOString(),
        },
        {
            conversationId: 6,
            role: 'assistant',
            text: 'I understand. Could you please tell me the reason for the refund request?',
            metadata: JSON.stringify({ confidence: 0.91 }),
            createdAt: new Date('2024-01-20T10:30:20').toISOString(),
        },
        {
            conversationId: 6,
            role: 'user',
            text: 'The product arrived damaged',
            metadata: JSON.stringify({ sentiment: 'negative', reason: 'damaged_product' }),
            createdAt: new Date('2024-01-20T10:31:15').toISOString(),
        },

        // Conversation 7: Shipping Inquiry
        {
            conversationId: 7,
            role: 'user',
            text: 'How long does shipping take to Canada?',
            metadata: JSON.stringify({ sentiment: 'neutral', intent: 'shipping_inquiry', location: 'Canada' }),
            createdAt: new Date('2024-01-21T13:20:00').toISOString(),
        },
        {
            conversationId: 7,
            role: 'assistant',
            text: 'Standard shipping to Canada typically takes 7-10 business days. We also offer express shipping which takes 3-5 business days.',
            metadata: JSON.stringify({ confidence: 0.96 }),
            createdAt: new Date('2024-01-21T13:20:15').toISOString(),
        },

        // Conversation 8: Pricing Question
        {
            conversationId: 8,
            role: 'system',
            text: 'Conversation started',
            metadata: JSON.stringify({ type: 'system_message' }),
            createdAt: new Date('2024-01-22T16:00:00').toISOString(),
        },
        {
            conversationId: 8,
            role: 'user',
            text: 'Do you offer volume discounts?',
            metadata: JSON.stringify({ sentiment: 'positive', intent: 'pricing_inquiry' }),
            createdAt: new Date('2024-01-22T16:00:10').toISOString(),
        },
        {
            conversationId: 8,
            role: 'assistant',
            text: 'Yes! We offer 10% off for orders over $500 and 15% off for orders over $1000. Would you like to know more?',
            metadata: JSON.stringify({ confidence: 0.94, discount_tiers: ['10%', '15%'] }),
            createdAt: new Date('2024-01-22T16:00:30').toISOString(),
        },

        // Conversation 9: Account Question
        {
            conversationId: 9,
            role: 'user',
            text: 'How do I update my billing information?',
            metadata: JSON.stringify({ sentiment: 'neutral', intent: 'account_management' }),
            createdAt: new Date('2024-01-23T11:45:00').toISOString(),
        },
        {
            conversationId: 9,
            role: 'assistant',
            text: 'You can update your billing information by going to Account Settings > Billing. Would you like me to send you a direct link?',
            metadata: JSON.stringify({ confidence: 0.89 }),
            createdAt: new Date('2024-01-23T11:45:20').toISOString(),
        },

        // Conversation 10: Product Recommendation
        {
            conversationId: 10,
            role: 'user',
            text: "I'm looking for a gift for my sister who loves reading",
            metadata: JSON.stringify({ sentiment: 'positive', intent: 'product_recommendation' }),
            createdAt: new Date('2024-01-24T14:00:00').toISOString(),
        },
        {
            conversationId: 10,
            role: 'assistant',
            text: 'That sounds lovely! We have some great options. What is your budget range?',
            metadata: JSON.stringify({ confidence: 0.92 }),
            createdAt: new Date('2024-01-24T14:00:15').toISOString(),
        },
        {
            conversationId: 10,
            role: 'user',
            text: 'Around $50-75',
            metadata: JSON.stringify({ sentiment: 'positive', budget_range: '50-75' }),
            createdAt: new Date('2024-01-24T14:01:00').toISOString(),
        },
    ];

    await db.insert(messages).values(sampleMessages);
    
    console.log('✅ Messages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});