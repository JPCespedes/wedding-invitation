import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { invitationData } from '../data/invitation'
import { FloralSpray } from './ornaments/FloralSpray'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
}

function FlipNumber({ value }: { value: number }) {
  const display = String(value).padStart(2, '0')
  const prevRef = useRef(display)
  const changed = prevRef.current !== display
  prevRef.current = display

  return (
    <div className="relative overflow-hidden leading-none" style={{ height: '1.25em', fontSize: 'inherit' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={display}
          className="block tabular-nums"
          initial={changed ? { y: '100%', opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/** Photo backdrop under a cream veil — the panel floats on top of it. */
function PanelBackdrop() {
  return (
    <>
      <img
        src={invitationData.gallery[3].src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/90 via-terra-50/85 to-dusty-50/90" />
      <FloralSpray className="absolute top-1 -left-6 w-36 sm:w-44" variant="sprig" />
      <FloralSpray mirrored className="absolute -bottom-3 -right-6 w-36 sm:w-44" variant="sprig" />
    </>
  )
}

export function Countdown() {
  const target = new Date(invitationData.couple.dateISO)
  const [now, setNow] = useState(new Date())
  const isPast = now >= target

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  if (isPast) {
    return (
      <section id="countdown" className="relative py-20 px-6 overflow-hidden paper-grain">
        <PanelBackdrop />
        <motion.div
          className="relative max-w-md mx-auto text-center bg-white/85 border border-gold-500/45 rounded-sm shadow-[0_6px_28px_rgba(17,42,67,0.1)] px-6 py-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-script text-4xl sm:text-5xl text-stone-800 mb-4">
            ¡Gracias por compartir este día con nosotros!
          </h2>
          <p className="font-heading italic font-light text-lg text-stone-600">
            El día más especial ya llegó. Los recordamos con cariño.
          </p>
        </motion.div>
      </section>
    )
  }

  const days = differenceInDays(target, now)
  const hours = differenceInHours(target, now) % 24
  const minutes = differenceInMinutes(target, now) % 60
  const seconds = differenceInSeconds(target, now) % 60

  const units = [
    { value: days, label: 'días' },
    { value: hours, label: 'hs' },
    { value: minutes, label: 'min' },
    { value: seconds, label: 'seg' },
  ]

  return (
    <section id="countdown" className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden paper-grain">
      <PanelBackdrop />

      <div className="relative max-w-md md:max-w-2xl mx-auto bg-white/86 border border-gold-500/45 rounded-sm shadow-[0_6px_28px_rgba(17,42,67,0.1)] px-5 sm:px-8 py-8 sm:py-10">
        {/* inner hairline */}
        <div className="absolute inset-[7px] border border-gold-500/20 pointer-events-none" />

        <div className="relative flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            Cuenta regresiva
          </p>
          <motion.h2
            className="font-heading text-3xl sm:text-4xl font-normal tracking-wide text-stone-800"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {days === 1 && hours === 0 ? 'Falta' : 'Faltan'}
          </motion.h2>
          <svg viewBox="0 0 120 16" aria-hidden className="w-28 h-4">
            <path d="M2,8 H44" stroke="url(#orn-gold)" strokeWidth="1" fill="none" />
            <path d="M76,8 H118" stroke="url(#orn-gold)" strokeWidth="1" fill="none" />
            <path
              d="M60,2 C64,6 68,7 70,8 C68,9 64,10 60,14 C56,10 52,9 50,8 C52,7 56,6 60,2 Z"
              fill="#C3A265"
              opacity="0.8"
            />
          </svg>
        </div>

        <motion.div
          className="relative grid grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {units.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              className="text-center bg-terra-50/70 border border-gold-500/35 rounded-[3px] px-1 py-3 sm:py-4"
            >
              <div className="font-heading text-[1.75rem] sm:text-4xl font-normal text-stone-800">
                <FlipNumber value={value} />
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.1em] text-stone-400 mt-1">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
