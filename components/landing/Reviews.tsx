'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const reviews = [
  {
    stars: 5,
    quote: 'I had been turned down by my bank twice and two other brokers told me I didn\'t qualify. Dave at CapitalMatch got me approved for $35,000 in less than 24 hours. My restaurant would have closed without them. I cannot recommend them enough.',
    name: 'Maria T.',
    title: 'Owner',
    business: 'Sunrise Café',
    location: 'Brooklyn, NY',
    industry: 'Food & Beverage',
  },
  {
    stars: 5,
    quote: 'I was skeptical at first because every other broker wanted upfront fees. CapitalMatch charged me nothing. Within a day I had three offers to choose from and my account had $50,000 two days later. Incredible service.',
    name: 'James R.',
    title: 'Owner',
    business: 'Empire Auto Detailing',
    location: 'Atlanta, GA',
    industry: 'Automotive',
  },
  {
    stars: 5,
    quote: 'Matt walked me through everything. I have a 620 credit score and two open advances and they still got me approved. No other company was willing to even look at my file. CapitalMatch is different.',
    name: 'Sandra L.',
    title: 'Owner',
    business: 'Premier Cleaning Services',
    location: 'Miami, FL',
    industry: 'Commercial Services',
  },
  {
    stars: 5,
    quote: 'We needed capital fast for a big inventory order or we were going to lose the contract. CapitalMatch had money in our account in 18 hours. Saved the deal and probably saved our business this quarter.',
    name: 'Kevin M.',
    title: 'Owner',
    business: 'Metro Supply Co',
    location: 'Chicago, IL',
    industry: 'Wholesale & Distribution',
  },
  {
    stars: 5,
    quote: 'I have used other funding companies before and always felt like I was being taken advantage of. CapitalMatch was completely transparent. No hidden fees, no surprises. Just fast funding and great communication.',
    name: 'Priya S.',
    title: 'Owner',
    business: 'Luxe Nail Studio',
    location: 'Houston, TX',
    industry: 'Beauty & Wellness',
  },
  {
    stars: 5,
    quote: 'As a trucking company owner with seasonal revenue fluctuations I never thought I could get approved. CapitalMatch found me a lender who understood my industry and got me $75,000 to cover payroll and fuel costs during my slow season.',
    name: 'Carlos D.',
    title: 'Owner',
    business: 'Rapid Freight LLC',
    location: 'Dallas, TX',
    industry: 'Transportation',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#C9A84C">
          <path d="M8 1l1.9 4 4.4.6-3.2 3 .8 4.4L8 11l-3.9 2 .8-4.4L1.7 5.6 6.1 5 8 1z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: typeof reviews[0], index: number }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      style={{
        padding: '2rem',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 12px rgba(13,27,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <StarRating count={review.stars} />
      <p style={{
        fontSize: '0.9rem',
        color: '#374151',
        lineHeight: 1.75,
        fontFamily: 'var(--font-ibm, sans-serif)',
        fontStyle: 'italic',
        flex: 1,
      }}>
        &ldquo;{review.quote}&rdquo;
      </p>
      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0D1B2A', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '0.2rem' }}>
          — {review.name}, {review.title}
        </p>
        <p style={{ fontSize: '0.82rem', color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)' }}>
          {review.business} · {review.location}
        </p>
        <div style={{
          display: 'inline-block',
          marginTop: '0.5rem',
          padding: '0.2rem 0.6rem',
          backgroundColor: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '100px',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#C9A84C', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 600 }}>
            {review.industry}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Reviews() {
  const reduced = useReducedMotion()
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true })

  return (
    <section id="reviews" style={{ backgroundColor: '#F8F4ED', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem', fontFamily: 'var(--font-ibm, sans-serif)' }}
          >
            Client Reviews
          </motion.p>
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#0D1B2A', marginBottom: '0.75rem', lineHeight: 1.2 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ fontSize: '1rem', color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)' }}
          >
            Real businesses. Real results.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((r, i) => <ReviewCard key={i} review={r} index={i} />)}
        </div>
      </div>
    </section>
  )
}
