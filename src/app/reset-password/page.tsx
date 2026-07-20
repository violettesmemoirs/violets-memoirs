import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <section className="section">
      <div className="wrap--narrow" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Nearly done</p>
        <h1 className="h-display">Choose a new password</h1>
        <ResetPasswordForm />
      </div>
    </section>
  );
}
