import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * Stripe webhook. Verifies the signature, then:
 *  - checkout.session.completed  -> mark the user as a member
 *  - customer.subscription.deleted -> remove membership
 * Point Stripe at POST /api/stripe/webhook and set STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    if (userId) {
      await admin
        .from('profiles')
        .update({
          is_member: true,
          stripe_customer_id:
            typeof session.customer === 'string' ? session.customer : null,
        })
        .eq('id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId =
      typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    await admin
      .from('profiles')
      .update({ is_member: false })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}
