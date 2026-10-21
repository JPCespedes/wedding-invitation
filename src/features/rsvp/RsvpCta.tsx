import { CheckCircle, PencilLine } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useRsvpStatus, describeAttendance } from './useRsvpStatus'

/**
 * La llamada a confirmar, en sus dos estados. Vive en un solo componente
 * porque aparece en la tarjeta de la celebración y en el cierre de la página:
 * si cada sitio lo resolviera por su cuenta, uno acabaría diciendo «Confirmar
 * asistencia» a alguien que ya confirmó.
 *
 * Una vez confirmada, el botón deja de ser una llamada a la acción y pasa a ser
 * un acuse de recibo: dice que la respuesta está registrada, resume lo que se
 * respondió y ofrece cambiarla, que es lo que de verdad hace falta a partir de
 * ese momento.
 */
export function RsvpCta({ variant = 'card' }: { variant?: 'card' | 'footer' }) {
  const openModal = useAppStore((s) => s.openModalAction)
  const { confirmedGuests, isConfirmed, isLoaded } = useRsvpStatus()

  const open = () => openModal('rsvp', { eventId: 'celebracion' })

  if (isConfirmed && confirmedGuests) {
    return (
      <button
        type="button"
        onClick={open}
        className="w-full text-left rounded-lg border border-terra-200 bg-terra-50 px-4 py-3 transition hover:bg-terra-100/60 hover:border-terra-300"
      >
        {/* El título ocupa su propia fila: compartiéndola con «Modificar» se
            parte en dos líneas en pantallas de teléfono. */}
        <span className="flex items-center gap-2 text-sm font-medium text-terra-700">
          <CheckCircle size={17} className="shrink-0" strokeWidth={1.8} />
          Asistencia confirmada
        </span>
        <span className="flex items-center justify-between gap-3 mt-1">
          <span className="text-xs text-stone-500">
            {describeAttendance(confirmedGuests)}
          </span>
          <span className="flex items-center gap-1 text-xs text-terra-600 shrink-0">
            <PencilLine size={13} />
            Modificar
          </span>
        </span>
      </button>
    )
  }

  const label =
    variant === 'footer' ? 'Confirmar asistencia a celebración' : 'Confirmar asistencia'

  return (
    <button
      type="button"
      onClick={open}
      // Mientras se consulta el estado el botón sigue siendo pulsable: el modal
      // también espera la respuesta, así que nadie llega a una pantalla errónea.
      aria-busy={!isLoaded}
      className={
        variant === 'footer'
          ? 'inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-terra-500 text-white rounded-lg text-sm font-medium hover:bg-terra-600 transition shadow-[0_2px_8px_rgba(173,85,49,0.3)]'
          : 'w-full py-3 px-4 bg-terra-500 text-white rounded-lg font-medium hover:bg-terra-600 transition shadow-[0_2px_8px_rgba(173,85,49,0.28)]'
      }
    >
      {variant === 'footer' && <CheckCircle size={18} />}
      {label}
    </button>
  )
}
