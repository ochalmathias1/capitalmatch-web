'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const steps = [
  {
    numeral: 'i.',
    kicker: 'STEP ONE',
    title: 'Apply in 5 Minutes',
    body: 'No lengthy paperwork. No branch visits. Fill out one simple online form and we handle everything from there.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" stroke="var(--gold-dark)" strokeWidth="1.2" fill="none"/>
        <rect x="16" y="12" width="16" height="22" rx="2" stroke="var(--gold)" strokeWidth="1.4" fill="none"/>
        <path d="M20 19h8M20 23h8M20 27h5" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    numeral: 'ii.',
    kicker: 'STEP TWO',
    title: 'We Match You Instantly',
    body: 'Your application goes to our entire lender network at once. Multiple offers, one application. You choose the best fit.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" stroke="var(--gold-dark)" strokeWidth="1.2" fill="none"/>
        <circle cx="24" cy="24" r="8" stroke="var(--gold)" strokeWidth="1.4" fill="none"/>
        <path d="M24 16v-4M24 36v-4M16 24h-4M36 24h-4" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M18.3 18.3l-2-2M31.7 31.7l-2-2M18.3 29.7l-2 2M31.7 18.3l-2 2" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    numeral: 'iii.',
    kicker: 'STEP THREE',
    title: 'Get Funded Fast',
    body: 'Accept the offer you like best and receive funds as fast as the same day. Most clients are funded within 24 hours.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" stroke="var(--gold-dark)" strokeWidth="1.2" fill="none"/>
        <path d="M17 28l4-12h6l-2 6h7l-10 14 2-8h-7z" stroke="var(--gold)" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: 'var(--cream)',
        padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold-dark)',
              marginBottom: '1rem',
            }}
          >
            — HOW IT WORKS —
          </motion.p>
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}
          >
            Three Steps to <span style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>Funding.</span>
          </motion.h2>
        </div>

        {/* ONE bordered panel with 3 cells */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            border: '1px solid var(--line)',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            overflow: 'hidden',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.kicker}
              style={{
                padding: 'clamp(2.5rem, 4vw, 3.5rem) clamp(2rem, 3vw, 3rem)',
                borderLeft: i > 0 ? '1px solid var(--line)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                position: 'relative',
              }}
            >
              {/* Gold top accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '2px',
                backgroundColor: 'var(--gold)',
                opacity: 0.6,
              }} />
              {/* Italic numeral */}
              <span style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--gold-dark)',
                fontWeight: 600,
              }}>
                {step.numeral}
              </span>

              {/* Icon */}
              <div style={{ marginBottom: '0.25rem' }}>
                {step.icon}
              </div>

              {/* Mono kicker */}
              <p style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                fontWeight: 500,
              }}>
                {step.kicker}
              </p>

              {/* Serif heading */}
              <h3 style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.25,
              }}>
                {step.title}
              </h3>

              {/* Body text */}
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--muted)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-ibm, sans-serif)',
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          #how-it-works div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          #how-it-works div[style*="grid-template-columns: repeat(3"] > div {
            border-left: none !important;
            border-top: 1px solid var(--line);
          }
          #how-it-works div[style*="grid-template-columns: repeat(3"] > div:first-child {
            border-top: none;
          }
        }
      `}</style>
    </section>
  )
}
