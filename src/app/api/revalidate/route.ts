import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Called right after a poem is saved so the cached home page and poems
 * index update immediately, instead of waiting for the 60s ISR window.
 */
export async function POST(request: Request) {
  const sb = await supabaseServer();
  if (!sb) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let slug: string | undefined;
  try {
    const body = await request.json();
    slug = typeof body?.slug === 'string' ? body.slug : undefined;
  } catch {
    // no body is fine, still revalidate the listing pages
  }

  revalidatePath('/');
  revalidatePath('/poems');
  if (slug) revalidatePath(`/poems/${slug}`);

  return NextResponse.json({ revalidated: true });
}
