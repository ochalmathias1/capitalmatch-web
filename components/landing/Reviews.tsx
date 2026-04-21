'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const reviews = [
  {
    quote: 'I had been turned down by my bank twice and two other brokers told me I didn\'t qualify. Dave at CapitalMatch got me approved for $35,000 in less than 24 hours. My restaurant would have closed without them. I cannot recommend them enough.',
    name: 'Maria T.',
    title: 'Owner',
    business: 'Sunrise Caf\u00e9',
    location: 'Brooklyn, NY',
  },
  {
    quote: 'I was skeptical at first because every other broker wanted upfront fees. CapitalMatch charged me nothing. Within a day I had three offers to choose from and my account had $50,000 two days later. Incredible service.',
    name: 'James R.',
    title: 'Owner',
    business: 'Empire Auto Detailing',
    location: 'Atlanta, GA',
  },
  {
    quote: 'Matt walked me through everything. I have a 620 credit score and two open advances and they still got me approved. No other company was willing to even look at my file. CapitalMatch is different.',
    name: 'Sandra L.',
    title: 'Owner',
    business: 'Premier Cleaning Services',
    location: 'Miami, FL',
  },
  {
    quote: 'We needed capital fast for a big inventory order or we were going to lose the contract. CapitalMatch had money in our account in 18 hours. Saved the deal and probably saved our business this quarter.',
    name: 'Kevin M.',
    title: 'Owner',
    business: 'Metro Supply Co',
    location: 'Chicago, IL',
  },
]

export default function Reviews() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const featured = reviews[0]
  const secondary = reviews.slice(1)

  return (
    <section id="reviews" style={{
      backgroundColor: '#FFFFFF',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
    }}>
      <div ref={ref} style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              color: 'var(--gold-dark)',
              marginBottom: '1rem',
            }}
          >
            — CLIENT COMMENTS —
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
            What they&apos;re <span style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>saying.</span>
          </motion.h2>
        </div>

        {/* Featured quote */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            position: 'relative',
            marginBottom: '2rem',
            overflow: 'hidden',
          }}
        >
          {/* Gold corner brackets: top-left */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            width: '40px',
            height: '40px',
            borderTop: '2px solid var(--gold)',
            borderLeft: '2px solid var(--gold)',
            borderTopLeftRadius: '12px',
            pointerEvents: 'none',
          }} />
          {/* Gold corner brackets: bottom-right */}
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            right: '-1px',
            width: '40px',
            height: '40px',
            borderBottom: '2px solid var(--gold)',
            borderRight: '2px solid var(--gold)',
            borderBottomRightRadius: '12px',
            pointerEvents: 'none',
          }} />

          {/* Large opening quotation mark */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1.5rem',
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '140px',
            fontStyle: 'italic',
            lineHeight: 1,
            color: 'var(--gold)',
            opacity: 0.25,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            &ldquo;
          </div>

          {/* Quote text */}
          <p style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(1.25rem, 3vw, 2.375rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'var(--ink)',
            lineHeight: 1.5,
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 1,
            maxWidth: '900px',
          }}>
            &ldquo;{featured.quote}&rdquo;
          </p>

          {/* Attribution */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-ibm, sans-serif)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--ink)',
              marginBottom: '0.2rem',
            }}>
              — {featured.name}, {featured.title}
            </p>
            <p style={{
              fontFamily: 'var(--font-ibm, sans-serif)',
              fontSize: '0.88rem',
              color: 'var(--muted)',
            }}>
              {featured.business} &middot; {featured.location}
            </p>
          </div>
        </motion.div>

        {/* 3-up secondary grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}>
          {secondary.map((review, i) => (
            <motion.div
              key={review.name}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Mono marker */}
              <p style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
                marginBottom: '1rem',
              }}>
                No. {String(i + 1).padStart(2, '0')}
              </p>

              {/* Quote */}
              <p style={{
                fontFamily: 'var(--font-ibm, sans-serif)',
                fontSize: '0.9rem',
                color: 'var(--ink)',
                lineHeight: 1.75,
                fontStyle: 'italic',
                marginBottom: '1.25rem',
              }}>
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
                <p style={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-ibm, sans-serif)',
                  marginBottom: '0.15rem',
                }}>
                  — {review.name}
                </p>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-ibm, sans-serif)',
                }}>
                  {review.business} &middot; {review.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: single column for grid */}
      <style>{`
        @media (max-width: 768px) {
          #reviews div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
