import axios from 'axios';

const lemonSqueezyClient = axios.create({
  baseURL: 'https://api.lemonsqueezy.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
});

export const createCheckoutSession = async (userEmail: string, userId: string) => {
  try {
    // Log API key presence (partial)
    console.log('API Key present:', !!process.env.LEMON_SQUEEZY_API_KEY);
    console.log('API Key first 10 chars:', process.env.LEMON_SQUEEZY_API_KEY?.substring(0, 10));

    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            enabled_variants: ["705316"]
          },
          checkout_options: {
            embed: false,
            media: false,
            button_color: "#4F46E5",
            dark: false
          },
          checkout_data: {
            email: userEmail,
            custom: {
              user_id: userId
            }
          },
          redirect_url: process.env.NODE_ENV === 'production' 
            ? `${process.env.NEXT_PUBLIC_APP_URL}/app` 
            : 'http://localhost:3000/app',
          expires_at: null
        }
      }
    };

    // Log the full request payload
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    console.log('Request headers:', lemonSqueezyClient.defaults.headers);

    const response = await lemonSqueezyClient.post('/checkouts', payload);

    // Log the full response if we get one
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.data.data.attributes.url) {
      return response.data.data.attributes.url;
    } else {
      throw new Error('No checkout URL returned from Lemon Squeezy');
    }
  } catch (error: any) {
    // Log detailed error information
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}; 