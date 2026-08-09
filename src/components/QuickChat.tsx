'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';
import type { ChatMessage } from '@/lib/types';

/**
 * A running chat feed with nothing to fill out but the message itself.
 * Sits above the formal "start a thread" form for people who just want to
 * say something quick. Polls for new messages every 20s rather than using
 * a realtime subscription, to keep the setup simple.
 */
export default function QuickChat({
  initialMessages,
}: {
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState('');
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const latest = useRef(initialMessages.at(-1)?.created_at ?? null);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setSignedIn(false);
      return;
    }
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) return;
    const poll = setInterval(async () => {
      let query = sb
        .from('chat_messages')
        .select('id, author_id, body, created_at, profiles(display_name)')
        .order('created_at', { ascending: true })
        .limit(50);
      if (latest.current) query = query.gt('created_at', latest.current);
      const { data } = await query;
      if (data && data.length > 0) {
        const rows = data as unknown as ChatMessage[];
        setMessages((m) => [...m, ...rows]);
        latest.current = rows.at(-1)!.created_at;
      }
    }, 20000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    const body = text.trim();
    if (!sb || !body || busy) return;
    setBusy(true);
    setError('');
    const { data: userData } = await sb.auth.getUser();
    const user = userData.user;
    if (!user) {
      setSignedIn(false);
      setBusy(false);
      return;
    }
    const { data, error: err } = await sb
      .from('chat_messages')
      .insert({ author_id: user.id, body })
      .select('id, author_id, body, created_at, profiles(display_name)')
      .single();
    if (err || !data) {
      setError('That message did not send. Try again in a moment.');
    } else {
      const row = data as unknown as ChatMessage;
      setMessages((m) => [...m, row]);
      latest.current = row.created_at;
      setText('');
    }
    setBusy(false);
  }

  return (
    <div className="chat">
      <div className="chat__list" ref={listRef}>
        {messages.length === 0 ? (
          <p className="muted small chat__empty">
            Nothing here yet. Say the first thing.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="chat__msg">
              <span className="chat__author">
                {m.profiles?.display_name ?? 'Reader'}
              </span>
              <span className="chat__body">{m.body}</span>
            </div>
          ))
        )}
      </div>

      {signedIn === false ? (
        <p className="muted small">
          <Link href="/login">Sign in</Link> or{' '}
          <Link href="/signup">create a free account</Link> to chat.
        </p>
      ) : (
        <form className="chat__form" onSubmit={submit}>
          <label htmlFor="chat-input" className="visually-hidden">
            Say something
          </label>
          <input
            id="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="Say something\u2026"
            autoComplete="off"
          />
          <button
            className="btn btn--small"
            type="submit"
            disabled={busy || !text.trim()}
          >
            Send
          </button>
        </form>
      )}
      {error && <p className="form__error" role="alert">{error}</p>}
    </div>
  );
}
