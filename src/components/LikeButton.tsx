'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

function getAnonId(): string {
  const KEY = 'vm-reader-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export default function LikeButton({
  poemId,
  initialCount,
}: {
  poemId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) return;
    (async () => {
      const { data: userData } = await sb.auth.getUser();
      const user = userData.user;
      const query = sb.from('likes').select('id').eq('poem_id', poemId);
      const { data } = user
        ? await query.eq('user_id', user.id).maybeSingle()
        : await query.eq('anon_id', getAnonId()).maybeSingle();
      if (data) setLiked(true);
    })();
  }, [poemId]);

  async function toggle() {
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    setBusy(true);
    const { data: userData } = await sb.auth.getUser();
    const user = userData.user;

    if (liked) {
      const del = sb.from('likes').delete().eq('poem_id', poemId);
      const { error } = user
        ? await del.eq('user_id', user.id)
        : await del.eq('anon_id', getAnonId());
      if (!error) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      }
    } else {
      const row: { poem_id: string; user_id?: string; anon_id?: string } = user
        ? { poem_id: poemId, user_id: user.id }
        : { poem_id: poemId, anon_id: getAnonId() };
      const { error } = await sb.from('likes').insert(row);
      if (!error) {
        setLiked(true);
        setCount((c) => c + 1);
      }
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      className="action-btn"
      aria-pressed={liked}
      onClick={toggle}
      disabled={busy}
    >
      <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      {liked ? 'Liked' : 'Like'} {'\u00B7'} {count}
    </button>
  );
}
