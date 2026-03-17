'use client'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { PulseButton } from '../animations'

export default function Hero() {
  const reduced = useReducedMotion()

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0, 0, 0.2, 1] } },
  }

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '72px',
      background: 'linear-gradient(160deg, #FFFFFF 0%, #F8F4ED 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background geometric */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
        <motion.div
          variants={reduced ? {} : container}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '760px' }}
        >
          <motion.div variants={reduced ? {} : item}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)',
            }}>
              Merchant Cash Advance · Fast Business Funding
            </p>
          </motion.div>

          <motion.h1
            variants={reduced ? {} : item}
            style={{
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0D1B2A',
              marginBottom: '1.5rem',
            }}
          >
            One Application.{' '}
            <span style={{ color: '#C9A84C' }}>Multiple Lenders.</span>
            {' '}Funding in 24 Hours.
          </motion.h1>

          <motion.p
            variants={reduced ? {} : item}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#4B5563',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              fontFamily: 'var(--font-ibm, sans-serif)',
              maxWidth: '620px',
            }}
          >
            Tell us about your business once and we match you with our entire network
            of private lenders — no broker fees, no runaround.
          </motion.p>

          <motion.div variants={reduced ? {} : item} style={{ marginBottom: '1.5rem' }}>
            <PulseButton className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              <Link href="/apply" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Check My Options — It&apos;s Free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </PulseButton>
          </motion.div>

          <motion.div
            variants={reduced ? {} : item}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem 1.5rem',
              fontSize: '0.8rem',
              color: '#6B7280',
              fontFamily: 'var(--font-ibm, sans-serif)',
            }}
          >
            {['No hard credit check', 'Results in 24 hours', '40+ private lenders', 'No broker fees ever'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill="#C9A84C" fillOpacity="0.15"/>
                  <path d="M4.5 7l2 2 3-3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
