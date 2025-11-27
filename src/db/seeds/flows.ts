import { db } from '@/db';
import { flows } from '@/db/schema';

async function main() {
    const sampleFlows = [
        {
            botId: 1,
            name: 'Welcome Flow',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'Welcome to our service! How can I assist you today?',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'What would you like help with?',
                    options: ['Product Information', 'Support', 'Pricing'],
                    next: {
                        'Product Information': '3',
                        'Support': '4',
                        'Pricing': '5'
                    }
                },
                {
                    id: '3',
                    type: 'message',
                    content: 'Let me show you our product catalog.',
                    next: null
                },
                {
                    id: '4',
                    type: 'message',
                    content: 'I will connect you with our support team.',
                    next: null
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'Here are our pricing plans.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 2,
            name: 'Order Status Check',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'I can help you check your order status.',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'Please provide your order number:',
                    inputType: 'text',
                    next: '3'
                },
                {
                    id: '3',
                    type: 'action',
                    content: 'Looking up order...',
                    action: 'checkOrderStatus',
                    next: '4'
                },
                {
                    id: '4',
                    type: 'condition',
                    content: 'Order found?',
                    conditions: {
                        found: '5',
                        notFound: '6'
                    }
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'Your order is on its way! Estimated delivery: 2-3 business days.',
                    next: null
                },
                {
                    id: '6',
                    type: 'message',
                    content: 'Sorry, we could not find that order number. Please check and try again.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 3,
            name: 'Booking Flow',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'Welcome to our booking system!',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'What type of service would you like to book?',
                    options: ['Consultation', 'Installation', 'Maintenance'],
                    next: {
                        'Consultation': '3',
                        'Installation': '3',
                        'Maintenance': '3'
                    }
                },
                {
                    id: '3',
                    type: 'question',
                    content: 'Please select your preferred date:',
                    inputType: 'date',
                    next: '4'
                },
                {
                    id: '4',
                    type: 'action',
                    content: 'Creating your booking...',
                    action: 'createBooking',
                    next: '5'
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'Your booking has been confirmed! You will receive a confirmation email shortly.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 4,
            name: 'FAQ Navigation',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'I can help you find answers to common questions.',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'What topic are you interested in?',
                    options: ['Shipping', 'Returns', 'Payment Methods', 'Account'],
                    next: {
                        'Shipping': '3',
                        'Returns': '4',
                        'Payment Methods': '5',
                        'Account': '6'
                    }
                },
                {
                    id: '3',
                    type: 'message',
                    content: 'We offer free shipping on orders over $50. Standard delivery takes 5-7 business days.',
                    next: null
                },
                {
                    id: '4',
                    type: 'message',
                    content: 'You can return items within 30 days of purchase. Items must be unused and in original packaging.',
                    next: null
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'We accept credit cards, PayPal, and Apple Pay. All payments are processed securely.',
                    next: null
                },
                {
                    id: '6',
                    type: 'message',
                    content: 'You can manage your account settings, view order history, and update preferences in your dashboard.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 5,
            name: 'Lead Qualification',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'Thank you for your interest! Let me gather some information.',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'What is the size of your company?',
                    options: ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'],
                    next: '3'
                },
                {
                    id: '3',
                    type: 'question',
                    content: 'What is your primary goal?',
                    options: ['Increase Sales', 'Improve Efficiency', 'Reduce Costs', 'Other'],
                    next: '4'
                },
                {
                    id: '4',
                    type: 'question',
                    content: 'When are you looking to implement a solution?',
                    options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Just exploring'],
                    next: '5'
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'Great! Based on your needs, I will have our sales team reach out to schedule a demo.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        },
        {
            botId: 6,
            name: 'Escalation Flow',
            nodes: [
                {
                    id: '1',
                    type: 'message',
                    content: 'I understand you need additional assistance.',
                    next: '2'
                },
                {
                    id: '2',
                    type: 'question',
                    content: 'How urgent is your issue?',
                    options: ['Critical - Immediate attention needed', 'High - Need help today', 'Medium - Can wait 24 hours', 'Low - General inquiry'],
                    next: {
                        'Critical - Immediate attention needed': '3',
                        'High - Need help today': '4',
                        'Medium - Can wait 24 hours': '4',
                        'Low - General inquiry': '4'
                    }
                },
                {
                    id: '3',
                    type: 'action',
                    content: 'Connecting you to our emergency support line...',
                    action: 'escalateToEmergency',
                    next: '5'
                },
                {
                    id: '4',
                    type: 'action',
                    content: 'Creating a support ticket...',
                    action: 'createSupportTicket',
                    next: '6'
                },
                {
                    id: '5',
                    type: 'message',
                    content: 'You are being transferred to our emergency support team now.',
                    next: null
                },
                {
                    id: '6',
                    type: 'message',
                    content: 'Your support ticket has been created. A team member will respond within 4 business hours.',
                    next: null
                }
            ],
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(flows).values(sampleFlows);
    
    console.log('✅ Flows seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});