import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { invitationData } from '../data/invitation'
import { useAppStore } from '../store/useAppStore'
import { checkExistingRsvp } from '../features/rsvp/useGoogleFormSubmit'

const guestLists = invitationData.guestLists as unknown as Record<
  string,
  {
    totalCount: number
    guests: string[]
    message: string
  }
>

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
  const [searchParams] = useSearchParams()
  const code = searchParams.get('invitacion')?.toLowerCase().trim()
  const confirmedGuests = useAppStore((s) => s.confirmedGuests)
  const setConfirmedGuests = useAppStore((s) => s.setConfirmedGuests)

  const list = code ? guestLists[code] : null

  useEffect(() => {
    if (!code || confirmedGuests !== null) return
    checkExistingRsvp(code).then((result) => {
      if (result.exists && result.guests) {
        setConfirmedGuests(result.guests)
      }
    })
  }, [code, confirmedGuests, setConfirmedGuests])

  if (!list) return null

  const getGuestStatus = (name: string) => {
    if (!confirmedGuests) return null
    return confirmedGuests.find((g) => g.name === name) ?? null
  }

  const isConfirmed = confirmedGuests !== null

  return (
    <section id="invitados" className="py-16 px-6 bg-white">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          className="inline-flex flex-col items-center mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div
            className="w-14 h-14 rounded-full border-2 border-stone-100 bg-stone-100 flex items-center justify-center text-stone-800 font-heading text-xl mb-3"
            aria-hidden
          >
            {list.totalCount}
          </div>
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 uppercase tracking-wide">
            Invitados
          </h2>
        </motion.div>

        <motion.ul
          className="space-y-3 mt-6"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {list.guests.map((name) => {
            const status = getGuestStatus(name)
            const attending = status?.attending ?? null

            return (
              <motion.li key={name} variants={itemVariants}>
                <span
                  className={`flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-colors ${
                    attending === true
                      ? 'bg-stone-100 text-stone-800'
                      : attending === false
                        ? 'bg-stone-50 text-stone-400 line-through'
                        : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  <span>{name}</span>
                  {attending === true && (
                    <span className="flex items-center gap-1 text-xs text-stone-500 font-normal">
                      <Check size={14} className="text-stone-600" />
                      Confirmado
                    </span>
                  )}
                  {attending === false && (
                    <span className="text-xs text-stone-400 font-normal" style={{ textDecoration: 'none' }}>
                      No asiste
                    </span>
                  )}
                </span>
              </motion.li>
            )
          })}
        </motion.ul>

        {isConfirmed && (
          <motion.div
            className="inline-flex items-center gap-2 bg-stone-800 text-white text-xs font-medium px-4 py-2 rounded-full mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Check size={14} />
            Invitación confirmada
          </motion.div>
        )}

        <motion.p
          className="text-stone-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {list.message}
        </motion.p>
      </div>
    </section>
  )
}
