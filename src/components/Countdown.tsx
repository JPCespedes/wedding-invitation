import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { invitationData } from '../data/invitation'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
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
      <motion.section
        id="countdown"
        className="py-16 px-6 bg-stone-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-4">
            ¡Gracias por compartir este día con nosotros!
          </h2>
          <p className="text-stone-600">
            El día más especial ya llegó. Los recordamos con cariño.
          </p>
        </div>
      </motion.section>
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
    <section id="countdown" className="py-16 px-6 bg-stone-50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-heading text-2xl md:text-3xl text-stone-800 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Falta
        </motion.h2>
        <motion.div
          className="grid grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {units.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm p-4 border border-stone-100"
            >
              <div className="font-heading text-3xl sm:text-4xl text-stone-800">
                <FlipNumber value={value} />
              </div>
              <div className="text-sm text-stone-500 mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
