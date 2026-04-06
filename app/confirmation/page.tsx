'use client'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

function ConfirmationContent() {
  const params = useSearchParams()
  const ref = params.get('ref') || ''

  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', backgroundColor: '#F8F4ED' }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#1A6B4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <motion.path
              d="M8 18l7 7 13-13"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#0D1B2A',
            marginBottom: '1rem',
          }}>
            Application Received
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#4B5563',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-ibm, sans-serif)',
          }}>
            Our team is reviewing your application and you will hear from us within 24 hours.
          </p>

          {ref && (
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              marginBottom: '2rem',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Your Reference Number
              </p>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#C9A84C',
                fontWeight: 600,
                wordBreak: 'break-all',
              }}>
                {ref}
              </p>
            </div>
          )}

          <div style={{
            textAlign: 'left',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-playfair, serif)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#0D1B2A',
              marginBottom: '1rem',
            }}>
              What Happens Next
            </h3>
            {[
              'Our team reviews your application and documents',
              'We match your profile to our lender network',
              'Lenders review and return funding offers',
              'We present your offers — you choose what works best',
              'Accepted offer funds to your account within 24 hours',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: '#F8F4ED',
                  border: '1.5px solid #C9A84C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#C9A84C', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                    {i + 1}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5, fontFamily: 'var(--font-ibm, sans-serif)' }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)', marginBottom: '2rem' }}>
            Questions? Email us at{' '}
            <a href="mailto:lenders@capitalmatchfunding.com" style={{ color: '#C9A84C' }}>
              lenders@capitalmatchfunding.com
            </a>
          </p>

          <Link href="/" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div style={{ paddingTop: '72px', textAlign: 'center', padding: '5rem' }}>Loading...</div>}>
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </>
  )
}
