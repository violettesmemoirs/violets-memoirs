import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>Violet&apos;s Memoirs &copy; {new Date().getFullYear()} Violette</span>
        <span>
          <Link href="/membership">Membership</Link>
          {' \u00b7 '}
          <Link href="/forum">Ask for a poem</Link>
        </span>
      </div>
    </footer>
  );
}
