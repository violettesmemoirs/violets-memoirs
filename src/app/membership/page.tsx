import type { Metadata } from 'next';
import Link from 'next/link';
import FlowerField from '@/components/FlowerField';
import SubscribeButton from '@/components/SubscribeButton';
import { supabaseServer } from '@/lib/supabase/server';
import { formatDate } from '@/lib/slug';
import type { Poem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    "Most of Violet's Memoirs is free. The monthly membership opens the notebook: drafts, behind-the-scenes writing, and more about Violette.",
  alternates: { canonical: '/membership' },
};

export default async function MembershipPage() {
  const sb = await supabaseServer();

  let isMember = false;
  let signedIn = false;
  let notebook: Poem[] = [];

  if (sb) {
    const {
      data: { user },
    } = await sb.auth.getUser();
    signedIn = !!user;
    if (user) {
      const { data: profile } = await sb
        .from('profiles')
        .select('role, is_member')
        .eq('id', user.id)
        .maybeSingle();
      isMember = profile?.role === 'admin' || !!profile?.is_member;
    }
    if (isMember) {
      const { data } = await sb
        .from('poems')
        .select('id, slug, title, excerpt, body, members_only, published, created_at')
        .eq('published', true)
        .eq('members_only', true)
        .order('created_at', { ascending: false })
        .limit(100);
      notebook = (data as Poem[]) ?? [];
    }
  }

  return (
    <>
      <section className="section">
        <div className="wrap--narrow">
          <p className="eyebrow">Membership</p>
          <h1 className="h-display">The notebook</h1>

          {isMember ? (
            <>
              <p className="muted" style={{ maxWidth: '58ch' }}>
                You&rsquo;re in. These are the pieces that don&rsquo;t make it
                to the public page: drafts, notes on how poems came together,
                and the occasional entry about life behind the writing.
              </p>
              {notebook.length === 0 ? (
                <p className="muted">
                  The notebook is empty right now. New entries land here first.
                </p>
              ) : (
                <ul className="card-grid" style={{ marginTop: '2rem' }}>
                  {notebook.map((p) => (
                    <li key={p.id} className="card">
                      <span className="badge">Notebook</span>
                      <p className="card__meta">{formatDate(p.created_at)}</p>
                      <h2 className="card__title">
                        <Link href={`/poems/${p.slug}`}>{p.title}</Link>
                      </h2>
                      {p.excerpt && <p className="card__excerpt">{p.excerpt}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="member-panel">
              <p style={{ marginTop: 0, maxWidth: '58ch' }}>
                Everything on the public pages stays free: the poems, the
                comments, the forum. The monthly membership opens the
                notebook, which holds:
              </p>
              <ul>
                <li>Behind-the-scenes writing: drafts, cut lines, and notes on how poems came together</li>
                <li>Entries about Violette herself, beyond the About page</li>
                <li>New work, before it goes public (when it ever does)</li>
              </ul>
              {signedIn ? (
                <SubscribeButton />
              ) : (
                <p>
                  <Link href="/signup">Create a free account</Link> first, then
                  come back here to join.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <FlowerField hem />
    </>
  );
}
