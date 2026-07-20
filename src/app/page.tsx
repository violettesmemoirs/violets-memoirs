import Link from 'next/link';
import FlowerField from '@/components/FlowerField';
import Reveal from '@/components/Reveal';
import { supabasePublic } from '@/lib/supabase/public';
import { formatDate } from '@/lib/slug';
import type { Poem } from '@/lib/types';

export const revalidate = 60;

async function latestPoems(): Promise<Poem[]> {
  try {
    const sb = supabasePublic();
    if (!sb) return [];
    const { data } = await sb
      .from('poems')
      .select('id, slug, title, excerpt, body, members_only, published, created_at')
      .eq('published', true)
      .eq('members_only', false)
      .order('created_at', { ascending: false })
      .limit(3);
    return (data as Poem[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const poems = await latestPoems();

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <Reveal>
            <h1 className="hero__title">
              <span className="hero__line">
                <span className="hero__script">V</span>iolet&rsquo;s
              </span>
              <span className="hero__line hero__line--second">Memoirs</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero__tag">
              Poems about the things most people walk past: the color of
              evening before it becomes night, memories that distort
              themselves, whole stories hidden inside ordinary sentences.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hero__actions">
              <Link href="/poems" className="btn">
                Read the poems
              </Link>
              <Link href="/about" className="btn btn--quiet">
                About Violette
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {poems.length > 0 && (
        <section className="section" aria-labelledby="latest-heading">
          <div className="wrap">
            <p className="eyebrow">New on the page</p>
            <h2 id="latest-heading" className="h-section">
              Latest poems
            </h2>
            <ul className="card-grid">
              {poems.map((p) => (
                <li key={p.id} className="card">
                  <p className="card__meta">{formatDate(p.created_at)}</p>
                  <h3 className="card__title">
                    <Link href={`/poems/${p.slug}`}>{p.title}</Link>
                  </h3>
                  {p.excerpt && <p className="card__excerpt">{p.excerpt}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FlowerField />
    </>
  );
}
