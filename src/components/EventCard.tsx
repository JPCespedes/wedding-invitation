import { motion } from 'framer-motion'
import { Calendar, Church, MapPin, PartyPopper } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { invitationData } from '../data/invitation'
import { getGoogleCalendarUrl, downloadIcs } from '../utils/calendarLinks'
import { getGoogleMapsDirectionsUrl } from '../utils/mapLinks'
import { useAppStore } from '../store/useAppStore'
import { FloralSpray } from './ornaments/FloralSpray'

type Event = (typeof invitationData.events)[number]

const venueIconByEventId: Record<Event['id'], typeof Church> = {
  ceremonia: Church,
  celebracion: PartyPopper,
}

/** Each event gets its own gradient so the two cards read as a pair, not a repeat. */
const accentByEventId: Record<Event['id'], { bar: string; chip: string; icon: string }> = {
  ceremonia: {
    bar: 'from-dusty-300 via-gold-500 to-terra-300',
    chip: 'bg-dusty-50',
    icon: 'text-dusty-600',
  },
  celebracion: {
    bar: 'from-terra-300 via-gold-500 to-dusty-300',
    chip: 'bg-terra-50',
    icon: 'text-terra-500',
  },
}

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const openModal = useAppStore((s) => s.openModalAction)
  const date = new Date(event.datetimeISO)
  const formattedDate = format(date, "EEEE d 'de' MMMM · h:mm a", { locale: es })
  const accent = accentByEventId[event.id]
  const VenueIcon = venueIconByEventId[event.id]

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

  const secondaryButton =
    'flex-1 py-3 px-4 border border-dusty-500/30 text-dusty-600 rounded-lg text-sm font-medium hover:bg-dusty-50 transition'

  return (
    <motion.article
      className="relative bg-white rounded-2xl shadow-[0_2px_10px_rgba(17,42,67,0.06)] border border-stone-100 w-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 150, damping: 20, delay: index * 0.15 }}
    >
      <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />

      <FloralSpray
        className="absolute top-1 right-0 w-28 opacity-75"
        mirrored
        variant="sprig"
      />

      <div className="relative flex flex-col flex-1 p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-full border border-gold-500/50 shrink-0 ${accent.chip}`}
          >
            <VenueIcon className={accent.icon} size={21} strokeWidth={1.5} />
          </span>
          <h3 className="font-heading text-2xl sm:text-[1.65rem] font-medium text-stone-800">
            {event.title}
          </h3>
        </div>

        <div className="flex flex-col gap-3.5 mt-5 text-stone-600">
          <div className="flex items-start gap-3">
            <Calendar className={`mt-0.5 shrink-0 ${accent.icon}`} size={18} strokeWidth={1.5} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Día</p>
              <p className="text-[15px] first-letter:uppercase">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <VenueIcon className={`mt-0.5 shrink-0 ${accent.icon}`} size={18} strokeWidth={1.5} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Lugar</p>
              <p className="text-[15px] font-medium text-stone-700">{event.venueName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className={`mt-0.5 shrink-0 ${accent.icon}`} size={18} strokeWidth={1.5} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Dirección</p>
              <p className="text-[15px]">{event.address}</p>
            </div>
          </div>
        </div>

        {/* The primary action gets its own row: three buttons abreast do not
            fit at tablet width, where the grid is already two columns. */}
        <div className="mt-auto pt-7 flex flex-col gap-2.5">
          {event.id === 'celebracion' && (
            <button
              type="button"
              onClick={handleRsvp}
              className="w-full py-3 px-4 bg-terra-500 text-white rounded-lg font-medium hover:bg-terra-600 transition shadow-[0_2px_8px_rgba(173,85,49,0.28)]"
            >
              Confirmar asistencia
            </button>
          )}
          <div className="flex gap-2.5">
            <button type="button" onClick={handleAgendar} className={secondaryButton}>
              Agendar
            </button>
            <button type="button" onClick={handleMaps} className={secondaryButton}>
              ¿Cómo llegar?
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
