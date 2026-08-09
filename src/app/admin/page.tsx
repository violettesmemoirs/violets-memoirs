import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PoemEditor from '@/components/PoemEditor';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Writing desk',
  robots: { index: false },
};

export default async function AdminPage() {
  const sb = await supabaseServer();
  if (!sb) redirect('/login');

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') redirect('/');

  return (
    <section className="section">
      <div className="wrap--narrow">
        <p className="eyebrow">Admin only</p>
        <h1 className="h-display">The writing desk</h1>
        <p className="muted small" style={{ maxWidth: '58ch' }}>
          Publish a new poem here. Line breaks are kept exactly as you type
          them. Untick &ldquo;publish right away&rdquo; to save it as a draft
          instead.
        </p>
        <PoemEditor />
      </div>
    </section>
  );
}
