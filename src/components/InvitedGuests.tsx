import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRsvpStatus } from '../features/rsvp/useRsvpStatus'
import { useInvitation } from '../features/rsvp/useInvitation'
import { FloralSpray } from './ornaments/FloralSpray'

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
}

export function InvitedGuests() {
  const { code, confirmedGuests, isConfirmed } = useRsvpStatus()

  const { invitation, isLoading } = useInvitation(code)

  if (!code) return null

  if (isLoading) {
    return (
      <section id="invitados" className="py-16 px-6 bg-stone-50">
        <div className="max-w-md mx-auto text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 animate-pulse mx-auto" />
          <div className="h-6 bg-stone-100 rounded-lg animate-pulse mx-auto w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!invitation) return null

  const getGuestStatus = (name: string) => {
    if (!confirmedGuests) return null
    return confirmedGuests.find((g) => g.name === name) ?? null
  }

  return (
    <section
      id="invitados"
      className="relative py-16 sm:py-20 px-5 sm:px-6 bg-stone-50 overflow-hidden paper-grain"
    >
      <FloralSpray className="absolute -top-4 -right-8 w-36 sm:w-48" mirrored />

      <div className="relative max-w-md md:max-w-xl mx-auto text-center">
        <motion.div
          className="inline-flex flex-col items-center gap-3 mb-5"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center" aria-hidden>
            <svg viewBox="0 0 64 64" className="absolute inset-0 w-16 h-16">
              <circle cx="32" cy="32" r="30" className="fill-terra-50" stroke="url(#orn-gold)" strokeWidth="1.1" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="url(#orn-gold)" strokeWidth="0.5" opacity="0.45" />
            </svg>
            <span className="relative font-heading text-2xl text-terra-600">
              {invitation.guests.length}
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-normal uppercase tracking-[0.16em] text-stone-800">
            Invitados
          </h2>
        </motion.div>

        <motion.ul
          className="flex flex-col gap-2.5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {invitation.guests.map((name) => {
            const status = getGuestStatus(name)
            const attending = status?.attending ?? null

            return (
              <motion.li key={name} variants={itemVariants}>
                <span
                  className={`flex flex-col items-center gap-0.5 py-3 px-4 rounded-[3px] border transition-colors ${
                    attending === false
                      ? 'bg-stone-100/75 border-stone-300/50 border-l-2 border-l-stone-300 text-stone-500'
                      : 'bg-terra-50/80 border-gold-500/30 border-l-2 border-l-gold-500 text-stone-800'
                  }`}
                >
                  <span
                    className={`font-heading italic text-xl leading-snug ${
                      attending === false ? 'line-through' : ''
                    }`}
                  >
                    {name}
                  </span>
                  {attending === true && (
                    <span className="flex items-center gap-1.5 text-xs text-terra-600">
                      <Check size={14} className="text-terra-500" />
                      Confirmado
                    </span>
                  )}
                  {attending === false && <span className="text-xs text-stone-400">No asiste</span>}
                </span>
              </motion.li>
            )
          })}
        </motion.ul>

        {isConfirmed && (
          <motion.div
            className="inline-flex items-center gap-2 bg-terra-500 text-white text-xs font-medium px-4 py-2.5 rounded-full mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Check size={14} />
            Invitación confirmada
          </motion.div>
        )}

        <motion.p
          className="font-heading italic font-light text-lg text-stone-600 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {invitation.message}
        </motion.p>
      </div>
    </section>
  )
}
