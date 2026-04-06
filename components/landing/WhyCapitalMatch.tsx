'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l2.5 6.5H23l-5.5 4 2 6.5L14 17l-5.5 4 2-6.5L5 10.5h6.5L14 4z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Zero Broker Fees',
    desc: 'You never pay us a cent. We earn our commission directly from lenders when you get funded.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#C9A84C" strokeWidth="1.6"/>
        <path d="M9 14l3.5 3.5L19 10" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Direct Lender Access',
    desc: 'One application reaches community of private lenders simultaneously. No gatekeepers. No markup.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 8h20M4 14h20M4 20h14" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'All Industries Welcome',
    desc: 'Restaurants, contractors, retail, trucking, medical — we work with every type of business.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10S19.523 4 14 4z" stroke="#C9A84C" strokeWidth="1.6"/>
        <path d="M14 9v5l3 3" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Bad Credit Options',
    desc: 'Credit score under 600? We have lenders who specialize in giving businesses a second chance.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Our automated system matches your application to lenders in minutes — not days.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4c-1.5 3.5-6 5-6 9a6 6 0 0012 0c0-4-4.5-5.5-6-9z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M10 20c0 2 2 4 4 4s4-2 4-4" stroke="#C9A84C" strokeWidth="1.6"/>
      </svg>
    ),
    title: 'We Work for You',
    desc: 'Unlike traditional brokers, our incentive is getting you the best offer — not the most profitable one for us.',
  },
]

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0], index: number }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={reduced ? {} : { y: -4, boxShadow: '0 8px 40px rgba(201,168,76,0.2)', borderColor: 'rgba(201,168,76,0.5)' }}
      style={{
        padding: '2rem',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'default',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '10px',
        backgroundColor: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        {benefit.icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.625rem' }}>
        {benefit.title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontFamily: 'var(--font-ibm, sans-serif)' }}>
        {benefit.desc}
      </p>
    </motion.div>
  )
}

export default function WhyCapitalMatch() {
  const reduced = useReducedMotion()
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })

  return (
    <section style={{ backgroundColor: '#0D1B2A', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}
          >
            Why Business Owners Choose Us
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {benefits.map((b, i) => <BenefitCard key={b.title} benefit={b} index={i} />)}
        </div>
      </div>
    </section>
  )
}
