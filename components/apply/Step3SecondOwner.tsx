'use client'
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

export default function Step3SecondOwner({ data, onChange, errors }: Props) {
  const remaining = 100 - parseInt(data.ownershipPct || '0')

  const inp = (field: keyof ApplicationData) => ({
    className: `input-field${errors[field] ? ' error' : ''}`,
    value: data[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(field, e.target.value),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#F8F4ED',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
      }}>
        <p style={{ fontSize: '0.875rem', color: '#0D1B2A', fontFamily: 'var(--font-ibm, sans-serif)', lineHeight: 1.5 }}>
          Any owner with <strong>20% or more ownership</strong> must be included in this application.
          {remaining > 0 && (
            <span style={{ color: '#C9A84C' }}> Remaining ownership to account for: <strong>{remaining}%</strong></span>
          )}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Second Owner Full Name" required error={errors.secondOwnerName}>
          <input {...inp('secondOwnerName')} type="text" placeholder="First and Last Name" className={`input-field${errors.secondOwnerName ? ' error' : ''}`} />
        </Field>
        <Field label="Title" required error={errors.secondOwnerTitle}>
          <select {...inp('secondOwnerTitle')} className={`input-field${errors.secondOwnerTitle ? ' error' : ''}`}>
            <option value="">Select title</option>
            {titles.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Ownership Percentage" required error={errors.secondOwnerPct}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            className={`input-field${errors.secondOwnerPct ? ' error' : ''}`}
            type="number"
            min={1}
            max={remaining}
            placeholder={`Up to ${remaining}%`}
            value={data.secondOwnerPct}
            onChange={(e) => onChange('secondOwnerPct', e.target.value)}
            style={{ width: '120px' }}
          />
          <span style={{ color: '#6B7280', fontFamily: 'var(--font-ibm, sans-serif)' }}>%</span>
        </div>
      </Field>

      <Field label="Home Address" required error={errors.secondOwnerAddress}>
        <input {...inp('secondOwnerAddress')} type="text" placeholder="Street Address" className={`input-field${errors.secondOwnerAddress ? ' error' : ''}`} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
        <Field label="City" required error={errors.secondOwnerCity}>
          <input {...inp('secondOwnerCity')} type="text" placeholder="City" className={`input-field${errors.secondOwnerCity ? ' error' : ''}`} />
        </Field>
        <Field label="State" required error={errors.secondOwnerState}>
          <input
            className={`input-field${errors.secondOwnerState ? ' error' : ''}`}
            type="text" placeholder="FL" maxLength={2}
            value={data.secondOwnerState}
            onChange={(e) => onChange('secondOwnerState', e.target.value.toUpperCase())}
          />
        </Field>
        <Field label="ZIP" required error={errors.secondOwnerZip}>
          <input {...inp('secondOwnerZip')} type="text" placeholder="33101" maxLength={5} className={`input-field${errors.secondOwnerZip ? ' error' : ''}`} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <Field label="SSN — Last 4 Digits Only" required error={errors.secondOwnerSsnLast4}>
          <input
            className={`input-field${errors.secondOwnerSsnLast4 ? ' error' : ''}`}
            type="password"
            placeholder="Last 4 digits only"
            value={data.secondOwnerSsnLast4}
            onChange={(e) => onChange('secondOwnerSsnLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            inputMode="numeric"
          />
        </Field>

        <Field label="Date of Birth" required error={errors.secondOwnerDob}>
          <input
            className={`input-field${errors.secondOwnerDob ? ' error' : ''}`}
            type="date"
            value={data.secondOwnerDob}
            onChange={(e) => onChange('secondOwnerDob', e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
        </Field>

        <Field label="Estimated Credit Score" required error={errors.secondOwnerFico}>
          <select
            className={`input-field${errors.secondOwnerFico ? ' error' : ''}`}
            value={data.secondOwnerFico}
            onChange={(e) => onChange('secondOwnerFico', e.target.value)}
          >
            <option value="">Select range</option>
            {ficoRanges.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>
    </div>
  )
}
