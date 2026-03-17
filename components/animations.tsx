'use client'
import React, { type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

// Core variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

// FadeUp wrapper — animates on scroll into view
export function FadeUp({ children, delay = 0, className = '', style }: {
  children: ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={reduced ? {} : fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// StaggerContainer — staggers children on scroll
export function StaggerContainer({ children, className = '', style }: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={reduced ? {} : stagger}
    >
      {children}
    </motion.div>
  )
}

// StaggerItem — child of StaggerContainer
export function StaggerItem({ children, className = '', style }: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className} style={style} variants={reduced ? {} : fadeUp}>
      {children}
    </motion.div>
  )
}

// CountUp — animates a number from 0 to target on scroll
export function CountUp({ target, suffix = '', prefix = '' }: {
  target: number
  suffix?: string
  prefix?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <span>{prefix}{target}{suffix}</span>
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={(entry) => {
        if (!entry) return
        const el = entry.target as HTMLElement
        let start = 0
        const end = target
        const duration = 1200
        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          el.textContent = prefix + Math.floor(progress * end) + suffix
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }}
    >
      {prefix}0{suffix}
    </motion.span>
  )
}

// PulseButton — subtle pulse on CTA buttons
export function PulseButton({ children, onClick, className = '', disabled = false, style }: {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
      animate={reduced || disabled ? {} : {
        boxShadow: [
          '0 0 0 0 rgba(201,168,76,0)',
          '0 0 0 8px rgba(201,168,76,0.2)',
          '0 0 0 0 rgba(201,168,76,0)',
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
      whileHover={reduced ? {} : { scale: 1.02 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
