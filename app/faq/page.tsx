import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FAQAccordion from '@/components/faq/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Business Funding FAQ | What is a Merchant Cash Advance',
  description: 'Get answers to common questions about merchant cash advances, how MCA funding works, qualification requirements, factor rates, and more. No broker fees.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://capitalmatchfunding.com/faq' },
  openGraph: {
    title: 'Business Funding FAQ | What is a Merchant Cash Advance | CapitalMatch',
    description: 'Get answers to common questions about merchant cash advances, how MCA funding works, qualification requirements, and more.',
    url: 'https://capitalmatchfunding.com/faq',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CapitalMatch Business Funding FAQ' }],
  },
  twitter: {
    title: 'Business Funding FAQ | CapitalMatch',
    description: 'Get answers to common questions about merchant cash advances and business funding.',
    images: ['/opengraph-image'],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Merchant Cash Advance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Merchant Cash Advance (MCA) is a type of business financing where a lender provides you with a lump sum of capital in exchange for a fixed amount repaid over time through daily or weekly payments. Unlike a traditional loan, MCA approval is based primarily on your business revenue — not just your credit score. This makes it one of the fastest and most accessible forms of funding for small business owners.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is CapitalMatch different from other brokers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most brokers take a commission from you or mark up the lender\'s rate before presenting it to you. We do neither. CapitalMatch earns a standard ISO commission directly from the lender when your deal funds — you never pay us anything. We also submit your application to multiple lenders simultaneously so you get real competing offers instead of whatever one broker feels like showing you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can I get funded?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most of our clients receive funding within 24 hours of accepting an offer. In some cases same day funding is possible depending on the lender and how quickly you can provide final documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the requirements to qualify?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Requirements vary by lender but generally you will need to be in business for at least 3 to 6 months and have consistent monthly revenue. Credit score requirements also vary — we have lenders who work with scores as low as 500. You will need to provide recent bank statements so lenders can verify your revenue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does applying affect my credit score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Our initial application process does not require a hard credit pull. Lenders may run a soft inquiry to pre-qualify you which does not affect your score. A hard pull only happens if you choose to accept a specific offer and move forward with a lender.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can I qualify for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Funding amounts depend on your monthly revenue. Most lenders will advance between 50% and 150% of your average monthly revenue. If your business generates $30,000 per month you could potentially qualify for $15,000 to $45,000 depending on your profile and how many open positions you currently have.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a factor rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A factor rate is how MCA lenders express the cost of capital. It is a fixed multiplier applied to the funded amount. For example a $20,000 advance at a 1.40 factor rate means you repay $28,000 total regardless of how quickly you pay it back. Unlike interest rates factor rates do not compound over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents do I need to apply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To apply you just need to fill out our online application. When you accept an offer we will ask you for three final documents: a voided business check, a copy of your driver\'s license, and proof of your EIN such as a filed business tax return.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I qualify with bad credit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many of our lending partners specialize in working with business owners who have credit challenges. While a higher credit score gives you access to better rates and terms, we have helped business owners with scores as low as 500 get funded. Your revenue history and time in business often matter more than your credit score.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I apply if I already have an open MCA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many business owners have existing advances. Lenders refer to this as stacking. Having one or two open positions does not automatically disqualify you, though it may affect the amount and terms of your offer. We are transparent with our lenders about your current position so there are no surprises.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I repay the advance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Repayment is automatic. Most advances are repaid through fixed daily or weekly ACH debits from your business bank account. The amount is fixed so you always know exactly what will come out and when. There are no variable payments tied to your sales volume.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there any obligation after I apply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'None at all. Applying is completely free and there is no obligation to accept any offer. You can review all your offers and choose the one that works best for your business — or decline them all. We never charge application fees or commitment fees.',
      },
    },
  ],
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section style={{
          backgroundColor: '#0D1B2A',
          paddingTop: '72px',
          padding: 'calc(72px + 5rem) 1.5rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
              Knowledge Base
            </p>
            <h1 style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}>
              Merchant Cash Advance FAQ
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              fontFamily: 'var(--font-ibm, sans-serif)',
            }}>
              Everything you need to know about MCA funding and how CapitalMatch works.
            </p>
          </div>
        </section>

        {/* Accordion */}
        <section style={{ backgroundColor: '#FFFFFF', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FAQAccordion />
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{
          backgroundColor: '#0D1B2A',
          padding: 'clamp(4rem, 8vw, 6rem) 1.5rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}>
              Still have questions?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-ibm, sans-serif)', lineHeight: 1.7 }}>
              Email us at{' '}
              <a href="mailto:lenders@capitalmatchfunding.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                lenders@capitalmatchfunding.com
              </a>
              {' '}— we respond the same business day.
            </p>
            <Link href="/apply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2.5rem',
              backgroundColor: '#C9A84C', color: '#0D1B2A',
              borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
            }}>
              Apply for Business Funding — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
