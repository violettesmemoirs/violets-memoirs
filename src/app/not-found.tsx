import Link from 'next/link';
import FlowerField from '@/components/FlowerField';
import PageFade from '@/components/PageFade';

export default function NotFound() {
  return (
    <PageFade>
      <section className="section">
        <div className="wrap--narrow">
          <p className="eyebrow">404</p>
          <h1 className="h-display">This page wandered off</h1>
          <p className="muted" style={{ maxWidth: '52ch' }}>
            Whatever was here has either moved or never existed. The poems,
            at least, are exactly where they should be.
          </p>
          <p>
            <Link href="/poems" className="btn">
              Back to the poems
            </Link>
          </p>
        </div>
      </section>
      <FlowerField hem />
    </PageFade>
  );
}
