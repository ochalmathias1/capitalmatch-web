'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

export default function OurStory() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="our-story"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--navy)',
        padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      }}
    >
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/story-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.38,
      }} />
      {/* Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(10,23,37,0.9) 0%, rgba(10,23,37,0.75) 50%, rgba(10,23,37,0.92) 100%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(10,23,37,0.6) 0%, transparent 70%)',
      }} />

      <div ref={ref} style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(3rem, 6vw, 5rem)',
        alignItems: 'center',
      }}>
        {/* Left: photo card */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            aspectRatio: '4 / 5',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 0 0 18px rgba(201,168,76,0.35)',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/story-bridge.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Gold inset border overlay */}
          <div style={{
            position: 'absolute',
            inset: '18px',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }} />

          {/* EST. NEW YORK badge top-right */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            backgroundColor: 'rgba(10,23,37,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 500,
            }}>
              EST. NEW YORK
            </span>
          </div>

          {/* Mono coordinate bottom-left */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '1.5rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.06em',
            }}>
              Brooklyn &middot; N.Y.
            </span>
          </div>
        </motion.div>

        {/* Right: copy */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-light)',
            marginBottom: '1.25rem',
          }}>
            — OUR STORY —
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '2rem',
          }}>
            Bridging capital to<br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>American</span> business.
          </h2>

          {/* Lead paragraph with gold left border */}
          <div style={{
            borderLeft: '2px solid var(--gold)',
            paddingLeft: '1.25rem',
            marginBottom: '2rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: '25px',
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.5,
            }}>
              A bridge is an honest thing. It shortens the distance between two places.
            </p>
          </div>

          {/* Body text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.8,
              fontFamily: 'var(--font-ibm, sans-serif)',
              fontWeight: 400,
            }}>
              Founded in New York, Capital Match Funding was built on a simple idea: business owners shouldn&apos;t have to chase capital one lender at a time. We connect your application to a network of funding partners in parallel — so the right match finds you, faster.
            </p>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.8,
              fontFamily: 'var(--font-ibm, sans-serif)',
              fontWeight: 400,
            }}>
              No runaround. No endless phone tag. Just a straight line from the business to the capital it needs.
            </p>
          </div>

          {/* Mono signature */}
          <p style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'var(--gold)',
            fontWeight: 500,
          }}>
            — E. NOVAK &amp; W. LEVINE, FOUNDERS
          </p>
        </motion.div>
      </div>

      {/* Mobile: stack */}
      <style>{`
        @media (max-width: 768px) {
          #our-story > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
