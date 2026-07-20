import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <section className="section">
      <div className="wrap--narrow" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Welcome back</p>
        <h1 className="h-display">Sign in</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
