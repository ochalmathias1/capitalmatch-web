'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const reduced = useReducedMotion()

  const fadeUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }

  const trustItems = [
    'No broker fees ever',
    'No hard credit check',
    'Results in 24 hours',
    'Community of private lenders',
    'All industries welcome',
    'Bad credit options available',
  ]

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bridge background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/hero-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark overlay — navy gradient for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.82) 40%, rgba(13,27,42,0.7) 100%)',
      }} />

      {/* Subtle gold glow at top right */}
      <motion.div
        animate={reduced ? {} : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-5%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem, 8vw, 6rem) 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <motion.div {...fadeUp(0.1)}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '1.75rem',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9A84C' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'var(--font-ibm, sans-serif)' }}>
              Merchant Cash Advance · Zero Broker Fees
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#FFFFFF',
          marginBottom: '1.5rem',
          maxWidth: '800px',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          Fast Capital.{' '}
          <span style={{ color: '#C9A84C' }}>Zero Broker Fees.</span>
          <br />Funding in 24 Hours.
        </motion.h1>

        {/* Subheadline */}
        <motion.p {...fadeUp(0.3)} style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.75,
          marginBottom: '2.5rem',
          maxWidth: '580px',
          fontFamily: 'var(--font-ibm, sans-serif)',
          textShadow: '0 1px 8px rgba(0,0,0,0.2)',
        }}>
          Most business owners get passed around by brokers who take a cut of everything. We cut them out entirely.
          One application reaches our entire lender network — and you keep every dollar.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <motion.div
            animate={reduced ? {} : { boxShadow: ['0 0 20px rgba(201,168,76,0.3)', '0 0 35px rgba(201,168,76,0.55)', '0 0 20px rgba(201,168,76,0.3)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ borderRadius: '8px' }}
          >
            <Link href="/apply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2rem',
              backgroundColor: '#C9A84C', color: '#0D1B2A',
              borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
            }}>
              Check My Options — It&apos;s Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          <button
            onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2rem',
              backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF',
              border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '8px',
              fontWeight: 600, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#FFFFFF' }}
          >
            See How It Works
          </button>
        </motion.div>

        {/* Trust bar */}
        <motion.div {...fadeUp(0.5)}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.75rem',
          }}>
            {trustItems.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 500 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
