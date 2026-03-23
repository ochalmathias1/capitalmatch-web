import type { Metadata } from 'next'
import { Playfair_Display, IBM_Plex_Sans, Dancing_Script } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://capitalmatchfunding.com'),
  title: {
    template: '%s | CapitalMatch',
    default: 'CapitalMatch — Fast Business Funding | No Broker Fees',
  },
  description: 'Get funded in 24 hours with zero broker fees. One application reaches 40+ private lenders. All industries. Bad credit options available. Apply free today.',
  keywords: [
    'merchant cash advance',
    'business funding',
    'MCA broker',
    'small business loans',
    'fast business funding',
    'no broker fees',
    'bad credit business loans',
    'MCA funding 24 hours',
    'business cash advance online',
    'merchant cash advance no broker fees',
    'business funding bad credit',
    'same day business funding',
    'business funding New York',
    'MCA funding fast',
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://capitalmatchfunding.com' },
  openGraph: {
    type: 'website',
    siteName: 'CapitalMatch',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CapitalMatch — Fast Business Funding | No Broker Fees' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  verification: {
    google: 'PASTE_YOUR_CODE_HERE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${ibmPlex.variable} ${dancing.variable}`}>
      <body style={{ fontFamily: 'var(--font-ibm), IBM Plex Sans, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
