'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

const industries = [
  { name: 'Construction', range: '$15K–$500K' },
  { name: 'Restaurants', range: '$10K–$250K' },
  { name: 'Trucking & Logistics', range: '$25K–$1M' },
  { name: 'Auto & Repair', range: '$10K–$300K' },
  { name: 'Retail', range: '$10K–$400K' },
  { name: 'Healthcare', range: '$15K–$500K' },
  { name: 'Wholesale', range: '$20K–$750K' },
  { name: 'Professional Services', range: '$10K–$200K' },
  { name: 'Beauty & Salon', range: '$5K–$150K' },
  { name: 'Manufacturing', range: '$25K–$1M' },
  { name: 'E-Commerce', range: '$10K–$300K' },
  { name: 'Landscaping', range: '$10K–$200K' },
  { name: 'Cleaning Services', range: '$5K–$150K' },
  { name: 'Hospitality & Hotels', range: '$15K–$500K' },
  { name: 'Dental Practices', range: '$15K–$400K' },
  { name: 'Don\'t see yours?', range: 'Ask anyway \u2192', isSpecial: true },
] as const

export default function Industries() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="industries" style={{
      backgroundColor: 'var(--navy)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
    }}>
      {/* Ghost bridge background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/story-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08,
        filter: 'grayscale(100%)',
        pointerEvents: 'none',
      }} />

      <div ref={ref} style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1rem',
            }}
          >
            — INDUSTRIES WE FUND —
          </motion.p>
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Every industry. <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>One application.</span>
          </motion.h2>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.75,
              fontFamily: 'var(--font-ibm, sans-serif)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Fifteen industries across America. One application. If you run a business that moves money, we&apos;ve likely funded someone like you.
          </motion.p>
        </div>

        {/* 16 tiles grid */}
        <div className="industries-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {industries.map((ind, i) => {
            const isSpecial = 'isSpecial' in ind && ind.isSpecial
            return (
              <motion.div
                key={ind.name}
                initial={reduced ? {} : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.03 }}
                style={{
                  backgroundColor: 'var(--navy)',
                  padding: 'clamp(1.25rem, 2vw, 1.75rem)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: isSpecial ? 'pointer' : 'default',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--navy-soft)'
                  const bar = e.currentTarget.querySelector('.hover-bar') as HTMLElement
                  if (bar) bar.style.transform = 'scaleX(1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--navy)'
                  const bar = e.currentTarget.querySelector('.hover-bar') as HTMLElement
                  if (bar) bar.style.transform = 'scaleX(0)'
                }}
              >
                {/* Gold top accent bar - slides L->R on hover */}
                <div
                  className="hover-bar"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--gold)',
                    transformOrigin: 'left',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.35s cubic-bezier(.2,.7,.2,1)',
                  }}
                />

                {/* Mono number */}
                <p style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '0.5rem',
                }}>
                  No. {String(i + 1).padStart(2, '0')}
                </p>

                {/* Serif name */}
                <p style={{
                  fontFamily: 'var(--font-playfair, serif)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: isSpecial ? 'var(--gold)' : '#FFFFFF',
                  lineHeight: 1.3,
                  marginBottom: '0.35rem',
                }}>
                  {isSpecial ? (
                    <Link href="/apply" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                      {ind.name}
                    </Link>
                  ) : ind.name}
                </p>

                {/* Mono range */}
                <p style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  color: isSpecial ? 'var(--gold-light)' : 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.04em',
                }}>
                  {ind.range}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 1024px) {
          .industries-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .industries-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
