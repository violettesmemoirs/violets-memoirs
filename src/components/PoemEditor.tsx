'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';
import { slugify } from '@/lib/slug';

export default function PoemEditor() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [membersOnly, setMembersOnly] = useState(false);
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedSlug, setSavedSlug] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabaseBrowser();
    if (!sb || busy) return;
    const slug = slugify(title);
    if (!slug) {
      setError('The title needs at least one letter or number.');
      return;
    }
    setBusy(true);
    setError('');
    setSavedSlug('');
    const { error: err } = await sb.from('poems').insert({
      slug,
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      body,
      members_only: membersOnly,
      published,
    });
    if (err) {
      setError(
        err.code === '23505'
          ? 'A poem with this title (slug) already exists. Adjust the title slightly.'
          : 'The poem could not be saved. Check the fields and try again.'
      );
    } else {
      setSavedSlug(slug);
      setTitle('');
      setExcerpt('');
      setBody('');
      setMembersOnly(false);
      setPublished(true);
    }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={submit}>
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
          id="pe-members"
          type="checkbox"
          checked={membersOnly}
          onChange={(e) => setMembersOnly(e.target.checked)}
        />
        <label htmlFor="pe-members">Members only (goes in the notebook)</label>
      </div>
      <div className="field field--check">
        <input
          id="pe-published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="pe-published">Publish right away</label>
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      {savedSlug && (
        <p className="form__ok">
          Saved. <Link href={`/poems/${savedSlug}`}>Read it here.</Link>
        </p>
      )}
      <div>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Saving\u2026' : 'Save poem'}
        </button>
      </div>
    </form>
  );
}
