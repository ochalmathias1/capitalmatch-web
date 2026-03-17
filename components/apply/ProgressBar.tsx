'use client'
import { motion } from 'framer-motion'

interface Props {
  currentStep: number
  totalSteps: number
}

const stepLabels = ['Business Info', 'Owner Info', 'Second Owner', 'Documents']

export default function ProgressBar({ currentStep, totalSteps }: Props) {
  const pct = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Step labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        {stepLabels.map((label, i) => {
          const step = i + 1
          const active = step === currentStep
          const done = step < currentStep
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.35rem',
                transition: 'all 0.3s',
                backgroundColor: done ? '#C9A84C' : active ? '#0D1B2A' : '#E5E7EB',
                color: done || active ? '#FFFFFF' : '#9CA3AF',
                fontFamily: 'var(--font-ibm, sans-serif)',
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : step}
              </div>
              <span style={{
                fontSize: '0.7rem',
                color: active ? '#0D1B2A' : done ? '#C9A84C' : '#9CA3AF',
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-ibm, sans-serif)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Bar */}
      <div style={{
        height: '4px',
        backgroundColor: '#E5E7EB',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: '#C9A84C',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  )
}
