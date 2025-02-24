import { createCheckoutSession } from '@/lib/lemon-squeezy';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        console.log('Received checkout request');
        const body = await req.json();
        console.log('Request body:', body);

        const { user_id, email } = body;
        console.log('Extracted data:', { user_id, email });

        if (!user_id || !email) {
            console.log('Missing required fields');
            return NextResponse.json(
                { error: 'Missing required fields: user_id and email are required' },
                { status: 400 }
            );
        }

        console.log('Creating checkout session with:', { email, user_id });
        const checkoutUrl = await createCheckoutSession(email, user_id);
        console.log('Received checkout URL:', checkoutUrl);
        
        return NextResponse.json({ paymentLink: checkoutUrl });
    } catch (error: any) {
        console.error('Route handler error:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        return NextResponse.json(
            { 
                error: error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to create checkout session'
            },
            { status: error.response?.status || 500 }
        );
    }
}