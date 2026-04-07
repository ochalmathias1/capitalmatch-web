'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Logo from './Logo'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
    { label: 'FAQ', href: '/faq' },
    { label: 'Reviews', id: 'reviews' },
  ]

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
          backgroundColor: scrolled ? 'rgba(13,27,42,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo light size="md" />
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map(link => (
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-ibm, sans-serif)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.id!)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-ibm, sans-serif)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                >
                  {link.label}
                </button>
              )
            ))}
            <Link
              href="/apply"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.625rem 1.5rem',
                backgroundColor: '#C9A84C',
                color: '#0D1B2A',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-ibm, sans-serif)',
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(201,168,76,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E2C97A'; e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.3)' }}
            >
              Apply Now
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
              zIndex: 49,
              backgroundColor: 'rgba(13,27,42,0.98)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {navLinks.map(link => (
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 500, textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.id!)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontFamily: 'var(--font-ibm, sans-serif)', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left' }}
                >
                  {link.label}
                </button>
              )
            ))}
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'inline-flex', justifyContent: 'center',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#C9A84C', color: '#0D1B2A',
                borderRadius: '6px', fontWeight: 700, fontSize: '1rem',
                fontFamily: 'var(--font-ibm, sans-serif)', textDecoration: 'none',
              }}
            >
              Apply Now — It&apos;s Free
            </Link>
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
