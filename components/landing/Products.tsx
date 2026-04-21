'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

const products = [
  {
    num: '01',
    name: 'WORKING CAPITAL',
    range: '$5K – $500K',
    description: 'General purpose funding for payroll, inventory, equipment, or expansion.',
  },
  {
    num: '02',
    name: 'REVENUE ADVANCE',
    range: '$10K – $2M',
    description: 'Leverage your monthly revenue into immediate capital with flexible daily or weekly payments.',
  },
  {
    num: '03',
    name: 'BRIDGE FINANCING',
    range: '$25K – $5M',
    description: 'Short-term capital to bridge gaps between receivables, contracts, or seasonal fluctuations.',
  },
]

export default function Products() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      backgroundColor: 'var(--cream)',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
    }}>
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
            — FUNDING PRODUCTS —
          </motion.p>
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}
          >
            Capital for <span style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>every</span> stage.
          </motion.h2>
        </div>

        {/* 3 cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {products.map((product, i) => (
            <motion.div
              key={product.num}
              initial={reduced ? {} : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                padding: 'clamp(2rem, 3vw, 2.5rem)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'all 0.35s cubic-bezier(.2,.7,.2,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                const accent = e.currentTarget.querySelector('.gold-accent') as HTMLElement
                if (accent) accent.style.transform = 'scaleX(1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                const accent = e.currentTarget.querySelector('.gold-accent') as HTMLElement
                if (accent) accent.style.transform = 'scaleX(0)'
              }}
            >
              {/* Gold gradient top accent */}
              <div
                className="gold-accent"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.4s cubic-bezier(.2,.7,.2,1)',
                }}
              />

              {/* Mono numbered mark */}
              <p style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                marginBottom: '1.5rem',
              }}>
                {product.num} &middot; {product.name}
              </p>

              {/* Serif name */}
              <h3 style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}>
                {product.name.split(' ').map((w, wi) => (
                  <span key={wi}>
                    {wi > 0 ? ' ' : ''}{w.charAt(0)}{w.slice(1).toLowerCase()}
                  </span>
                ))}
              </h3>

              {/* Italic serif range */}
              <p style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: 'var(--gold-dark)',
                marginBottom: '1.25rem',
              }}>
                {product.range}
              </p>

              {/* Description */}
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--muted)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-ibm, sans-serif)',
                marginBottom: '1.5rem',
              }}>
                {product.description}
              </p>

              {/* Gold-underlined link */}
              <Link href="/apply" style={{
                fontFamily: 'var(--font-ibm, sans-serif)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--gold-dark)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--gold)',
                paddingBottom: '2px',
                transition: 'color 0.2s',
              }}>
                Check terms &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: single column */}
      <style>{`
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
