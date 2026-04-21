import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Hero from '@/components/landing/Hero'
import EligibilityEstimator from '@/components/landing/EligibilityEstimator'
import HowItWorks from '@/components/landing/HowItWorks'
import OurStory from '@/components/landing/OurStory'
import Products from '@/components/landing/Products'
import Reviews from '@/components/landing/Reviews'
import Industries from '@/components/landing/Industries'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/Footer'

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
        <EligibilityEstimator />
        <div style={{ maxWidth: '200px', margin: '0 auto', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }} />
        <OurStory />
        <div style={{ maxWidth: '200px', margin: '0 auto', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }} />
        <HowItWorks />
        <div style={{ maxWidth: '200px', margin: '0 auto', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }} />
        <Products />
        <div style={{ maxWidth: '200px', margin: '0 auto', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }} />
        <Reviews />
        <Industries />
        <div style={{ maxWidth: '200px', margin: '0 auto', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3 }} />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
