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
  title: 'CapitalMatch — Business Funding in 24 Hours',
  description: 'One application. 40+ lenders. Zero broker fees. Get funded fast.',
  keywords: 'merchant cash advance, business funding, MCA, working capital, small business loans',
  openGraph: {
    title: 'CapitalMatch — Business Funding in 24 Hours',
    description: 'One application. 40+ lenders. Zero broker fees. Get funded fast.',
    url: 'https://capitalmatchfunding.com',
    siteName: 'CapitalMatch',
    type: 'website',
    images: [
      {
        url: 'https://capitalmatchfunding.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CapitalMatch — Business Funding in 24 Hours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CapitalMatch — Business Funding in 24 Hours',
    description: 'One application. 40+ lenders. Zero broker fees. Get funded fast.',
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
