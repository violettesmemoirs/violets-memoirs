import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PoemForm from '@/components/PoemForm';
import { supabaseServer } from '@/lib/supabase/server';
import { formatDate } from '@/lib/slug';
import type { Poem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Writing desk',
  robots: { index: false },
};

function PoemRow({ p }: { p: Poem }) {
  return (
    <li className="admin-list__row">
      <span className={p.published ? 'badge badge--live' : 'badge badge--draft'}>
        {p.published ? 'Published' : 'Draft'}
      </span>
      <Link href={`/poems/${p.slug}`} className="admin-list__title">
        {p.title}
      </Link>
      <span className="admin-list__meta">
        <span className="admin-list__date">{formatDate(p.created_at)}</span>
        <Link href={`/admin/${p.id}/edit`} className="btn btn--quiet btn--small">
          Edit
        </Link>
      </span>
    </li>
  );
}

export default async function AdminPage() {
  const sb = await supabaseServer();
  if (!sb) redirect('/login');

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') redirect('/');

  const { data: poems } = await sb
    .from('poems')
    .select('id, slug, title, excerpt, body, published, created_at')
    .order('created_at', { ascending: false })
    .limit(300);
  const allPoems = (poems as Poem[]) ?? [];
  const drafts = allPoems.filter((p) => !p.published);
  const published = allPoems.filter((p) => p.published);

  return (
    <section className="section">
      <div className="wrap--narrow">
        <p className="eyebrow">Admin only</p>
        <h1 className="h-display">The writing desk</h1>
        <p className="muted small" style={{ maxWidth: '58ch' }}>
          Publish a new poem here. Line breaks are kept exactly as you type
          them. Untick &ldquo;publish right away&rdquo; to save it as a draft
          instead. Whatever you save &mdash; published or draft &mdash;
          always shows up below, with an edit link, so nothing gets lost or
          stuck.
        </p>
        <PoemForm />

        <h2 className="h-section h-section--small">Drafts</h2>
        {drafts.length === 0 ? (
          <p className="muted small">No drafts right now.</p>
        ) : (
          <ul className="admin-list">
            {drafts.map((p) => (
              <PoemRow key={p.id} p={p} />
            ))}
          </ul>
        )}

        <h2 className="h-section h-section--small">Published</h2>
        {published.length === 0 ? (
          <p className="muted small">Nothing published yet.</p>
        ) : (
          <ul className="admin-list">
            {published.map((p) => (
              <PoemRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
