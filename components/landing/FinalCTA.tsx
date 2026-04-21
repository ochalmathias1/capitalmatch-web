'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Logo from '../Logo'

export default function FinalCTA() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{
      backgroundColor: 'var(--navy)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      textAlign: 'center',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/story-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(10,23,37,0.5) 0%, rgba(10,23,37,0.3) 50%, rgba(10,23,37,0.6) 100%)',
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}
        >
          <Logo light size="lg" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(3rem, 7vw, 82px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Your bridge to<br />
          <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>faster capital.</span>
        </motion.h2>

        {/* Lead text */}
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-ibm, sans-serif)',
            fontWeight: 300,
          }}
        >
          It takes 5 minutes. There is no hard credit check. And it costs you absolutely nothing.
        </motion.p>

        {/* Gold CTA */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <Link href="/apply" className="btn-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '1.125rem 2.5rem',
            color: 'var(--navy)',
            borderRadius: '6px', fontWeight: 700, fontSize: '1.05rem',
            fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
          }}>
            Check My Options — It&apos;s Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>

        {/* Mono note */}
        <motion.p
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          Soft check only &middot; Funded in 24 hours
        </motion.p>
      </div>
    </section>
  )
}
