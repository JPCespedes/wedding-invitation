import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hotel, Phone, Mail, ExternalLink, Ticket, ChevronDown } from 'lucide-react'
import { invitationData } from '../data/invitation'

export function AccommodationSection() {
  const { accommodation } = invitationData
  const [showRates, setShowRates] = useState(false)

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
          className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8"
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

          {/* Coupon */}
          <div className="bg-stone-800 text-white rounded-xl p-4 mb-6 flex items-start gap-3">
            <Ticket size={20} className="shrink-0 mt-0.5 text-stone-300" />
            <div>
              <p className="text-sm font-medium mb-1">
                Cupón de descuento:{' '}
                <span className="font-mono tracking-wider bg-white/15 px-2 py-0.5 rounded">
                  {accommodation.coupon}
                </span>
              </p>
              <p className="text-stone-300 text-xs">{accommodation.couponNote}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {accommodation.amenities.map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-white border border-stone-200 text-stone-600 rounded-full px-3 py-1"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Expandable rates */}
          <div className="border border-stone-200 rounded-xl overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setShowRates(!showRates)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-stone-50 transition text-sm font-medium text-stone-700"
            >
              <span>Ver tarifas preferenciales</span>
              <motion.span
                animate={{ rotate: showRates ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-stone-400"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {showRates && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-2 bg-white border-t border-stone-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {accommodation.rooms.map((room) => (
                        <div
                          key={room.name}
                          className="bg-stone-50 rounded-xl border border-stone-100 p-4"
                        >
                          <p className="font-heading text-stone-800 text-base mb-3 text-center">
                            {room.name}
                          </p>
                          <div className="space-y-2">
                            {room.rates.map((rate) => (
                              <div
                                key={rate.occupancy}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-stone-500">{rate.occupancy}</span>
                                <span className="font-medium text-stone-800">{rate.price}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-stone-400 text-[10px] mt-2 text-center">
                            + impuesto 13%
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-stone-400 text-xs mt-3">{accommodation.policyNote}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reservation note + Contact */}
          <p className="text-stone-500 text-xs mb-4">{accommodation.reservationNote}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-200">
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
