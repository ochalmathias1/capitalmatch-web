'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import ProgressBar from './ProgressBar'
import Step1Business from './Step1Business'
import Step2Owner from './Step2Owner'
import Step3SecondOwner from './Step3SecondOwner'
import Step4Documents from './Step4Documents'
import { EMPTY_APPLICATION, type ApplicationData } from '@/lib/types'

const STORAGE_KEY = 'capitalmatch_application'
const TOTAL_STEPS = 4

function validateStep(step: number, data: ApplicationData): Partial<Record<keyof ApplicationData, string>> {
  const errs: Partial<Record<keyof ApplicationData, string>> = {}

  if (step === 1) {
    if (!data.businessName.trim()) errs.businessName = 'Business name is required'
    if (!data.businessAddress.trim()) errs.businessAddress = 'Address is required'
    if (!data.businessCity.trim()) errs.businessCity = 'City is required'
    if (!data.businessState.trim()) errs.businessState = 'State is required'
    if (!data.businessZip.trim()) errs.businessZip = 'ZIP is required'
    if (!data.businessPhone.trim()) errs.businessPhone = 'Phone is required'
    if (!data.ein.trim()) errs.ein = 'EIN is required'
    if (!data.dateStarted) errs.dateStarted = 'Date started is required'
    if (!data.entityType) errs.entityType = 'Entity type is required'
    if (!data.businessEmail.trim()) errs.businessEmail = 'Email is required'
    if (!data.businessDescription.trim()) errs.businessDescription = 'Business description is required'
    if (!data.monthlyRevenue) errs.monthlyRevenue = 'Monthly revenue is required'
    if (!data.requestedAmount) errs.requestedAmount = 'Requested amount is required'
    if (!data.useOfFunds) errs.useOfFunds = 'Use of funds is required'
  }

  if (step === 2) {
    if (!data.ownerName.trim()) errs.ownerName = 'Owner name is required'
    if (!data.ownerCellPhone.trim()) errs.ownerCellPhone = 'Cell phone is required'
    if (!data.ownerTitle) errs.ownerTitle = 'Title is required'
    if (!data.ownershipPct) errs.ownershipPct = 'Ownership % is required'
    if (!data.homeAddress.trim()) errs.homeAddress = 'Home address is required'
    if (!data.homeCity.trim()) errs.homeCity = 'City is required'
    if (!data.homeState.trim()) errs.homeState = 'State is required'
    if (!data.homeZip.trim()) errs.homeZip = 'ZIP is required'
    if (!data.ssnFull || data.ssnFull.replace(/\D/g, '').length < 9) errs.ssnFull = 'Full SSN required (XXX-XX-XXXX)'
    if (!data.dob) errs.dob = 'Date of birth is required'
    if (!data.ficoRange) errs.ficoRange = 'Credit score range is required'
  }

  if (step === 3) {
    if (!data.secondOwnerName.trim()) errs.secondOwnerName = 'Name is required'
    if (!data.secondOwnerTitle) errs.secondOwnerTitle = 'Title is required'
    if (!data.secondOwnerPct) errs.secondOwnerPct = 'Ownership % is required'
    if (!data.secondOwnerAddress.trim()) errs.secondOwnerAddress = 'Address is required'
    if (!data.secondOwnerCity.trim()) errs.secondOwnerCity = 'City is required'
    if (!data.secondOwnerState.trim()) errs.secondOwnerState = 'State is required'
    if (!data.secondOwnerZip.trim()) errs.secondOwnerZip = 'ZIP is required'
    if (!data.secondOwnerSsnFull || data.secondOwnerSsnFull.replace(/\D/g, '').length < 9) errs.secondOwnerSsnFull = 'Full SSN required (XXX-XX-XXXX)'
    if (!data.secondOwnerDob) errs.secondOwnerDob = 'Date of birth is required'
    if (!data.secondOwnerFico) errs.secondOwnerFico = 'Credit score range is required'
  }

  if (step === 4) {
    if (!data.openPositions) errs.openPositions = 'Please select your current positions'
    if ((data.bankStatementUrls || []).length < 1) errs.bankStatementUrls = 'Please upload at least one bank statement'
    if (!data.signatureName.trim()) errs.signatureName = 'Signature is required'
    if (!data.authCheck1) errs.authCheck1 = 'Authorization required'
    if (!data.authCheck2) errs.authCheck2 = 'Agreement required'
  }

  return errs
}

// Fields that must never be persisted to localStorage (PII)
const SENSITIVE_FIELDS: ReadonlyArray<keyof ApplicationData> = ['ssnFull', 'dob', 'secondOwnerSsnFull', 'secondOwnerDob']

export default function ApplicationForm({ brokerCode }: { brokerCode?: string } = {}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<ApplicationData>(EMPTY_APPLICATION)
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [uploadToken, setUploadToken] = useState('')

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setData(JSON.parse(saved))
    } catch {}
  }, [])

  // Fetch a short-lived upload token on mount + refresh before expiry
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const fetchToken = () => {
      fetch('/api/upload-token')
        .then(r => r.json())
        .then(j => {
          if (j.token) setUploadToken(j.token)
          // Refresh 5 minutes before the 1-hour expiry
          timer = setTimeout(fetchToken, 55 * 60 * 1000)
        })
        .catch(() => {
          // Retry in 5 seconds on failure
          timer = setTimeout(fetchToken, 5000)
        })
    }

    fetchToken()
    return () => clearTimeout(timer)
  }, [])

  // Save to localStorage on change
  const handleChange = useCallback((field: keyof ApplicationData, value: string | string[] | boolean) => {
    setData((prev) => {
      const next = { ...prev, [field]: value }
      // Set hasSecondOwner based on ownershipPct
      if (field === 'ownershipPct') {
        next.hasSecondOwner = parseInt(value as string || '0') < 100
      }
      try {
        const sanitized = { ...next }
        SENSITIVE_FIELDS.forEach(f => delete (sanitized as Record<string, unknown>)[f])
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
      } catch {}
      return next
    })
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }, [])

  const totalSteps = data.hasSecondOwner ? 4 : 3
  // When no second owner, step 4 becomes step 3 (docs)
  const effectiveStep = (!data.hasSecondOwner && step === 4) ? 3 : step
  const displayStep = step === 4 ? totalSteps : Math.min(step, totalSteps)

  const goNext = () => {
    const errs = validateStep(step, data)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setDirection(1)
    // Skip step 3 if single owner
    if (step === 2 && !data.hasSecondOwner) {
      setStep(4)
    } else {
      setStep((s) => s + 1)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setErrors({})
    setDirection(-1)
    if (step === 4 && !data.hasSecondOwner) {
      setStep(2)
    } else {
      setStep((s) => s - 1)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const errs = validateStep(4, data)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brokerCode ? { ...data, brokerCode } : data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/confirmation?ref=${encodeURIComponent(json.reference)}`)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const isLastStep = step === 4 || (step === 3 && !data.hasSecondOwner)

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  const stepTitles: Record<number, string> = {
    1: 'Business Information',
    2: 'Owner Information',
    3: data.hasSecondOwner ? 'Second Owner' : 'Documents & Authorization',
    4: 'Documents & Authorization',
  }

  const canSubmit =
    (data.bankStatementUrls || []).length >= 1 &&
    data.signatureName.trim() &&
    data.authCheck1 &&
    data.authCheck2 &&
    !submitting

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <ProgressBar currentStep={displayStep} totalSteps={totalSteps} />

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#0D1B2A',
          marginBottom: '0.25rem',
        }}>
          {stepTitles[step]}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontFamily: 'var(--font-ibm, sans-serif)' }}>
          Step {displayStep} of {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {step === 1 && <Step1Business data={data} onChange={handleChange} errors={errors} />}
          {step === 2 && <Step2Owner data={data} onChange={handleChange} errors={errors} />}
          {step === 3 && data.hasSecondOwner && <Step3SecondOwner data={data} onChange={handleChange} errors={errors} />}
          {(step === 4 || (step === 3 && !data.hasSecondOwner)) && (
            <Step4Documents data={data} onChange={handleChange} errors={errors} uploadToken={uploadToken} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #E5E7EB',
      }}>
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          style={{
            background: 'none',
            border: '1.5px solid #D1D5DB',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: step === 1 ? 'not-allowed' : 'pointer',
            opacity: step === 1 ? 0.4 : 1,
            fontSize: '0.9rem',
            color: '#374151',
            fontFamily: 'var(--font-ibm, sans-serif)',
            transition: 'all 0.2s',
          }}
        >
          ← Back
        </button>

        {isLastStep ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            {submitError && (
              <p style={{ fontSize: '0.8rem', color: '#991B1B', fontFamily: 'var(--font-ibm, sans-serif)' }}>{submitError}</p>
            )}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="btn-primary"
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: '2px solid rgba(13,27,42,0.3)', borderTopColor: '#0D1B2A',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Submitting...
                </span>
              ) : 'Submit My Application →'}
            </motion.button>
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={goNext}
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue →
          </motion.button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
