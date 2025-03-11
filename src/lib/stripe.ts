import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create a new Stripe customer
export const createStripeCustomer = async (userId: string, email: string) => {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUserId: userId,
    },
  });

  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer;
};

// Create a subscription checkout session
export const createCheckoutSession = async (
  userId: string,
  priceId: string
) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  const session = await stripe.checkout.sessions.create({
    customer: profile?.stripe_customer_id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return session;
};

// Handle webhook events
export const handleStripeWebhook = async (req: Request) => {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSession(session);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePayment(invoice);
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
};

// Helper functions for webhook handlers
const handleCheckoutSession = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;

  await supabase
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
      subscription_status: 'active',
    })
    .eq('id', userId);
};

const handleInvoicePayment = async (invoice: Stripe.Invoice) => {
  const customerId = invoice.customer as string;
  
  await supabase
    .from('profiles')
    .update({
      last_payment_date: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);
};

const handleSubscriptionUpdate = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
    })
    .eq('stripe_customer_id', customerId);
};
