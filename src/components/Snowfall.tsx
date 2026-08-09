'use client';

import { useEffect, useState } from 'react';

type Flake = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

const FLAKES: Flake[] = [
  { left: 4, size: 4, duration: 17, delay: -3, drift: 18, opacity: 0.6 },
  { left: 12, size: 3, duration: 13, delay: -8, drift: -14, opacity: 0.5 },
  { left: 21, size: 5, duration: 20, delay: -1, drift: 10, opacity: 0.7 },
  { left: 30, size: 3, duration: 15, delay: -11, drift: -20, opacity: 0.45 },
  { left: 39, size: 4, duration: 18, delay: -6, drift: 16, opacity: 0.6 },
  { left: 49, size: 3, duration: 14, delay: -2, drift: -12, opacity: 0.5 },
  { left: 58, size: 5, duration: 21, delay: -9, drift: 20, opacity: 0.65 },
  { left: 67, size: 3, duration: 16, delay: -4, drift: -16, opacity: 0.5 },
  { left: 75, size: 4, duration: 19, delay: -13, drift: 14, opacity: 0.55 },
  { left: 84, size: 3, duration: 12, delay: -7, drift: -10, opacity: 0.45 },
  { left: 91, size: 5, duration: 22, delay: -15, drift: 18, opacity: 0.6 },
  { left: 97, size: 3, duration: 15, delay: -5, drift: -14, opacity: 0.5 },
];

/**
 * A sparse, slow drift of snow behind the page content. Purely decorative,
 * so it renders nothing during SSR and nothing at all for people who
 * prefer reduced motion \u2014 static snow dots would just be clutter.
 */
export default function Snowfall() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShow(!mq.matches);
  }, []);

  if (!show) return null;

  return (
    <div className="snowfall" aria-hidden="true">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--drift': `${f.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
