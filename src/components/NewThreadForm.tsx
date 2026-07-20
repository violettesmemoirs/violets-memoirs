'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function NewThreadForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
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
      <p className="muted">
        <Link href="/login">Sign in</Link> or{' '}
        <Link href="/signup">create a free account</Link> to start a thread.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    if (!title.trim() || !body.trim()) return;
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
      .from('threads')
      .insert({ title: title.trim(), body: body.trim(), author_id: user.id })
      .select('id')
      .single();
    if (err || !data) {
      setError('That thread could not be posted. Try again in a moment.');
      setBusy(false);
    } else {
      router.push(`/forum/${data.id}`);
      router.refresh();
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="thread-title">Topic</label>
        <input
          id="thread-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder="An idea, a question, or something you want Violette to write about"
        />
      </div>
      <div className="field">
        <label htmlFor="thread-body">Say more</label>
        <textarea
          id="thread-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={8000}
          required
        />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <div>
        <button
          className="btn btn--small"
          type="submit"
          disabled={busy || !title.trim() || !body.trim()}
        >
          {busy ? 'Posting\u2026' : 'Start thread'}
        </button>
      </div>
    </form>
  );
}
