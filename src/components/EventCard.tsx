import { motion } from 'framer-motion'
import { Calendar, Church, MapPin, PartyPopper } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { invitationData } from '../data/invitation'
import { getGoogleCalendarUrl, downloadIcs } from '../utils/calendarLinks'
import { getGoogleMapsDirectionsUrl } from '../utils/mapLinks'
import { useAppStore } from '../store/useAppStore'
type Event = (typeof invitationData.events)[number]

const venueIconByEventId: Record<Event['id'], typeof Church> = {
  ceremonia: Church,
  celebracion: PartyPopper,
}

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const openModal = useAppStore((s) => s.openModalAction)
  const date = new Date(event.datetimeISO)
  const formattedDate = format(date, "EEEE d 'de' MMMM - h:mm a", { locale: es })

  const handleRsvp = () => {
    openModal('rsvp', { eventId: event.id })
  }

  const handleAgendar = () => {
    window.open(getGoogleCalendarUrl(event), '_blank')
    downloadIcs(event)
  }



  const handleMaps = () => {
    window.open(getGoogleMapsDirectionsUrl(event.mapsQuery), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.article
      className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8 w-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <h3 className="font-heading text-xl text-stone-800 mb-6">{event.title}</h3>

      <div className="space-y-4 text-stone-600">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 shrink-0 text-stone-400" size={18} />
          <div>
            <p className="text-xs uppercase text-stone-400">Día</p>
            <p>{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          {(() => {
            const VenueIcon = venueIconByEventId[event.id]
            return <VenueIcon className="mt-0.5 shrink-0 text-stone-400" size={18} />
          })()}
          <div>
            <p className="text-xs uppercase text-stone-400">Lugar</p>
            <p className="font-medium text-stone-700">{event.venueName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 shrink-0 text-stone-400" size={18} />
          <div>
            <p className="text-xs uppercase text-stone-400">Dirección</p>
            <p>{event.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {event.id === 'celebracion' && (
          <button
            type="button"
            onClick={handleRsvp}
            className="flex-1 py-3 px-4 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition"
          >
            Confirmar asistencia
          </button>
        )}
        <button
          type="button"
          onClick={handleAgendar}
          className="flex-1 py-3 px-4 border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition"
        >
          Agendar
        </button>
        <button
          type="button"
          onClick={handleMaps}
          className="flex-1 py-3 px-4 border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition"
        >
          ¿Cómo llegar?
        </button>
      </div>
    </motion.article>
  )
}
