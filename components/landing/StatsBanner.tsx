'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function StatsBanner() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const items = [
    { icon: '🏦', text: 'Trusted by businesses across every industry' },
    { icon: '⚡', text: 'Applications processed in minutes' },
    { icon: '🔒', text: 'Bank-level security on all data' },
    { icon: '📞', text: 'Live support from real humans' },
  ]

  return (
    <section ref={ref} style={{ backgroundColor: '#0D1B2A', padding: '3rem 1.5rem', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem 2rem', alignItems: 'center' }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
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
    </section>
  )
}
