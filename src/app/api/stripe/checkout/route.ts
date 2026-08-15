import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Starts a Stripe Checkout session for the monthly membership.
 * Requires a signed-in user; the user id travels as client_reference_id so
 * the webhook can flip is_member when payment completes.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!secret || !priceId) {
    return NextResponse.json(
      { error: 'Memberships are not set up yet. Check back soon.' },
      { status: 503 }
    );
  }

  const sb = await supabaseServer();
  if (!sb) {
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Sign in before joining.' },
      { status: 401 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin;

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      success_url: `${origin}/membership?joined=1`,
      cancel_url: `${origin}/membership`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: 'Checkout could not be started. Try again in a moment.' },
      { status: 500 }
    );
  }
}
