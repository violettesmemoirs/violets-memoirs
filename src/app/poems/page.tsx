import type { Metadata } from 'next';
import Link from 'next/link';
import FlowerField from '@/components/FlowerField';
import { supabasePublic } from '@/lib/supabase/public';
import { formatDate } from '@/lib/slug';
import type { Poem } from '@/lib/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Poems',
  description:
    "Every published poem from Violet's Memoirs, newest first. Quiet, curious pieces about evening light, memory, and small details.",
  alternates: { canonical: '/poems' },
};

async function allPoems(): Promise<Poem[]> {
  try {
    const sb = supabasePublic();
    if (!sb) return [];
    const { data } = await sb
      .from('poems')
      .select('id, slug, title, excerpt, body, members_only, published, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(200);
    return (data as Poem[]) ?? [];
  } catch {
    return [];
  }
}

export default async function PoemsPage() {
  const poems = await allPoems();

  return (
    <>
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">The collection</p>
          <h1 className="h-display">Poems</h1>
          {poems.length === 0 ? (
            <p className="muted">
              Nothing here yet. The first poems are on their way.
            </p>
          ) : (
            <ul className="card-grid">
              {poems.map((p) => (
                <li key={p.id} className="card">
                  <p className="card__meta">{formatDate(p.created_at)}</p>
                  <h2 className="card__title">
                    <Link href={`/poems/${p.slug}`}>{p.title}</Link>
                  </h2>
                  {p.excerpt && <p className="card__excerpt">{p.excerpt}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <FlowerField hem />
    </>
  );
}
