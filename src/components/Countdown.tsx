import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { invitationData } from '../data/invitation'

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
        className="py-16 px-6 bg-stone-100"
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
    <motion.section
      id="countdown"
      className="py-16 px-6 bg-stone-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-10">
          Falta
        </h2>
        <div className="grid grid-cols-4 gap-4 sm:gap-6">
          {units.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
              <div className="font-heading text-3xl sm:text-4xl text-stone-800 tabular-nums">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-sm text-stone-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
