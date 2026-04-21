'use client'
import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#07111D',
      color: '#FFFFFF',
      padding: '4.5rem 1.5rem 2.5rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 4-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand */}
          <div>
            <Logo light size="md" />
            <p style={{
              marginTop: '1.25rem',
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              fontFamily: 'var(--font-ibm, sans-serif)',
            }}>
              Fast capital for American business. One application, a network of lenders, zero broker fees.
            </p>
          </div>

          {/* Company */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.25rem',
            }}>
              COMPANY
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'About', action: 'our-story' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: 'mailto:lenders@capitalmatchfunding.com' },
              ].map(l => (
                l.action ? (
                  <button
                    key={l.label}
                    onClick={() => {
                      const el = document.getElementById(l.action!)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-ibm, sans-serif)',
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {l.label}
                  </button>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-ibm, sans-serif)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {l.label}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.25rem',
            }}>
              PRODUCTS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Working Capital', href: '/apply' },
                { label: 'Revenue Advance', href: '/apply' },
                { label: 'Bridge Financing', href: '/apply' },
              ].map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-ibm, sans-serif)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.25rem',
            }}>
              CONTACT
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a href="tel:3478139747" style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                Eddie (347) 813-9747
              </a>
              <a href="tel:8482499289" style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                William (848) 249-9289
              </a>
              <a href="mailto:lenders@capitalmatchfunding.com" style={{
                color: 'var(--gold)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                marginTop: '0.25rem',
              }}>
                lenders@capitalmatchfunding.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.3)',
            maxWidth: '640px',
            lineHeight: 1.7,
            fontFamily: 'var(--font-ibm, sans-serif)',
          }}>
            CapitalMatch is a commercial finance broker. We are not a direct lender. Funding is subject to lender approval and underwriting. Results may vary.
          </p>
          <p style={{
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-ibm, sans-serif)',
          }}>
            &copy; 2026 CapitalMatch. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile: 2-col then stack */}
      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
