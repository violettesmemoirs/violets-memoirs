'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Fades content up on mount. Motion is short (under 700ms), eases out,
 * and is skipped entirely for people who prefer reduced motion.
 * Content is present in the server HTML, so search engines and no-JS
 * visitors always see it.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'span';
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', delay }
      );
    });
    return () => mm.revert();
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
