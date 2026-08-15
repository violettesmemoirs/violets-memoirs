import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FlowerField from '@/components/FlowerField';
import LikeButton from '@/components/LikeButton';
import ShareButton from '@/components/ShareButton';
import CommentForm from '@/components/CommentForm';
import { supabaseServer } from '@/lib/supabase/server';
import { supabasePublic } from '@/lib/supabase/public';
import { formatDate } from '@/lib/slug';
import type { CommentRow, Poem } from '@/lib/types';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://violetsmemoirs.com';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const sb = supabasePublic();
  if (!sb) return { title: 'Poem' };
  const { data } = await sb
    .from('poems')
    .select('title, excerpt')
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return { title: 'Poem' };
  return {
    title: data.title,
    description:
      data.excerpt ?? `\u201C${data.title}\u201D \u2014 a poem by Violette.`,
    alternates: { canonical: `/poems/${slug}` },
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.excerpt ?? `A poem by Violette.`,
      url: `${SITE_URL}/poems/${slug}`,
    },
  };
}

export default async function PoemPage({ params }: { params: Params }) {
  const { slug } = await params;
  const sb = await supabaseServer();
  if (!sb) notFound();

  const { data: poem } = (await sb
    .from('poems')
    .select('id, slug, title, excerpt, body, published, created_at')
    .eq('slug', slug)
    .maybeSingle()) as { data: Poem | null };

  if (!poem) notFound();

  const [{ count: likeCount }, { data: comments }] = await Promise.all([
    sb.from('likes').select('id', { count: 'exact', head: true }).eq('poem_id', poem.id),
    sb
      .from('comments')
      .select('id, poem_id, author_id, body, created_at, profiles(display_name)')
      .eq('poem_id', poem.id)
      .order('created_at', { ascending: true })
      .limit(200),
  ]);

  const commentRows = (comments ?? []) as unknown as CommentRow[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    genre: 'Poetry',
    name: poem.title,
    datePublished: poem.created_at,
    author: { '@type': 'Person', name: 'Violette' },
    url: `${SITE_URL}/poems/${poem.slug}`,
    ...(poem.excerpt ? { abstract: poem.excerpt } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="section poem-header">
        <div className="wrap--narrow">
          <p className="eyebrow">
            <Link href="/poems" style={{ color: 'inherit', textDecoration: 'none' }}>
              Poems
            </Link>{' '}
            {'\u00B7'} {formatDate(poem.created_at)}
          </p>
          {!poem.published && (
            <p className="form__error" style={{ marginTop: 0 }}>
              Draft &mdash; only you can see this page.
            </p>
          )}
          <h1 className="h-display">{poem.title}</h1>

          <div className="poem-body">{poem.body}</div>

          <div className="poem-actions">
            <LikeButton poemId={poem.id} initialCount={likeCount ?? 0} />
            <ShareButton title={poem.title} path={`/poems/${poem.slug}`} />
          </div>

          <section className="comments" aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="h-section">
              {commentRows.length === 0
                ? 'Comments'
                : `Comments (${commentRows.length})`}
            </h2>
            {commentRows.length === 0 && (
              <p className="muted small">
                No comments yet. Be the first to say something.
              </p>
            )}
            {commentRows.map((c) => (
              <div key={c.id} className="comment">
                <p className="comment__meta">
                  <strong>{c.profiles?.display_name ?? 'Reader'}</strong>{' '}
                  {'\u00B7'} {formatDate(c.created_at)}
                </p>
                <p className="comment__body">{c.body}</p>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem' }}>
              <CommentForm poemId={poem.id} />
            </div>
          </section>
        </div>
      </article>
      <FlowerField hem />
    </>
  );
}
