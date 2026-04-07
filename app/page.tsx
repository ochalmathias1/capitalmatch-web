import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Hero from '@/components/landing/Hero'
import Mission from '@/components/landing/Mission'
import HowItWorks from '@/components/landing/HowItWorks'
import WhyCapitalMatch from '@/components/landing/WhyCapitalMatch'
import Reviews from '@/components/landing/Reviews'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Business Funding in 24 Hours | No Broker Fees | CapitalMatch',
  description: 'One application reaches community of private lenders. Zero broker fees. All industries welcome. Bad credit options available. Get your merchant cash advance in 24 hours. Apply free today.',
  alternates: { canonical: 'https://capitalmatchfunding.com' },
  openGraph: {
    title: 'Business Funding in 24 Hours | No Broker Fees | CapitalMatch',
    description: 'One application reaches community of private lenders. Zero broker fees. All industries welcome. Bad credit options available. Apply free today.',
    url: 'https://capitalmatchfunding.com',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CapitalMatch — Business Funding in 24 Hours' }],
  },
  twitter: {
    title: 'Business Funding in 24 Hours | No Broker Fees | CapitalMatch',
    description: 'One application reaches community of private lenders. Zero broker fees. All industries welcome. Bad credit options available.',
    images: ['/opengraph-image'],
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CapitalMatch',
  url: 'https://capitalmatchfunding.com',
  description: 'CapitalMatch is a commercial finance broker providing fast merchant cash advance funding with zero broker fees. One application reaches community of private lenders.',
  email: 'lenders@capitalmatchfunding.com',
  sameAs: ['https://capitalmatchfunding.com'],
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'CapitalMatch',
  url: 'https://capitalmatchfunding.com',
  description: 'Fast merchant cash advance and business funding with zero broker fees.',
  email: 'lenders@capitalmatchfunding.com',
  areaServed: 'US',
  priceRange: 'Free — no broker fees',
  serviceType: 'Merchant Cash Advance Broker',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navigation />
      <main>
        <Hero />
        <Mission />
        <HowItWorks />
        <WhyCapitalMatch />
        <Reviews />
        <FinalCTA />

        {/* SEO keyword-rich section */}
        <section style={{ backgroundColor: '#F8F4ED', padding: '3rem 1.5rem', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              fontSize: '0.9rem',
              color: '#6B7280',
              lineHeight: 1.9,
              fontFamily: 'var(--font-ibm, sans-serif)',
              marginBottom: '1.5rem',
            }}>
              CapitalMatch provides merchant cash advance funding for small business owners across all 50 states.
              Whether you need working capital, equipment financing, payroll funding, or business expansion capital,
              our network of community of private lenders can help. We specialize in fast business funding for restaurants,
              retail stores, trucking companies, medical practices, contractors, and more.
              Bad credit business loans available. No broker fees. Apply online today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/faq" style={{ fontSize: '0.85rem', color: '#C9A84C', textDecoration: 'none', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Learn how merchant cash advances work →
              </Link>
              <Link href="/apply" style={{ fontSize: '0.85rem', color: '#C9A84C', textDecoration: 'none', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Apply for business funding today →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
