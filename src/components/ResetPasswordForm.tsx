'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    if (password.length < 8) {
      setError('Use a password of at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: err } = await sb.auth.updateUser({ password });
    if (err) {
      setError(
        'The reset link may have expired. Request a new one from the forgot-password page.'
      );
      setBusy(false);
      return;
    }
    router.push('/account');
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="rp-password">New password</label>
        <input
          id="rp-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="rp-confirm">Repeat it</label>
        <input
          id="rp-confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Saving\u2026' : 'Save password'}
      </button>
    </form>
  );
}
