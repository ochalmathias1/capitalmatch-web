import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ApplicationForm from '@/components/apply/ApplicationForm'

export const metadata: Metadata = {
  title: 'Apply for Business Funding',
  description: 'Fill out our simple 5-minute application. No hard credit check. No broker fees. See your merchant cash advance options in 24 hours.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://capitalmatchfunding.com/apply' },
  openGraph: {
    title: 'Apply for Business Funding | CapitalMatch',
    description: 'Fill out our simple 5-minute application. No hard credit check. No broker fees. See your funding options in 24 hours.',
    url: 'https://capitalmatchfunding.com/apply',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Apply for Business Funding — CapitalMatch' }],
  },
  twitter: {
    title: 'Apply for Business Funding | CapitalMatch',
    description: 'Fill out our simple 5-minute application. No hard credit check. No broker fees. Funding in 24 hours.',
    images: ['/opengraph-image'],
  },
}

export default function ApplyPage() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: '72px', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <div style={{
          backgroundColor: '#0D1B2A',
          padding: '3rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '0.75rem',
          }}>
            Apply for Business Funding
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-ibm, sans-serif)',
          }}>
            One application · Multiple lenders · No broker fees
          </p>
        </div>

        <div style={{ padding: '3rem 0' }}>
          <ApplicationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
