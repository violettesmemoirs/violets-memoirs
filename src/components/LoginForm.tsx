'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    setBusy(true);
    setError('');
    const { error: err } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      setError('That email and password combination did not work.');
      setBusy(false);
      return;
    }
    const next = searchParams.get('next');
    router.push(next && next.startsWith('/') ? next : '/');
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Signing in\u2026' : 'Sign in'}
      </button>
      <div className="form__links">
        <Link href="/forgot-password">Forgot password?</Link>
        <Link href="/signup">Create an account</Link>
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        Just here to read? You don&rsquo;t need an account for that.
      </p>
    </form>
  );
}
