import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Handle Lemon Squeezy webhook events
    const eventName = body.meta.event_name;
    const data = body.data;
    
    switch (eventName) {
      case 'subscription_created':
        // Update user profile when subscription is created
        await supabase
          .from('profiles')
          .update({
            paid: true,
            subscription_id: data.id
          })
          .eq('id', data.attributes.custom_data.user_id);
        break;
        
      case 'subscription_cancelled':
        // Update user profile when subscription is cancelled
        await supabase
          .from('profiles')
          .update({
            paid: false,
            subscription_id: null
          })
          .eq('id', data.attributes.custom_data.user_id);
        break;
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
