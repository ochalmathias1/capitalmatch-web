'use client'
import { FadeUp, StaggerContainer, StaggerItem, CountUp } from '../animations'

const features = [
  {
    title: 'No Middleman Markups',
    description: 'You get lender-direct rates without inflated costs.',
    icon: '◈',
  },
  {
    title: 'One Application',
    description: 'Reaches our entire lender network simultaneously.',
    icon: '◈',
  },
  {
    title: 'All Industries',
    description: 'We work with every type of business, every sector.',
    icon: '◈',
  },
  {
    title: 'Fast Decisions',
    description: 'Results and offers typically within 24 hours.',
    icon: '◈',
  },
  {
    title: 'Bad Credit Options',
    description: 'We have lenders for every credit situation.',
    icon: '◈',
  },
  {
    title: 'No Broker Fees',
    description: 'Ever. Our commission is paid by the lender, not you.',
    icon: '◈',
  },
]

const stats = [
  { value: 40, suffix: '+', label: 'Private Lenders' },
  { value: 24, suffix: 'hr', label: 'Average Decision' },
  { value: 98, suffix: '%', label: 'Application Approval Rate' },
  { value: 5, suffix: 'min', label: 'To Apply' },
]

export default function WhyCapitalMatch() {
  return (
    <>
      {/* Stats bar */}
      <section style={{ backgroundColor: '#0D1B2A', padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            {stats.map((s) => (
              <FadeUp key={s.label}>
                <div>
                  <p style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 800,
                    color: '#C9A84C',
                    fontFamily: 'var(--font-playfair, serif)',
                    lineHeight: 1,
                    marginBottom: '0.4rem',
                  }}>
                    <CountUp target={s.value} suffix={s.suffix} />
                  </p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.65)',
                    fontFamily: 'var(--font-ibm, sans-serif)',
                  }}>
                    {s.label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#F8F4ED' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="section-heading">Why Business Owners Choose CapitalMatch</h2>
              <div className="gold-divider" style={{ margin: '1rem auto 0' }} />
            </div>
          </FadeUp>

          <StaggerContainer style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1.5px solid #F0EAE0',
                  transition: 'box-shadow 0.2s',
                  alignItems: 'flex-start',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(13,27,42,0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  <span style={{ color: '#C9A84C', fontSize: '1.2rem', marginTop: '2px', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-playfair, serif)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#0D1B2A',
                      marginBottom: '0.4rem',
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-ibm, sans-serif)',
                    }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Bottom CTA */}
          <FadeUp>
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <a href="/apply" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                Start My Application →
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
