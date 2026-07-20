'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setSignedIn(false);
      return;
    }
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  if (signedIn === false) {
    return (
      <p className="muted small">
        <Link href="/login">Sign in</Link> or{' '}
        <Link href="/signup">create a free account</Link> to reply.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setError('');
    const { data: userData } = await sb.auth.getUser();
    const user = userData.user;
    if (!user) {
      setSignedIn(false);
      setBusy(false);
      return;
    }
    const { error: err } = await sb
      .from('replies')
      .insert({ thread_id: threadId, body: text, author_id: user.id });
    if (err) {
      setError('That reply could not be posted. Try again in a moment.');
    } else {
      setBody('');
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="reply-body">Reply</label>
        <textarea
          id="reply-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={4000}
          required
        />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <div>
        <button className="btn btn--small" type="submit" disabled={busy || !body.trim()}>
          {busy ? 'Posting\u2026' : 'Post reply'}
        </button>
      </div>
    </form>
  );
}
