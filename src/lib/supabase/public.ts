import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Cookie-less, anon-key client for public data (home page, poems index,
 * sitemap). Because it never touches request cookies, pages that use it can
 * be statically cached and revalidated, which keeps the busiest pages fast
 * under heavy traffic. Row Level Security still applies: this client can
 * only read published, public rows.
 */
export function supabasePublic(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
