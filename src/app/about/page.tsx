import type { Metadata } from 'next';
import FlowerField from '@/components/FlowerField';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Violette collects things most people walk past and writes quiet, curious poems about them. This is where she keeps the pieces.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="wrap--narrow">
          <Reveal>
            <p className="eyebrow">About</p>
            <h1 className="h-display">The person behind the pieces</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="prose">
              <p>I collect things that most people walk past.</p>
              <p>
                The color of evening before it becomes night. Conversations
                that stay with me for weeks. Scientific ideas that make the
                universe feel impossibly large. Tiny details that somehow
                explain people better than grand declarations ever could.
              </p>
              <p>
                I write because I notice. I notice the way colors fade, how
                memories distort themselves, how people hide entire stories
                inside ordinary sentences. My poems are often quiet, but
                they&rsquo;re curious. They ask more questions than they
                answer.
              </p>
              <p>
                If you stay here long enough, you&rsquo;ll probably find
                things like sunlight sharing a page with blue. I don&rsquo;t
                think those things are opposites. I think they&rsquo;ve always
                belonged together.
              </p>
              <p>This website is simply a place to keep the pieces.</p>
            </div>
          </Reveal>
        </div>
      </section>
      <FlowerField hem />
    </>
  );
}
