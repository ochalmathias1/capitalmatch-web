'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Logo from './Logo'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinks = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'About', id: 'our-story' },
    { label: 'FAQ', id: 'faq' },
  ]

  const solid = scrolled || !isHomepage || mobileOpen

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: solid ? 'rgba(10,23,37,0.92)' : 'transparent',
          backdropFilter: solid ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
          borderBottom: solid ? '1px solid rgba(201,168,76,0.1)' : 'none',
          transition: 'all 0.35s ease',
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Logo */}
          <Logo light size="md" />

          {/* Center: nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-ibm, sans-serif)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: CTA only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <Link
              href="/apply"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.6rem 1.4rem',
                backgroundColor: 'var(--gold)',
                color: 'var(--navy)',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold-light)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              Check My Options
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none',
            }}
          >
            <div style={{ width: '24px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ height: '2px', backgroundColor: mobileOpen ? '#C9A84C' : '#fff', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', display: 'block' }} />
              <span style={{ height: '2px', backgroundColor: '#fff', transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1, display: 'block' }} />
              <span style={{ height: '2px', backgroundColor: mobileOpen ? '#C9A84C' : '#fff', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', display: 'block' }} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 49,
              backgroundColor: 'rgba(10,23,37,0.98)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-playfair, serif)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'inline-flex', justifyContent: 'center',
                padding: '0.875rem 1.5rem',
                backgroundColor: 'var(--gold)', color: 'var(--navy)',
                borderRadius: '6px', fontWeight: 700, fontSize: '1rem',
                fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
                marginTop: '0.5rem',
              }}
            >
              Check My Options — It&apos;s Free
            </Link>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="tel:3478139747" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontFamily: 'var(--font-mono), monospace', textDecoration: 'none' }}>
                Eddie (347) 813-9747
              </a>
              <a href="tel:8482499289" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontFamily: 'var(--font-mono), monospace', textDecoration: 'none' }}>
                William (848) 249-9289
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
