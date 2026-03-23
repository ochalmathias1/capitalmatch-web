import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FAQAccordion from '@/components/faq/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — CapitalMatch Business Funding',
  description: 'Everything you need to know about MCA funding and how CapitalMatch works.',
  openGraph: {
    title: 'FAQ — CapitalMatch Business Funding',
    description: 'Everything you need to know about MCA funding and how CapitalMatch works.',
    url: 'https://capitalmatchfunding.com/faq',
    siteName: 'CapitalMatch',
    type: 'website',
  },
}

export default function FAQPage() {
  return (
    <>
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
              Frequently Asked Questions
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
              Call us directly — real humans answer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '0.25rem' }}>Dave Jacobs</p>
                <a href="tel:6463069312" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C9A84C', fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none' }}>646-306-9312</a>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '0.25rem' }}>Matt Jacobs</p>
                <a href="tel:8482499289" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C9A84C', fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none' }}>848-249-9289</a>
              </div>
            </div>
            <Link href="/apply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2.5rem',
              backgroundColor: '#C9A84C', color: '#0D1B2A',
              borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
            }}>
              Apply Now — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
