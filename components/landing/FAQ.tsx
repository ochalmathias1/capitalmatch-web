'use client'
import { useState, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'What is a Merchant Cash Advance?',
    a: 'A Merchant Cash Advance (MCA) is a type of business financing where a lender provides you with a lump sum of capital in exchange for a fixed amount repaid over time through daily or weekly payments. Unlike a traditional loan, MCA approval is based primarily on your business revenue \u2014 not just your credit score.',
  },
  {
    q: 'How is CapitalMatch different from other brokers?',
    a: 'Most brokers take a commission from you or mark up the lender\u2019s rate. We do neither. CapitalMatch earns a standard ISO commission directly from the lender when your deal funds \u2014 you never pay us anything.',
  },
  {
    q: 'How fast can I get funded?',
    a: 'Most of our clients receive funding within 24 hours of accepting an offer. In some cases same day funding is possible.',
  },
  {
    q: 'What are the requirements to qualify?',
    a: 'You need to be in business for at least 3 to 6 months with consistent monthly revenue. Credit scores as low as 500 accepted.',
  },
  {
    q: 'Does applying affect my credit score?',
    a: 'No. Our initial application does not require a hard credit pull. A hard pull only happens if you accept a specific offer.',
  },
  {
    q: 'How much can I qualify for?',
    a: 'Funding amounts depend on your monthly revenue. Most lenders advance between 50% and 150% of your average monthly revenue.',
  },
  {
    q: 'What is a factor rate?',
    a: 'A factor rate is a fixed multiplier applied to the funded amount. For example a $20,000 advance at a 1.40 factor rate means you repay $28,000 total.',
  },
  {
    q: 'What documents do I need?',
    a: 'To apply you just need to fill out our online application. When you accept an offer we ask for a voided business check, driver\u2019s license, and proof of EIN.',
  },
]

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div style={{
      borderBottom: '1px solid var(--line)',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1.5rem',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: '23px',
          fontWeight: 600,
          color: 'var(--ink)',
          lineHeight: 1.35,
        }}>
          {faq.q}
        </span>
        <div style={{
          width: '32px',
          height: '32px',
          minWidth: '32px',
          borderRadius: '50%',
          border: `1.5px solid ${isOpen ? 'var(--gold)' : 'var(--line)'}`,
          backgroundColor: isOpen ? 'var(--gold)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path d="M7 1v12M1 7h12" stroke={isOpen ? 'var(--navy)' : 'var(--muted)'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: '1rem',
              color: 'var(--muted)',
              lineHeight: 1.8,
              fontFamily: 'var(--font-ibm, sans-serif)',
              paddingBottom: '1.5rem',
              maxWidth: '720px',
            }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" style={{
      backgroundColor: 'var(--cream)',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
    }}>
      <div ref={ref} style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
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
            — FREQUENTLY ASKED —
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
            Common <span style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>questions.</span>
          </motion.h2>
        </div>

        {/* Accordion */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ borderTop: '1px solid var(--line)' }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
