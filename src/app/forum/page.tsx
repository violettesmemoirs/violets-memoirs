import type { Metadata } from 'next';
import Link from 'next/link';
import FlowerField from '@/components/FlowerField';
import NewThreadForm from '@/components/NewThreadForm';
import PageFade from '@/components/PageFade';
import QuickChat from '@/components/QuickChat';
import { supabaseServer } from '@/lib/supabase/server';
import { formatDate } from '@/lib/slug';
import type { ChatMessage, Thread } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forum',
  description:
    "The reader's corner of Violet's Memoirs: share ideas, react to poems, and tell Violette what you'd like her to write about next.",
  alternates: { canonical: '/forum' },
};

async function allThreads(): Promise<Thread[]> {
  try {
    const sb = await supabaseServer();
    if (!sb) return [];
    const { data } = await sb
      .from('threads')
      .select('id, title, body, author_id, created_at, profiles(display_name)')
      .order('created_at', { ascending: false })
      .limit(100);
    return ((data ?? []) as unknown) as Thread[];
  } catch {
    return [];
  }
}

async function recentChat(): Promise<ChatMessage[]> {
  try {
    const sb = await supabaseServer();
    if (!sb) return [];
    const { data } = await sb
      .from('chat_messages')
      .select('id, author_id, body, created_at, profiles(display_name)')
      .order('created_at', { ascending: false })
      .limit(50);
    return (((data ?? []) as unknown) as ChatMessage[]).reverse();
  } catch {
    return [];
  }
}

export default async function ForumPage() {
  const [threads, chat] = await Promise.all([allThreads(), recentChat()]);

  return (
    <PageFade>
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">The reader&rsquo;s corner</p>
          <h1 className="h-display">Forum</h1>
          <p className="muted" style={{ maxWidth: '58ch' }}>
            This is the open end of the site. Share an idea, ask about a poem,
            or tell Violette what you&rsquo;d like her to write about next.
            Anyone can read; a free account lets you post.
          </p>

          <h2 className="h-section h-section--small">Quick chat</h2>
          <p className="muted small" style={{ maxWidth: '58ch' }}>
            No form to fill out &mdash; just type and send. Everything here is
            public and shows up the moment you post it.
          </p>
          <div style={{ margin: '1.25rem 0 3rem' }}>
            <QuickChat initialMessages={chat} />
          </div>

          <h2 className="h-section h-section--small">Start a thread</h2>
          <p className="muted small" style={{ maxWidth: '58ch' }}>
            For something with more to say. Once posted, it&rsquo;s public
            immediately and you&rsquo;ll land right on its page &mdash; it
            also shows in the list below for anyone, including Violette, to
            find.
          </p>
          <div style={{ margin: '1.25rem 0 3rem' }}>
            <NewThreadForm />
          </div>

          {threads.length === 0 ? (
            <p className="muted">No threads yet. Start the first one.</p>
          ) : (
            <ul className="thread-list">
              {threads.map((t) => (
                <li key={t.id} className="thread-row">
                  <h2 className="thread-row__title">
                    <Link href={`/forum/${t.id}`}>{t.title}</Link>
                  </h2>
                  <p className="comment__meta">
                    <strong>{t.profiles?.display_name ?? 'Reader'}</strong>{' '}
                    {'\u00B7'} {formatDate(t.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <FlowerField hem />
    </PageFade>
  );
}
