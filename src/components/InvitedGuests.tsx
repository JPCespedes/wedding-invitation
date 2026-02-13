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

export function InvitedGuests() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('invitacion')?.toLowerCase().trim()

  const list = code ? guestLists[code] : null
  if (!list) return null

  return (
    <motion.section
      id="invitados"
      className="py-16 px-6 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex flex-col items-center mb-4">
          <div
            className="w-14 h-14 rounded-full border-2 border-stone-100 bg-stone-100 flex items-center justify-center text-stone-800 font-heading text-xl mb-3"
            aria-hidden
          >
            {list.totalCount}
          </div>
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 uppercase tracking-wide">
            Invitados
          </h2>
        </div>

        <ul className="space-y-3 mt-6">
          {list.guests.map((name) => (
            <li key={name}>
              <span className="block py-3 px-4 bg-stone-100 rounded-lg text-stone-800 font-medium">
                {name}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-stone-500 text-sm mt-8">{list.message}</p>
      </div>
    </motion.section>
  )
}
