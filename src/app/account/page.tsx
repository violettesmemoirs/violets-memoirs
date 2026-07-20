import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';
import { supabaseServer } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your account',
  robots: { index: false },
};

export default async function AccountPage() {
  const sb = await supabaseServer();
  if (!sb) redirect('/login');

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect('/login?next=/account');

  const { data: profile } = (await sb
    .from('profiles')
    .select('id, display_name, role, is_member, created_at')
    .eq('id', user.id)
    .maybeSingle()) as { data: Profile | null };

  const tier =
    profile?.role === 'admin'
      ? 'Administrator'
      : profile?.is_member
        ? 'Member (monthly plan)'
        : 'Subscriber (free account)';

  return (
    <section className="section">
      <div className="wrap--narrow" style={{ maxWidth: 560 }}>
        <p className="eyebrow">Your account</p>
        <h1 className="h-display">
          Hello, {profile?.display_name ?? 'Reader'}
        </h1>
        <div className="member-panel">
          <p style={{ marginTop: 0 }}>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Level:</strong> {tier}
          </p>
          {!profile?.is_member && profile?.role !== 'admin' && (
            <p>
              Want the behind-the-scenes writing?{' '}
              <Link href="/membership">See what membership includes.</Link>
            </p>
          )}
          {profile?.role === 'admin' && (
            <p>
              <Link href="/admin">Go to the writing desk</Link> to publish
              poems and notebook entries.
            </p>
          )}
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
