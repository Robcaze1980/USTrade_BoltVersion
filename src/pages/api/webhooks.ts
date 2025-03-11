import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function validateStripeEvent(req: NextApiRequest) {
  const sig = req.headers['stripe-signature'] as string;
  const body = await buffer(req);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    return stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error('Invalid signature');
  }
}

async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000),
      stripe_subscription_id: subscription.id
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Validate environment variables first
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Stripe environment variables not configured');
      }

      const event = await validateStripeEvent(req);
      
      // Handle specific event types
      switch (event.type) {
        case 'checkout.session.completed':
        case 'invoice.payment_succeeded':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdate(event);
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (err: unknown) {
      const statusCode = err instanceof Error && err.message.includes('signature') ? 401 : 400;
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      
      console.error(`Webhook error: ${message}`);
      res.status(statusCode).json({ error: message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
