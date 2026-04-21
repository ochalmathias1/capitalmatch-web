'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

const industries = [
  { name: 'Construction', multiplier: 1.15 },
  { name: 'Restaurant', multiplier: 0.85 },
  { name: 'Trucking', multiplier: 1.0 },
  { name: 'Retail', multiplier: 0.9 },
  { name: 'Auto', multiplier: 0.95 },
  { name: 'Healthcare', multiplier: 1.2 },
  { name: 'Wholesale', multiplier: 1.1 },
  { name: 'Services', multiplier: 1.0 },
]

const revenueStops = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500]

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

export default function EligibilityEstimator() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [sliderIdx, setSliderIdx] = useState(4) // 25K
  const [selectedIndustry, setSelectedIndustry] = useState(0) // Construction

  const monthlyRevenue = revenueStops[sliderIdx] * 1000
  const mult = industries[selectedIndustry].multiplier
  const low = Math.round(monthlyRevenue * 1.3 * mult)
  const high = Math.round(monthlyRevenue * 3.0 * mult)

  const revenueLabel = revenueStops[sliderIdx] >= 500 ? '$500K+' : `$${revenueStops[sliderIdx]}K`

  // Slider fill percentage
  const fillPct = (sliderIdx / (revenueStops.length - 1)) * 100

  return (
    <section style={{
      backgroundColor: 'var(--cream)',
      padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
    }}>
      <div ref={ref} style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(3rem, 5vw, 5rem)',
        alignItems: 'center',
      }}>
        {/* Left column: copy */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-dark)',
            marginBottom: '1.5rem',
          }}>
            — FUNDING ESTIMATOR —
          </p>
          <h2 style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--ink)',
            marginBottom: '1.75rem',
          }}>
            See your estimated<br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>funding range.</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            fontFamily: 'var(--font-ibm, sans-serif)',
            fontWeight: 400,
            maxWidth: '460px',
          }}>
            Slide your monthly revenue, pick your industry, and get an instant estimate of what our lender network could offer you. No signup required.
          </p>
        </motion.div>

        {/* Right column: card */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            position: 'relative',
            boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Gold corner brackets: top-left */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            width: '32px',
            height: '32px',
            borderTop: '2px solid var(--gold)',
            borderLeft: '2px solid var(--gold)',
            borderTopLeftRadius: '12px',
            pointerEvents: 'none',
          }} />
          {/* Gold corner brackets: bottom-right */}
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            right: '-1px',
            width: '32px',
            height: '32px',
            borderBottom: '2px solid var(--gold)',
            borderRight: '2px solid var(--gold)',
            borderBottomRightRadius: '12px',
            pointerEvents: 'none',
          }} />

          {/* Live lenders pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            border: '1px solid var(--line)',
            borderRadius: '100px',
            marginBottom: '2rem',
          }}>
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}>
              Private Lender Network
            </span>
          </div>

          {/* Monthly revenue slider */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.75rem',
            }}>
              <label style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                fontWeight: 500,
              }}>
                MONTHLY REVENUE
              </label>
              <span style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--ink)',
              }}>
                {revenueLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={revenueStops.length - 1}
              value={sliderIdx}
              onChange={e => setSliderIdx(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                WebkitAppearance: 'none',
                appearance: 'none' as 'auto',
                borderRadius: '3px',
                outline: 'none',
                cursor: 'pointer',
                background: `linear-gradient(to right, var(--navy) 0%, var(--navy) ${fillPct}%, var(--line) ${fillPct}%, var(--line) 100%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', color: 'var(--muted)' }}>$5K</span>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', color: 'var(--muted)' }}>$500K+</span>
            </div>
          </div>

          {/* Industry chips */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              fontWeight: 500,
              display: 'block',
              marginBottom: '0.75rem',
            }}>
              INDUSTRY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {industries.map((ind, i) => (
                <button
                  key={ind.name}
                  onClick={() => setSelectedIndustry(i)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '100px',
                    border: i === selectedIndustry ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                    backgroundColor: i === selectedIndustry ? 'rgba(201,168,76,0.08)' : 'transparent',
                    color: i === selectedIndustry ? 'var(--gold-dark)' : 'var(--muted)',
                    fontFamily: 'var(--font-ibm, sans-serif)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {ind.name}
                  <span style={{
                    fontSize: '0.72rem',
                    opacity: 0.6,
                    marginLeft: '0.3rem',
                  }}>
                    {ind.multiplier}x
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live result bar */}
          <div style={{
            backgroundColor: 'var(--navy)',
            borderRadius: '10px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Ghost bridge image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/story-bridge.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.12,
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.5rem',
              }}>
                YOUR ESTIMATED RANGE
              </p>
              <p style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: '0.5rem',
              }}>
                {formatMoney(low)} — {formatMoney(high)}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
              }}>
                {industries[selectedIndustry].name} &middot; {revenueLabel}/mo
              </p>
              <Link href="/apply" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--gold)',
                color: 'var(--navy)',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                Claim My Offer
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slider thumb styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--navy);
          border: 3px solid var(--gold);
          cursor: pointer;
          margin-top: -8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--navy);
          border: 3px solid var(--gold);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        @media (max-width: 1080px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
