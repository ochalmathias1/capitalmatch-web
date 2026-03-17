import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1B2A', color: '#FFFFFF', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
          <Logo light size="md" />
          <p style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '560px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-ibm, IBM Plex Sans, sans-serif)',
          }}>
            CapitalMatch is a commercial finance broker. We are not a direct lender.
            Funding is subject to lender approval and underwriting.
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-ibm, sans-serif)' }}>
            © 2026 CapitalMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
