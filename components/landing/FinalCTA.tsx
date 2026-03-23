'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function FinalCTA() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{
      backgroundColor: '#0D1B2A',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Background glow */}
      <motion.div
        animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Ready to See What You{' '}
          <span style={{ color: '#C9A84C' }}>Qualify For?</span>
        </motion.h2>

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-ibm, sans-serif)',
          }}
        >
          It takes 5 minutes. There is no hard credit check.
          And it costs you absolutely nothing.
        </motion.p>

        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: 'inline-block', marginBottom: '1.5rem' }}
        >
          <motion.div
            animate={reduced ? {} : { boxShadow: ['0 0 25px rgba(201,168,76,0.35)', '0 0 50px rgba(201,168,76,0.6)', '0 0 25px rgba(201,168,76,0.35)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ borderRadius: '8px' }}
          >
            <Link href="/apply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1.125rem 2.5rem',
              backgroundColor: '#C9A84C', color: '#0D1B2A',
              borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem',
              fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
            }}>
              Apply Now — It&apos;s Free
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-ibm, sans-serif)' }}
        >
          Join 500+ businesses we have helped fund
        </motion.p>
      </div>
    </section>
  )
}
