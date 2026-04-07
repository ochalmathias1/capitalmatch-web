'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduced) { setCount(target); return }
    const duration = 1800
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [inView, target, reduced])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function Mission() {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const stats = [
    { value: 50, prefix: '$', suffix: 'M+', label: 'Funded' },
    { value: 500, suffix: '+', label: 'Businesses Helped' },
    { value: 24, suffix: 'hr', label: 'Average Funding Time' },
  ]

  return (
    <section style={{ backgroundColor: '#F8F4ED', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div ref={sectionRef} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
            Our Mission
          </p>
          <h2 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#0D1B2A',
            marginBottom: '2rem',
            lineHeight: 1.2,
          }}>
            We built CapitalMatch to fix a broken industry.
          </h2>
          <div style={{ maxWidth: '680px', margin: '0 auto 4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              'The MCA industry is broken. Business owners get passed between brokers, each taking their cut, leaving you with less capital and more confusion.',
              'One application. Direct lender access. Zero broker markup. We work for you — not the other way around.',
              'When banks say no and time is running out, CapitalMatch gets you funded.',
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.1rem)',
                  color: i === 1 ? '#0D1B2A' : '#4B5563',
                  lineHeight: 1.8,
                  fontFamily: 'var(--font-ibm, sans-serif)',
                  fontWeight: i === 1 ? 600 : 400,
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Stat counters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E5E7EB',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-playfair, serif)',
                  fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                  fontWeight: 800,
                  color: '#C9A84C',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 500 }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
