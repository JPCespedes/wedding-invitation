import { motion } from 'framer-motion'
import { Hotel, Phone, Mail, ExternalLink } from 'lucide-react'
import { invitationData } from '../data/invitation'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 150, damping: 20, delay: i * 0.08 },
  }),
}

export function AccommodationSection() {
  const { accommodation } = invitationData

  return (
    <section id="accommodation" className="py-16 px-6 bg-white border-t border-stone-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Hotel className="mx-auto text-stone-400 mb-4" size={28} />
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-3">
            Hospedaje
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            {accommodation.description}
          </p>
        </motion.div>

        <motion.div
          className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="font-heading text-xl text-stone-800">
                {accommodation.hotelName}
              </h3>
              <p className="text-stone-500 text-sm mt-1">{accommodation.address}</p>
            </div>
            <motion.a
              href={accommodation.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-5 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExternalLink size={16} />
              Ver habitaciones
            </motion.a>
          </div>

          <div className="bg-stone-100/80 rounded-xl p-4 mb-6">
            <p className="text-stone-700 text-sm font-medium">
              {accommodation.discount}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {accommodation.rooms.map((room, i) => (
              <motion.div
                key={room.name}
                className="bg-white rounded-xl border border-stone-100 p-4 text-center"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-heading text-stone-800 text-sm mb-1">{room.name}</p>
                <p className="text-stone-500 text-xs leading-relaxed">{room.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-stone-200">
            <a
              href={`tel:${accommodation.phone}`}
              className="inline-flex items-center gap-2 text-stone-600 text-sm hover:text-stone-800 transition"
            >
              <Phone size={16} className="shrink-0" />
              {accommodation.phone}
            </a>
            <a
              href={`mailto:${accommodation.email}`}
              className="inline-flex items-center gap-2 text-stone-600 text-sm hover:text-stone-800 transition"
            >
              <Mail size={16} className="shrink-0" />
              {accommodation.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
