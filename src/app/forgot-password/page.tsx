import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="section">
      <div className="wrap--narrow" style={{ maxWidth: 460 }}>
        <p className="eyebrow">It happens</p>
        <h1 className="h-display">Forgot password</h1>
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
