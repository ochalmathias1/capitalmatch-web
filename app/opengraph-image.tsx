import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CapitalMatch — Fast Business Funding | No Broker Fees'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0D1B2A',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}
    >
      <div style={{ width: '80px', height: '4px', background: '#C9A84C', marginBottom: '32px', borderRadius: '2px' }} />
      <div style={{ fontSize: '62px', fontWeight: 800, color: '#C9A84C', marginBottom: '20px', letterSpacing: '-1px' }}>
        CapitalMatch
      </div>
      <div style={{ fontSize: '30px', color: '#FFFFFF', fontWeight: 600, marginBottom: '14px', textAlign: 'center' }}>
        Fast Business Funding · No Broker Fees
      </div>
      <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '700px' }}>
        One application reaches community of private lenders. All industries. Bad credit options. Apply free.
      </div>
      <div style={{ marginTop: '48px', fontSize: '16px', color: '#C9A84C', letterSpacing: '0.12em' }}>
        capitalmatchfunding.com
      </div>
    </div>,
    { ...size }
  )
}
