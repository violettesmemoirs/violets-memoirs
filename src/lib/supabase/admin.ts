import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. Server only. Used by the Stripe webhook to flip
 * membership flags. Never import this from client code.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
