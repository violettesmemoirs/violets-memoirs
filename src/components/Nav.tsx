'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/poems', label: 'Poems' },
  { href: '/forum', label: 'Forum' },
];

export default function Nav() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setSignedIn(false);
      return;
    }
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Main">
        <Link href="/" className="nav__brand">
          <strong>Violet&rsquo;s</strong>
          Memoirs
        </Link>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="nav__link"
                aria-current={isCurrent(l.href) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="nav__pill-wrap">
          <span className="fireflies" aria-hidden="true">
            <span className="firefly firefly--1" />
            <span className="firefly firefly--2" />
            <span className="firefly firefly--3" />
          </span>
          {signedIn ? (
            <Link href="/account" className="nav__pill">
              Account
            </Link>
          ) : (
            <Link href="/login" className="nav__pill">
              Sign in
            </Link>
          )}
        </span>
      </nav>
    </header>
  );
}
