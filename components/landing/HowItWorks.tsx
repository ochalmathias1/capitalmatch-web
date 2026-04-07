'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { icon: '🏦', text: 'Trusted by businesses across every industry' },
  { icon: '⚡', text: 'Applications processed in minutes' },
  { icon: '🔒', text: 'Bank-level security on all data' },
  { icon: '📞', text: 'Live support from real humans' },
]

const steps = [
  {
    number: '01',
    title: 'Apply in 5 Minutes',
    desc: 'No lengthy paperwork. No branch visits. Fill out one simple form from your phone and we handle the rest.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="28" rx="3" stroke="#C9A84C" strokeWidth="1.8"/>
        <path d="M10 12h12M10 17h12M10 22h7" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Match You Instantly',
    desc: 'Your application goes to our entire lender network at once. No middlemen. No markup. Direct access to community of lenders.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#C9A84C" strokeWidth="1.8"/>
        <path d="M10 16l4 4 8-8" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Compare Your Offers',
    desc: 'Review all your funding offers side by side. Terms, amounts, payment schedules — completely transparent. You choose.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="11" height="16" rx="2" stroke="#C9A84C" strokeWidth="1.8"/>
        <rect x="17" y="4" width="11" height="20" rx="2" stroke="#C9A84C" strokeWidth="1.8"/>
        <path d="M7 28h18" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Get Funded Fast',
    desc: 'Most businesses receive funding within 24 hours of accepting their offer. Money in your account, ready to use.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 16l4-8 6 4 4-8 6 12" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 26h24" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

function Step({ step, index }: { step: typeof steps[0], index: number }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(201,168,76,0.2)',
        background: 'rgba(13,27,42,0.6)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '12px',
          backgroundColor: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {step.icon}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(201,168,76,0.6)', letterSpacing: '0.05em' }}>
            {step.number}
          </span>
          <h3 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
            {step.title}
          </h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontFamily: 'var(--font-ibm, sans-serif)' }}>
          {step.desc}
        </p>
      </div>
      {/* Gold accent line */}
      <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', backgroundColor: '#C9A84C', borderRadius: '0 2px 2px 0' }} />
    </motion.div>
  )
}

export default function HowItWorks() {
  const reduced = useReducedMotion()
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })

  return (
    <section id="how-it-works" style={{
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/bridge-cables.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(13,27,42,0.92)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Stats bar — top of the dark section */}
        <div ref={statsRef} style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '3rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem 2rem' }}>
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}
              >
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 500, lineHeight: 1.4 }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}>
          <div ref={headRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.p
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}
            >
              Simple Process
            </motion.p>
            <motion.h2
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}
            >
              Funding Simplified to 4 Steps
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {steps.map((s, i) => <Step key={s.number} step={s} index={i} />)}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <a href="/apply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2.5rem',
              backgroundColor: '#C9A84C', color: '#0D1B2A',
              borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
            }}>
              Start My Application
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
