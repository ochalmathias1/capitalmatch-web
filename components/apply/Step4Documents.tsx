'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { type ApplicationData } from '@/lib/types'

interface Props {
  data: ApplicationData
  onChange: (field: keyof ApplicationData, value: string | string[] | boolean) => void
  errors: Partial<Record<keyof ApplicationData, string>>
}

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="label">
        {label}{required && <span style={{ color: '#991B1B', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>{error}</p>}
    </div>
  )
}

const AUTH_TEXT = `By signing below, I authorize CapitalMatch, its assigns, agents, banks, and financial institutions to obtain an investigative or consumer credit report from any credit bureau or credit reporting agency, and to investigate the references given or any other statements or data obtained from the applicant or any other person pertaining to the applicant. I also authorize CapitalMatch to act as my exclusive commercial finance broker for a period of 90 days from the date signed.`

export default function Step4Documents({ data, onChange, errors }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    setUploadError('')
    const newUrls = [...(data.bankStatementUrls || [])]
    const newNames = [...(data.bankStatementNames || [])]

    for (const file of files) {
      if (newNames.includes(file.name)) continue
      const path = `statements/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error } = await supabase.storage.from('bank-statements').upload(path, file)
      if (error) {
        setUploadError(`Failed to upload ${file.name}. Please try again.`)
        continue
      }
      const { data: signedData } = await supabase.storage.from('bank-statements').createSignedUrl(path, 3600)
      if (signedData?.signedUrl) {
        newUrls.push(signedData.signedUrl)
        newNames.push(file.name)
      }
    }

    onChange('bankStatementUrls', newUrls)
    onChange('bankStatementNames', newNames)
    setUploading(false)
  }

  const removeFile = (index: number) => {
    const urls = [...(data.bankStatementUrls || [])]
    const names = [...(data.bankStatementNames || [])]
    urls.splice(index, 1)
    names.splice(index, 1)
    onChange('bankStatementUrls', urls)
    onChange('bankStatementNames', names)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) uploadFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  const fileCount = (data.bankStatementNames || []).length
  const needsMore = fileCount < 4

  const openPositions = ['No existing advances — 1st position', '1 open advance — 2nd position', '2 open advances — 3rd position', '3 or more open advances']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Position */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Open Positions" required error={errors.openPositions}>
          <select
            className={`input-field${errors.openPositions ? ' error' : ''}`}
            value={data.openPositions}
            onChange={(e) => onChange('openPositions', e.target.value)}
          >
            <option value="">Select current positions</option>
            {openPositions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Current MCA Balance" error={errors.mcaBalance}>
          <input
            className="input-field"
            type="text"
            placeholder="Enter 0 if none"
            value={data.mcaBalance}
            onChange={(e) => onChange('mcaBalance', e.target.value)}
          />
        </Field>
      </div>

      {/* Bank Statement Upload */}
      <div>
        <label className="label">
          Bank Statements<span style={{ color: '#991B1B', marginLeft: '2px' }}>*</span>
        </label>

        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: dragOver ? '#C9A84C' : needsMore && fileCount > 0 ? '#E5A84C' : '#D1D5DB',
            backgroundColor: dragOver ? '#FFFBF0' : '#FAFAFA',
          }}
          style={{
            border: '2px dashed',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '3px solid #E5E7EB', borderTopColor: '#C9A84C',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: '#6B7280', fontSize: '0.9rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>Uploading...</p>
            </div>
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 1rem' }}>
                <rect x="4" y="8" width="32" height="24" rx="3" stroke={dragOver ? '#C9A84C' : '#9CA3AF'} strokeWidth="1.5"/>
                <path d="M20 28V16M14 22l6-6 6 6" stroke={dragOver ? '#C9A84C' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.4rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Upload your last 4 months of bank statements
              </p>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                If today is past the 20th, also include your current month to date statement
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Accepted: PDF, JPG, PNG · Multiple files allowed · Click or drag files here
              </p>
            </>
          )}
        </motion.div>

        {/* File list */}
        <AnimatePresence>
          {(data.bankStatementNames || []).map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 1rem',
                marginTop: '0.5rem',
                backgroundColor: '#F0FAF5',
                borderRadius: '6px',
                border: '1px solid #BBF7D0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2h7l3 3v9H3V2z" stroke="#1A6B4A" strokeWidth="1.2"/>
                  <path d="M10 2v3h3" stroke="#1A6B4A" strokeWidth="1.2"/>
                </svg>
                <span style={{ fontSize: '0.82rem', color: '#1A6B4A', fontFamily: 'var(--font-ibm, sans-serif)' }}>{name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {uploadError && <p style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '0.5rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>{uploadError}</p>}
        {errors.bankStatementUrls && <p style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '0.5rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>{errors.bankStatementUrls}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <div style={{
            height: '4px',
            flex: 1,
            backgroundColor: '#E5E7EB',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${Math.min((fileCount / 4) * 100, 100)}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', backgroundColor: fileCount >= 4 ? '#1A6B4A' : '#C9A84C', borderRadius: '2px' }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: fileCount >= 4 ? '#1A6B4A' : '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)', whiteSpace: 'nowrap', minWidth: '80px' }}>
            {fileCount} of 4 required
          </span>
        </div>
      </div>

      {/* Authorization */}
      <div style={{
        padding: '1.5rem',
        border: '1.5px solid #E5E7EB',
        borderRadius: '10px',
        backgroundColor: '#FAFAFA',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#0D1B2A',
          marginBottom: '0.75rem',
        }}>
          Authorization Agreement
        </h3>
        <p style={{
          fontSize: '0.82rem',
          color: '#4B5563',
          lineHeight: 1.7,
          fontFamily: 'var(--font-ibm, sans-serif)',
        }}>
          {AUTH_TEXT}
        </p>
      </div>

      {/* Signature */}
      <div>
        <Field label="Authorized Signature" required error={errors.signatureName}>
          <input
            className={`input-field${errors.signatureName ? ' error' : ''}`}
            type="text"
            placeholder="Type your full legal name to sign"
            value={data.signatureName}
            onChange={(e) => onChange('signatureName', e.target.value)}
          />
        </Field>

        {data.signatureName && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '1rem', paddingBottom: '0.5rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-dancing, Dancing Script, cursive)',
              fontSize: '2rem',
              color: '#0D1B2A',
              lineHeight: 1.2,
              marginBottom: '0',
            }}>
              {data.signatureName}
            </p>
            <div style={{ height: '1px', backgroundColor: '#0D1B2A', margin: '0.25rem 0 0.375rem' }} />
            <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'var(--font-ibm, sans-serif)' }}>
              Authorized Signature
            </p>
          </motion.div>
        )}
      </div>

      {/* Date — read only */}
      <Field label="Date Signed">
        <input
          className="input-field"
          type="text"
          value={today}
          readOnly
          style={{ backgroundColor: '#F3F4F6', cursor: 'not-allowed' }}
        />
      </Field>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          {
            field: 'authCheck1' as keyof ApplicationData,
            text: 'I authorize CapitalMatch to obtain my credit report and verify my information',
          },
          {
            field: 'authCheck2' as keyof ApplicationData,
            text: 'I agree to the CapitalMatch Broker Agreement and Terms of Service',
          },
        ].map(({ field, text }) => (
          <label
            key={field}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <div
              onClick={() => onChange(field, !data[field])}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `2px solid ${data[field] ? '#C9A84C' : '#D1D5DB'}`,
                backgroundColor: data[field] ? '#C9A84C' : '#FFFFFF',
                flexShrink: 0,
                marginTop: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              {data[field] && (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <motion.path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.svg>
              )}
            </div>
            <span style={{
              fontSize: '0.85rem',
              color: '#374151',
              lineHeight: 1.5,
              fontFamily: 'var(--font-ibm, sans-serif)',
            }}>
              {text}
            </span>
          </label>
        ))}
        {(errors.authCheck1 || errors.authCheck2) && (
          <p style={{ fontSize: '0.75rem', color: '#991B1B', fontFamily: 'var(--font-ibm, sans-serif)' }}>
            Both authorizations must be checked to submit.
          </p>
        )}
      </div>
    </div>
  )
}
