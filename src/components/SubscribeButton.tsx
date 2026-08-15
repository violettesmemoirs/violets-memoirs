'use client';

import { useState } from 'react';

export default function SubscribeButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function subscribe() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? 'Checkout is not available right now.');
    } catch {
      setError('Checkout is not available right now.');
    }
    setBusy(false);
  }

  return (
    <div>
      <button className="btn" onClick={subscribe} disabled={busy}>
        {busy ? 'Opening checkout\u2026' : 'Join monthly'}
      </button>
      {error && (
        <p className="form__error" role="alert" style={{ marginTop: '0.75rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
