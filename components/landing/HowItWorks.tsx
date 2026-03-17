'use client'
import { StaggerContainer, StaggerItem } from '../animations'

const steps = [
  {
    number: '01',
    title: 'Apply in Minutes',
    description: 'Fill out one simple application. No lengthy paperwork.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="4" width="20" height="24" rx="2" stroke="#C9A84C" strokeWidth="1.5"/>
        <path d="M10 10h12M10 14h12M10 18h8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Match You Instantly',
    description: 'Our system matches your profile to our entire lender network automatically.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#C9A84C" strokeWidth="1.5"/>
        <path d="M16 10v6l4 2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 16H4M28 16h-2M16 6V4M16 28v-2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Review Your Offers',
    description: 'See all your funding offers side by side. Pick the one that works for your business.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="11" height="16" rx="1.5" stroke="#C9A84C" strokeWidth="1.5"/>
        <rect x="17" y="8" width="11" height="16" rx="1.5" stroke="#C9A84C" strokeWidth="1.5"/>
        <path d="M7 13h5M7 17h5M20 13h5M20 17h5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Get Funded Fast',
    description: 'Funding typically arrives within 24 hours of accepting your offer.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l3 9h9l-7.5 5.5 3 9L16 22l-7.5 5.5 3-9L4 13h9z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '6rem 1.5rem', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-heading">Get Funded in 4 Simple Steps</h2>
          <div className="gold-divider" style={{ margin: '1rem auto 0' }} />
        </div>

        <StaggerContainer style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
        }}>
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div style={{
                padding: '2rem',
                borderRadius: '12px',
                border: '1.5px solid #F0EAE0',
                backgroundColor: '#FDFCFB',
                height: '100%',
                transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(201,168,76,0.12)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#F0EAE0'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>{step.icon}</div>
                <p style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#C9A84C',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-ibm, sans-serif)',
                }}>
                  STEP {step.number}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-playfair, serif)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#0D1B2A',
                  marginBottom: '0.75rem',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-ibm, sans-serif)',
                }}>
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
