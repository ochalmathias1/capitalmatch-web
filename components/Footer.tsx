'use client'
import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1B2A', color: '#FFFFFF', padding: '4rem 1.5rem 2rem', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Logo light size="md" />
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontFamily: 'var(--font-ibm, sans-serif)' }}>
              Fast capital for small businesses. One application, 40+ lenders, zero broker fees.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>Navigation</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Apply Now', href: '/apply' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'var(--font-ibm, sans-serif)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>Contact Us</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '0.2rem' }}>Dave Jacobs</p>
                <a href="tel:6463069312" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none', fontWeight: 500 }}>646-306-9312</a>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '0.2rem' }}>Matt Jacobs</p>
                <a href="tel:8482499289" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none', fontWeight: 500 }}>848-249-9289</a>
              </div>
              <a href="mailto:support@capitalmatchfunding.com" style={{ color: '#C9A84C', fontSize: '0.85rem', fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none' }}>support@capitalmatchfunding.com</a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', maxWidth: '600px', lineHeight: 1.7, fontFamily: 'var(--font-ibm, sans-serif)' }}>
            CapitalMatch is a commercial finance broker. We are not a direct lender. Funding is subject to lender approval and underwriting.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ibm, sans-serif)' }}>
            © 2026 CapitalMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
