'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    setBusy(true);
    await sb.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button className="btn btn--quiet btn--small" onClick={signOut} disabled={busy}>
      {busy ? 'Signing out\u2026' : 'Sign out'}
    </button>
  );
}
