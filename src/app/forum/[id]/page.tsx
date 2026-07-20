import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FlowerField from '@/components/FlowerField';
import ReplyForm from '@/components/ReplyForm';
import { supabaseServer } from '@/lib/supabase/server';
import { formatDate } from '@/lib/slug';
import type { Reply, Thread } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const sb = await supabaseServer();
  if (!sb) return { title: 'Thread' };
  const { data } = await sb
    .from('threads')
    .select('title')
    .eq('id', id)
    .maybeSingle();
  return { title: data?.title ?? 'Thread' };
}

export default async function ThreadPage({ params }: { params: Params }) {
  const { id } = await params;
  const sb = await supabaseServer();
  if (!sb) notFound();

  const { data: thread } = (await sb
    .from('threads')
    .select('id, title, body, author_id, created_at, profiles(display_name)')
    .eq('id', id)
    .maybeSingle()) as { data: Thread | null };

  if (!thread) notFound();

  const { data: replies } = await sb
    .from('replies')
    .select('id, thread_id, body, author_id, created_at, profiles(display_name)')
    .eq('thread_id', thread.id)
    .order('created_at', { ascending: true })
    .limit(300);

  const replyRows = ((replies ?? []) as unknown) as Reply[];

  return (
    <>
      <section className="section">
        <div className="wrap--narrow">
          <p className="eyebrow">
            <Link href="/forum" style={{ color: 'inherit', textDecoration: 'none' }}>
              Forum
            </Link>
          </p>
          <h1 className="h-display">{thread.title}</h1>
          <p className="comment__meta">
            <strong>{thread.profiles?.display_name ?? 'Reader'}</strong>{' '}
            {'\u00B7'} {formatDate(thread.created_at)}
          </p>
          <p className="comment__body" style={{ margin: '1rem 0 2.5rem' }}>
            {thread.body}
          </p>

          <h2 className="h-section">
            {replyRows.length === 0
              ? 'Replies'
              : `Replies (${replyRows.length})`}
          </h2>
          {replyRows.length === 0 && (
            <p className="muted small">No replies yet.</p>
          )}
          {replyRows.map((r) => (
            <div key={r.id} className="comment">
              <p className="comment__meta">
                <strong>{r.profiles?.display_name ?? 'Reader'}</strong>{' '}
                {'\u00B7'} {formatDate(r.created_at)}
              </p>
              <p className="comment__body">{r.body}</p>
            </div>
          ))}

          <div style={{ marginTop: '1.5rem' }}>
            <ReplyForm threadId={thread.id} />
          </div>
        </div>
      </section>
      <FlowerField hem />
    </>
  );
}
