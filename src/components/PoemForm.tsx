'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { slugify } from '@/lib/slug';

type ExistingPoem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  published: boolean;
};

// Fire-and-forget: nudges the cached home/poems pages to update right away.
// If it fails for any reason, the normal 60s ISR revalidation still catches
// up on its own, so this is a nice-to-have, not a dependency.
function revalidate(slug: string) {
  fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}

/**
 * Handles both writing a brand new poem and editing an existing one
 * (published or draft). Pass `poem` to edit; omit it to create.
 * Autosaves unsaved work to this device so a closed tab never loses it.
 */
export default function PoemForm({ poem }: { poem?: ExistingPoem }) {
  const isEdit = !!poem;
  const router = useRouter();
  const draftKey = isEdit ? `vm-admin-draft-edit-${poem!.id}` : 'vm-admin-draft-new';

  const [title, setTitle] = useState(poem?.title ?? '');
  const [excerpt, setExcerpt] = useState(poem?.excerpt ?? '');
  const [body, setBody] = useState(poem?.body ?? '');
  const [published, setPublished] = useState(poem?.published ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedSlug, setSavedSlug] = useState('');
  const [restored, setRestored] = useState(false);
  const loaded = useRef(false);

  // Restore anything left in progress that never got saved.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.title || draft.body || draft.excerpt) {
          setTitle(draft.title ?? '');
          setExcerpt(draft.excerpt ?? '');
          setBody(draft.body ?? '');
          setPublished(draft.published ?? true);
          setRestored(true);
        }
      }
    } catch {
      // ignore a corrupted or missing draft
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Keep a running local copy of unsaved changes.
  useEffect(() => {
    if (!loaded.current) return;
    try {
      const empty = !title.trim() && !body.trim() && !excerpt.trim();
      if (empty) {
        window.localStorage.removeItem(draftKey);
      } else {
        window.localStorage.setItem(
          draftKey,
          JSON.stringify({ title, excerpt, body, published })
        );
      }
    } catch {
      // storage might be unavailable (private browsing, etc) -- fine to skip
    }
  }, [title, excerpt, body, published, draftKey]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;

    setBusy(true);
    setError('');
    setSaved(false);

    if (isEdit) {
      const { error: err } = await sb
        .from('poems')
        .update({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          body,
          published,
        })
        .eq('id', poem!.id);
      if (err) {
        setError('That update did not go through. Try again in a moment.');
      } else {
        setSaved(true);
        setRestored(false);
        try {
          window.localStorage.removeItem(draftKey);
        } catch {
          // ignore
        }
        revalidate(poem!.slug);
        router.refresh();
      }
    } else {
      const slug = slugify(title);
      if (!slug) {
        setError('The title needs at least one letter or number.');
        setBusy(false);
        return;
      }
      const { error: err } = await sb.from('poems').insert({
        slug,
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        body,
        published,
      });
      if (err) {
        setError(
          err.code === '23505'
            ? 'A poem with this title (slug) already exists. Adjust the title slightly.'
            : 'The poem could not be saved. Check the fields and try again.'
        );
      } else {
        setSaved(true);
        setSavedSlug(slug);
        setTitle('');
        setExcerpt('');
        setBody('');
        setPublished(true);
        setRestored(false);
        try {
          window.localStorage.removeItem(draftKey);
        } catch {
          // ignore
        }
        revalidate(slug);
      }
    }
    setBusy(false);
  }

  function discardRestored() {
    if (isEdit && poem) {
      setTitle(poem.title);
      setExcerpt(poem.excerpt ?? '');
      setBody(poem.body);
      setPublished(poem.published);
    } else {
      setTitle('');
      setExcerpt('');
      setBody('');
      setPublished(true);
    }
    setRestored(false);
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {restored && (
        <p className="form__ok">
          Picked up where you left off &mdash; these changes weren&rsquo;t
          saved yet, so they were kept on this device.{' '}
          <button
            type="button"
            className="btn btn--quiet btn--small"
            onClick={discardRestored}
            style={{ marginLeft: '0.5rem' }}
          >
            Discard it
          </button>
        </p>
      )}
      {isEdit && (
        <p className="muted small" style={{ marginTop: 0 }}>
          Web address: <code>/poems/{poem!.slug}</code> (can&rsquo;t be
          changed)
        </p>
      )}
      <div className="field">
        <label htmlFor="pe-title">Title</label>
        <input
          id="pe-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="pe-excerpt">Excerpt (optional, shows on cards and in search results)</label>
        <input
          id="pe-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={400}
        />
      </div>
      <div className="field">
        <label htmlFor="pe-body">The poem</label>
        <textarea
          id="pe-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ minHeight: 320 }}
          required
        />
      </div>
      <div className="field field--check">
        <input
          id="pe-published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="pe-published">
          {isEdit ? 'Published' : 'Publish right away'}
        </label>
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      {saved && isEdit && <p className="form__ok">Saved.</p>}
      {saved && !isEdit && savedSlug && (
        <p className="form__ok">
          Saved. <Link href={`/poems/${savedSlug}`}>Read it here.</Link>
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Save poem'}
        </button>
        {isEdit && (
          <Link href="/admin" className="btn btn--quiet btn--small">
            Back to the list
          </Link>
        )}
      </div>
    </form>
  );
}
