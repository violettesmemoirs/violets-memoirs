import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PoemForm from '@/components/PoemForm';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit poem',
  robots: { index: false },
};

type Params = Promise<{ id: string }>;

export default async function EditPoemPage({ params }: { params: Params }) {
  const { id } = await params;
  const sb = await supabaseServer();
  if (!sb) redirect('/login');

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/admin/${id}/edit`);

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') redirect('/');

  const { data: poem } = await sb
    .from('poems')
    .select('id, slug, title, excerpt, body, published')
    .eq('id', id)
    .maybeSingle();

  if (!poem) notFound();

  return (
    <section className="section">
      <div className="wrap--narrow">
        <p className="eyebrow">
          <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
            Writing desk
          </Link>
        </p>
        <h1 className="h-display">Editing &ldquo;{poem.title}&rdquo;</h1>
        <PoemForm poem={poem} />
      </div>
    </section>
  );
}
