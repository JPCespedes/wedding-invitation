import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { invitationData } from '../data/invitation'

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

  const list = code ? guestLists[code] : null
  if (!list) return null

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
          {list.guests.map((name) => (
            <motion.li key={name} variants={itemVariants}>
              <span className="block py-3 px-4 bg-stone-100 rounded-lg text-stone-800 font-medium">
                {name}
              </span>
            </motion.li>
          ))}
        </motion.ul>

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
