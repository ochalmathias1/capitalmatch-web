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
  title: 'CapitalMatch — Business Funding Made Simple',
  description: 'One application reaches our entire network of private lenders. Get funded in 24 hours with no broker fees.',
  keywords: 'merchant cash advance, business funding, MCA, working capital, business loans',
  openGraph: {
    title: 'CapitalMatch — Business Funding Made Simple',
    description: 'One application reaches our entire network of private lenders.',
    url: 'https://capitalmatchfunding.com',
    siteName: 'CapitalMatch',
    type: 'website',
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
