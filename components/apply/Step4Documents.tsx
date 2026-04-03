'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type ApplicationData } from '@/lib/types'

interface Props {
  data: ApplicationData
  onChange: (field: keyof ApplicationData, value: string | string[] | boolean) => void
  errors: Partial<Record<keyof ApplicationData, string>>
  uploadToken: string
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

export default function Step4Documents({ data, onChange, errors, uploadToken }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Refs hold the live accumulated state so every upload — concurrent or
  // sequential — always appends to the real current list, never a stale snapshot.
  const urlsRef  = useRef<string[]>(data.bankStatementUrls  || [])
  const namesRef = useRef<string[]>(data.bankStatementNames || [])
  // Guard against re-entrant uploadFiles calls (user drops while uploading).
  const uploadingRef = useRef(false)

  // Keep refs in sync when parent state changes (e.g. removeFile updates parent).
  useEffect(() => { urlsRef.current  = data.bankStatementUrls  || [] }, [data.bankStatementUrls])
  useEffect(() => { namesRef.current = data.bankStatementNames || [] }, [data.bankStatementNames])

  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

  const uploadFiles = async (files: File[]) => {
    // Block concurrent invocations — second drop/click while upload is running.
    if (uploadingRef.current) return
    uploadingRef.current = true
    setUploading(true)
    setUploadError('')

    for (const file of files) {
      // Max 6 bank statements
      if (urlsRef.current.length >= 10) {
        setUploadError('Maximum 10 files allowed. Remove a file before adding more.')
        break
      }

      // Duplicate check against live ref, not stale prop snapshot.
      if (namesRef.current.includes(file.name)) continue

      try {
        const form = new FormData()
        form.append('file', file)
        if (uploadToken) form.append('uploadToken', uploadToken)

        let res = await fetch('/api/upload-statement', { method: 'POST', body: form })
        let json = await res.json()

        // Auto-retry once on 401 (expired token) — fetch fresh token and resend
        if (res.status === 401) {
          try {
            const tokenRes = await fetch('/api/upload-token')
            const tokenJson = await tokenRes.json()
            if (tokenJson.token) {
              const retryForm = new FormData()
              retryForm.append('file', file)
              retryForm.append('uploadToken', tokenJson.token)
              res = await fetch('/api/upload-statement', { method: 'POST', body: retryForm })
              json = await res.json()
            }
          } catch { /* retry failed, fall through to error handling */ }
        }

        if (!res.ok) {
          const detail = json?.error ?? `HTTP ${res.status}`
          const sizeMB = (file.size / 1024 / 1024).toFixed(1)
          console.error(`[upload] Failed for ${file.name} (${sizeMB}MB, type=${file.type}):`, json)
          if (file.size > 10 * 1024 * 1024) {
            setUploadError(`${file.name} is too large (${sizeMB}MB). Maximum file size is 10MB.`)
          } else {
            setUploadError(`Failed to upload ${file.name}: ${detail}`)
          }
          continue
        }

        if (json.signedUrl) {
          // Update refs immediately so the next file in this loop sees the
          // accumulated result, not the stale snapshot from the original render.
          urlsRef.current  = [...urlsRef.current,  json.signedUrl]
          namesRef.current = [...namesRef.current, file.name]
          // Notify parent after each successful file so the UI updates live.
          onChange('bankStatementUrls',  urlsRef.current)
          onChange('bankStatementNames', namesRef.current)
        }
      } catch (err) {
        console.error(`[upload] Network error for ${file.name}:`, err)
        setUploadError(`Failed to upload ${file.name}. Check your connection and try again.`)
      }
    }

    uploadingRef.current = false
    setUploading(false)
  }

  const removeFile = (index: number) => {
    const urls  = [...(data.bankStatementUrls  || [])]
    const names = [...(data.bankStatementNames || [])]
    urls.splice(index, 1)
    names.splice(index, 1)
    onChange('bankStatementUrls',  urls)
    onChange('bankStatementNames', names)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (uploadingRef.current) return  // ignore drops during active upload
    const files = Array.from(e.dataTransfer.files)
    if (files.length) uploadFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (files.length) uploadFiles(files)
  }

  const fileCount = (data.bankStatementNames || []).length
  const needsMore = fileCount < 1

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
            placeholder="$0.00"
            value={data.mcaBalance}
            onChange={(e) => {
              // Strip non-numeric except decimal, then format as accounting
              const raw = e.target.value.replace(/[^0-9.]/g, '')
              const num = parseFloat(raw)
              if (raw === '' || raw.endsWith('.') || raw.endsWith('.0') || raw.endsWith('.00')) {
                onChange('mcaBalance', raw ? `$${raw}` : '')
              } else if (!isNaN(num)) {
                onChange('mcaBalance', `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
              }
            }}
            onFocus={(e) => {
              // Strip formatting on focus for easy editing
              const raw = e.target.value.replace(/[^0-9.]/g, '')
              if (raw) onChange('mcaBalance', raw)
            }}
            onBlur={() => {
              // Re-apply accounting format on blur
              const raw = (data.mcaBalance || '').replace(/[^0-9.]/g, '')
              const num = parseFloat(raw)
              if (!raw || isNaN(num)) {
                onChange('mcaBalance', '$0.00')
              } else {
                onChange('mcaBalance', `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
              }
            }}
          />
        </Field>
      </div>

      {/* Document Upload */}
      <div>
        <label className="label">
          Documents<span style={{ color: '#991B1B', marginLeft: '2px' }}>*</span>
        </label>

        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: dragOver ? '#C9A84C' : '#D1D5DB',
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
                Upload your documents
              </p>
              <p style={{ fontSize: '0.8rem', color: '#0D1B2A', marginBottom: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                <b>Required:</b> Bank statements (1–6 months). If today is past the 20th, include your current month-to-date statement.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#0D1B2A', marginBottom: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                <b>Optional but helpful:</b> Zero balance letters (ZBL), accounts receivable, P&amp;L statements. Not required unless stated otherwise — but any extra info helps us get you better offers.
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'var(--font-ibm, sans-serif)' }}>
                Accepted: PDF, JPG, PNG · Up to 10 files · Click or drag files here
              </p>
            </>
          )}
        </motion.div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3.5V6.5C2 9.75 4.1 12.7 7 13.5C9.9 12.7 12 9.75 12 6.5V3.5L7 1Z" stroke="#1A6B4A" strokeWidth="1.2" fill="none"/>
            <path d="M5 7L6.5 8.5L9 5.5" stroke="#1A6B4A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="trust-badge">256-bit encrypted · Your data is secure</span>
        </div>

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
              animate={{ width: `${Math.min((fileCount / 10) * 100, 100)}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', backgroundColor: fileCount >= 1 ? '#1A6B4A' : '#C9A84C', borderRadius: '2px' }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: fileCount >= 1 ? '#1A6B4A' : '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)', whiteSpace: 'nowrap', minWidth: '80px' }}>
            {fileCount} / 10 max
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
