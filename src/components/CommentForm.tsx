'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function CommentForm({ poemId }: { poemId: string }) {
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
        <Link href="/signup">create a free account</Link> to leave a comment.
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
      .from('comments')
      .insert({ poem_id: poemId, author_id: user.id, body: text });
    if (err) {
      setError('That comment could not be saved. Try again in a moment.');
    } else {
      setBody('');
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="comment-body">Leave a comment</label>
        <textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          required
          placeholder="What did this one leave you with?"
        />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <div>
        <button className="btn btn--small" type="submit" disabled={busy || !body.trim()}>
          {busy ? 'Posting\u2026' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
