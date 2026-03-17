'use client'
import { type ApplicationData } from '@/lib/types'

interface Props {
  data: ApplicationData
  onChange: (field: keyof ApplicationData, value: string) => void
  errors: Partial<Record<keyof ApplicationData, string>>
}

function Field({ label, error, required, children }: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
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

const entityTypes = ['LLC', 'Sole Proprietorship', 'Partnership', 'Corporation', 'Other']
const revenueRanges = ['Under $10,000', '$10,000 – $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000 – $250,000', '$250,000 or more']
const amountRanges = ['$5,000 – $15,000', '$15,000 – $30,000', '$30,000 – $75,000', '$75,000 – $150,000', '$150,000 – $300,000', '$300,000 or more']
const useOfFunds = ['Inventory or Stock', 'Equipment Purchase', 'Payroll or Staffing', 'Marketing or Advertising', 'Renovations', 'Bridge Financing', 'Working Capital', 'Expansion', 'Other']

export default function Step1Business({ data, onChange, errors }: Props) {
  const inp = (field: keyof ApplicationData) => ({
    className: `input-field${errors[field] ? ' error' : ''}`,
    value: data[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(field, e.target.value),
  })

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9)
    if (digits.length <= 2) return digits
    return digits.slice(0, 2) + '-' + digits.slice(2)
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3)
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Business Legal Name" required error={errors.businessName}>
          <input {...inp('businessName')} type="text" placeholder="As registered with state" />
        </Field>
        <Field label="DBA (if different)" error={errors.dba}>
          <input {...inp('dba')} type="text" placeholder="Doing Business As (optional)" />
        </Field>
      </div>

      <Field label="Business Street Address" required error={errors.businessAddress}>
        <input {...inp('businessAddress')} type="text" placeholder="123 Main Street" />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
        <Field label="City" required error={errors.businessCity}>
          <input {...inp('businessCity')} type="text" placeholder="City" />
        </Field>
        <Field label="State" required error={errors.businessState}>
          <input {...inp('businessState')} type="text" placeholder="FL" maxLength={2}
            onChange={(e) => onChange('businessState', e.target.value.toUpperCase())}
            value={data.businessState} className={`input-field${errors.businessState ? ' error' : ''}`} />
        </Field>
        <Field label="ZIP Code" required error={errors.businessZip}>
          <input {...inp('businessZip')} type="text" placeholder="33101" maxLength={5} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Business Phone" required error={errors.businessPhone}>
          <input
            className={`input-field${errors.businessPhone ? ' error' : ''}`}
            type="tel"
            placeholder="(555) 555-5555"
            value={data.businessPhone}
            onChange={(e) => onChange('businessPhone', formatPhone(e.target.value))}
          />
        </Field>
        <Field label="Business EIN" required error={errors.ein}>
          <input
            className={`input-field${errors.ein ? ' error' : ''}`}
            type="text"
            placeholder="XX-XXXXXXX"
            value={data.ein}
            onChange={(e) => onChange('ein', formatEIN(e.target.value))}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Date Business Started" required error={errors.dateStarted}>
          <input {...inp('dateStarted')} type="date" className={`input-field${errors.dateStarted ? ' error' : ''}`} />
        </Field>
        <Field label="Type of Entity" required error={errors.entityType}>
          <select {...inp('entityType')} className={`input-field${errors.entityType ? ' error' : ''}`}>
            <option value="">Select entity type</option>
            {entityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Business Email Address" required error={errors.businessEmail}>
        <input {...inp('businessEmail')} type="email" placeholder="owner@yourbusiness.com" />
      </Field>

      <Field label="Type of Business" required error={errors.businessDescription}>
        <textarea
          className={`input-field${errors.businessDescription ? ' error' : ''}`}
          rows={3}
          placeholder="Briefly describe what your business does"
          value={data.businessDescription}
          onChange={(e) => onChange('businessDescription', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Field label="Monthly Revenue" required error={errors.monthlyRevenue}>
          <select {...inp('monthlyRevenue')} className={`input-field${errors.monthlyRevenue ? ' error' : ''}`}>
            <option value="">Select range</option>
            {revenueRanges.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Amount Requested" required error={errors.requestedAmount}>
          <select {...inp('requestedAmount')} className={`input-field${errors.requestedAmount ? ' error' : ''}`}>
            <option value="">Select range</option>
            {amountRanges.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Use of Funds" required error={errors.useOfFunds}>
        <select {...inp('useOfFunds')} className={`input-field${errors.useOfFunds ? ' error' : ''}`}>
          <option value="">Select use of funds</option>
          {useOfFunds.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </Field>
    </div>
  )
}
