'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const faqs = [
  {
    q: 'What is a Merchant Cash Advance?',
    a: 'A Merchant Cash Advance (MCA) is a type of business financing where a lender provides you with a lump sum of capital in exchange for a fixed amount repaid over time through daily or weekly payments. Unlike a traditional loan, MCA approval is based primarily on your business revenue — not just your credit score. This makes it one of the fastest and most accessible forms of funding for small business owners.',
  },
  {
    q: 'How is CapitalMatch different from other brokers?',
    a: 'Most brokers take a commission from you or mark up the lender\'s rate before presenting it to you. We do neither. CapitalMatch earns a standard ISO commission directly from the lender when your deal funds — you never pay us anything. We also submit your application to multiple lenders simultaneously so you get real competing offers instead of whatever one broker feels like showing you.',
  },
  {
    q: 'How fast can I get funded?',
    a: 'Most of our clients receive funding within 24 hours of accepting an offer. In some cases same day funding is possible depending on the lender and how quickly you can provide final documents.',
  },
  {
    q: 'What are the requirements to qualify?',
    a: 'Requirements vary by lender but generally you will need to be in business for at least 3 to 6 months and have consistent monthly revenue. Credit score requirements also vary — we have lenders who work with scores as low as 500. You will need to provide recent bank statements so lenders can verify your revenue.',
  },
  {
    q: 'Does applying affect my credit score?',
    a: 'No. Our initial application process does not require a hard credit pull. Lenders may run a soft inquiry to pre-qualify you which does not affect your score. A hard pull only happens if you choose to accept a specific offer and move forward with a lender.',
  },
  {
    q: 'How much can I qualify for?',
    a: 'Funding amounts depend on your monthly revenue. Most lenders will advance between 50% and 150% of your average monthly revenue. If your business generates $30,000 per month you could potentially qualify for $15,000 to $45,000 depending on your profile and how many open positions you currently have.',
  },
  {
    q: 'What is a factor rate?',
    a: 'A factor rate is how MCA lenders express the cost of capital. It is a fixed multiplier applied to the funded amount. For example a $20,000 advance at a 1.40 factor rate means you repay $28,000 total regardless of how quickly you pay it back. Unlike interest rates factor rates do not compound over time.',
  },
  {
    q: 'What documents do I need to apply?',
    a: 'To apply you just need to fill out our online application. When you accept an offer we will ask you for three final documents: a voided business check, a copy of your driver\'s license, and proof of your EIN such as a filed business tax return.',
  },
  {
    q: 'Can I qualify with bad credit?',
    a: 'Yes. Many of our lending partners specialize in working with business owners who have credit challenges. While a higher credit score gives you access to better rates and terms, we have helped business owners with scores as low as 500 get funded. Your revenue history and time in business often matter more than your credit score.',
  },
  {
    q: 'Can I apply if I already have an open MCA?',
    a: 'Yes. Many business owners have existing advances. Lenders refer to this as stacking. Having one or two open positions does not automatically disqualify you, though it may affect the amount and terms of your offer. We are transparent with our lenders about your current position so there are no surprises.',
  },
  {
    q: 'How do I repay the advance?',
    a: 'Repayment is automatic. Most advances are repaid through fixed daily or weekly ACH debits from your business bank account. The amount is fixed so you always know exactly what will come out and when. There are no variable payments tied to your sales volume.',
  },
  {
    q: 'Is there any obligation after I apply?',
    a: 'None at all. Applying is completely free and there is no obligation to accept any offer. You can review all your offers and choose the one that works best for your business — or decline them all. We never charge application fees or commitment fees.',
  },
]

function FAQItem({ faq, isOpen, onToggle, index }: {
  faq: typeof faqs[0]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const reduced = useReducedMotion()

  return (
    <div style={{
      borderBottom: '1px solid #E5E7EB',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.5rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontFamily: 'var(--font-ibm, sans-serif)',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          fontWeight: 600,
          color: isOpen ? '#C9A84C' : '#0D1B2A',
          lineHeight: 1.4,
          transition: 'color 0.2s',
        }}>
          {faq.q}
        </span>
        <motion.div
          animate={reduced ? {} : { rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke={isOpen ? '#C9A84C' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={reduced ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              paddingBottom: '1.5rem',
              fontSize: '0.95rem',
              color: '#4B5563',
              lineHeight: 1.8,
              fontFamily: 'var(--font-ibm, sans-serif)',
              maxWidth: '680px',
            }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      {faqs.map((faq, i) => (
        <FAQItem
          key={i}
          faq={faq}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}
