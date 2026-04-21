'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const reduced = useReducedMotion()

  const fadeUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] },
  }

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image with ken-burns drift */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: '-5%',
          backgroundImage: 'url(/story-bridge.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.42,
          animation: reduced ? 'none' : 'slow-drift 32s ease-in-out infinite alternate',
          transformOrigin: 'center center',
        }} />
      </div>

      {/* SVG noise grain overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.035,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />

      {/* Gradient overlays for text legibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(10,23,37,0.85) 0%, rgba(10,23,37,0.6) 50%, rgba(10,23,37,0.9) 100%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(10,23,37,0.5) 0%, transparent 60%)',
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(7rem, 14vw, 10rem) 1.5rem clamp(6rem, 10vw, 8rem)',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Mono eyebrow */}
        <motion.p {...fadeUp(0.1)} style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '2rem',
          fontWeight: 400,
        }}>
          — MERCHANT CASH ADVANCE &middot; EST. NEW YORK —
        </motion.p>

        {/* Huge serif headline */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: 'clamp(56px, 8vw, 112px)',
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: '-0.028em',
          color: '#FFFFFF',
          marginBottom: '2rem',
          maxWidth: '900px',
        }}>
          Fast Capital.<br />
          <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Zero Broker Fees.</span><br />
          Funded in 24 Hours.
        </motion.h1>

        {/* Subtext */}
        <motion.p {...fadeUp(0.35)} style={{
          fontSize: '19.5px',
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '620px',
          fontFamily: 'var(--font-ibm, sans-serif)',
          fontWeight: 300,
        }}>
          Most business owners get passed around by brokers who take a cut of everything. We cut them out entirely. One application reaches our entire lender network — and you keep every dollar.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.45)} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0' }}>
          <Link href="/apply" className="btn-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '1rem 2rem',
            color: 'var(--navy)',
            borderRadius: '6px', fontWeight: 700, fontSize: '1rem',
            fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
          }}>
            Check My Options — It&apos;s Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <button
            onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2rem',
              backgroundColor: 'transparent', color: '#FFFFFF',
              border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: '6px',
              fontWeight: 600, fontSize: '1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', cursor: 'pointer',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#FFFFFF' }}
          >
            See How It Works
          </button>
        </motion.div>
      </div>

      {/* 3-stat row at bottom */}
      <motion.div
        initial={reduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(10,23,37,0.5)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
        }}>
          {[
            { label: '24hr', sub: 'Funding' },
            { label: 'Curated Network', sub: 'of Private Lenders' },
            { label: '$10K - $2M', sub: 'Funding Range' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              {i > 0 && (
                <div style={{
                  width: '1px',
                  height: '32px',
                  backgroundColor: 'var(--gold)',
                  opacity: 0.3,
                  margin: '0 clamp(1.5rem, 4vw, 3.5rem)',
                }} />
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-playfair, serif)',
                  fontSize: 'clamp(16px, 2.2vw, 22px)',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
