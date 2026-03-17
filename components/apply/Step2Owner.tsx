'use client'
import { useState } from 'react'
import { type ApplicationData } from '@/lib/types'

interface Props {
  data: ApplicationData
  onChange: (field: keyof ApplicationData, value: string) => void
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

const titles = ['Owner', 'CEO', 'President', 'Partner', 'Member', 'Other']
const ficoRanges = ['Below 500', '500–579', '580–619', '620–679', '680–719', '720 or above']

export default function Step2Owner({ data, onChange, errors }: Props) {
  const [ssnFocused, setSsnFocused] = useState(false)

  const inp = (field: keyof ApplicationData) => ({
    className: `input-field${errors[field] ? ' error' : ''}`,
    value: data[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(field, e.target.value),
  })

  // SSN — only store last 4, mask display
  const handleSSN = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    onChange('ssnLast4', digits)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'rgba(201,168,76,0.08)',
        borderRadius: '8px',
        borderLeft: '3px solid #C9A84C',
      }}>
        <p style={{ fontSize: '0.8rem', color: '#0D1B2A', fontFamily: 'var(--font-ibm, sans-serif)', lineHeight: 1.5 }}>
          <strong>Security note:</strong> We only store the last 4 digits of your SSN for identity verification.
          Your full SSN is never transmitted or stored.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Primary Owner Full Name" required error={errors.ownerName}>
          <input {...inp('ownerName')} type="text" placeholder="First and Last Name" className={`input-field${errors.ownerName ? ' error' : ''}`} />
        </Field>
        <Field label="Title" required error={errors.ownerTitle}>
          <select {...inp('ownerTitle')} className={`input-field${errors.ownerTitle ? ' error' : ''}`}>
            <option value="">Select title</option>
            {titles.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Ownership Percentage" required error={errors.ownershipPct}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            className={`input-field${errors.ownershipPct ? ' error' : ''}`}
            type="number"
            min={1}
            max={100}
            placeholder="e.g. 100"
            value={data.ownershipPct}
            onChange={(e) => onChange('ownershipPct', e.target.value)}
            style={{ width: '120px' }}
          />
          <span style={{ color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)' }}>%</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem', fontFamily: 'var(--font-ibm, sans-serif)' }}>
          If less than 100%, you will be asked to add the second owner on the next step.
        </p>
      </Field>

      <Field label="Home Address" required error={errors.homeAddress}>
        <input {...inp('homeAddress')} type="text" placeholder="Street Address" className={`input-field${errors.homeAddress ? ' error' : ''}`} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
        <Field label="City" required error={errors.homeCity}>
          <input {...inp('homeCity')} type="text" placeholder="City" className={`input-field${errors.homeCity ? ' error' : ''}`} />
        </Field>
        <Field label="State" required error={errors.homeState}>
          <input
            className={`input-field${errors.homeState ? ' error' : ''}`}
            type="text" placeholder="FL" maxLength={2}
            value={data.homeState}
            onChange={(e) => onChange('homeState', e.target.value.toUpperCase())}
          />
        </Field>
        <Field label="ZIP" required error={errors.homeZip}>
          <input {...inp('homeZip')} type="text" placeholder="33101" maxLength={5} className={`input-field${errors.homeZip ? ' error' : ''}`} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <Field label="Social Security Number — Last 4 Digits Only" required error={errors.ssnLast4}>
          <div style={{ position: 'relative' }}>
            <input
              className={`input-field${errors.ssnLast4 ? ' error' : ''}`}
              type={ssnFocused ? 'text' : 'password'}
              placeholder="Last 4 digits only"
              value={data.ssnLast4}
              onChange={(e) => handleSSN(e.target.value)}
              onFocus={() => setSsnFocused(true)}
              onBlur={() => setSsnFocused(false)}
              maxLength={4}
              inputMode="numeric"
            />
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              color: '#9CA3AF',
              pointerEvents: 'none',
              fontFamily: 'var(--font-ibm, sans-serif)',
              opacity: data.ssnLast4 ? 0 : 1,
            }}>
              XXX-XX-____
            </div>
          </div>
        </Field>

        <Field label="Date of Birth" required error={errors.dob}>
          <input
            className={`input-field${errors.dob ? ' error' : ''}`}
            type="date"
            value={data.dob}
            onChange={(e) => onChange('dob', e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
        </Field>

        <Field label="Estimated Credit Score" required error={errors.ficoRange}>
          <select
            className={`input-field${errors.ficoRange ? ' error' : ''}`}
            value={data.ficoRange}
            onChange={(e) => onChange('ficoRange', e.target.value)}
          >
            <option value="">Select range</option>
            {ficoRanges.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>
    </div>
  )
}
