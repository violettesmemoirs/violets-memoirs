import type { Metadata } from 'next';
import SignupForm from '@/components/SignupForm';

export const metadata: Metadata = {
  title: 'Create an account',
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <section className="section">
      <div className="wrap--narrow" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Join in</p>
        <h1 className="h-display">Create an account</h1>
        <p className="muted small">
          A free account lets you comment on poems and post in the forum.
          Reading is always open to everyone.
        </p>
        <SignupForm />
      </div>
    </section>
  );
}
