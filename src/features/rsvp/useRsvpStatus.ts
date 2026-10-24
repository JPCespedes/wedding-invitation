import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

/**
 * Estado del RSVP de la invitación abierta, compartido por toda la página: el
 * botón de confirmar, la sección de invitados y el modal leen de aquí, así que
 * en cuanto alguien guarda una respuesta los tres se actualizan juntos.
 *
 * `isLoaded` existe para no mostrar «Confirmar asistencia» mientras todavía se
 * está consultando: a quien ya confirmó le parpadearía el estado equivocado.
 */
export function useRsvpStatus() {
  const { codigo } = useParams()
  const [searchParams] = useSearchParams()

  // El código viaja en la ruta («/cami-andres»), que es la forma que se
  // reparte. Se sigue aceptando «?invitacion=cami-andres» porque es el formato
  // con el que salieron los primeros links y esos ya están en manos de la gente.
  const code = (codigo ?? searchParams.get('invitacion'))?.toLowerCase().trim() || null

  const confirmedGuests = useAppStore((s) => s.confirmedGuests)
  const rsvpStatus = useAppStore((s) => s.rsvpStatus)
  const loadRsvp = useAppStore((s) => s.loadRsvp)

  useEffect(() => {
    if (code) loadRsvp(code)
  }, [code, loadRsvp])

  return {
    code,
    confirmedGuests,
    isConfirmed: confirmedGuests !== null,
    // Sin código no hay nada que consultar: quien llega sin link no se queda
    // esperando un estado que nunca va a cargar.
    isLoaded: code === null || rsvpStatus === 'loaded',
  }
}

/** «2 de 3 personas asisten», para los resúmenes de una respuesta ya guardada. */
export function describeAttendance(guests: GuestsLike): string {
  const total = guests.length
  const attending = guests.filter((g) => g.attending).length

  if (attending === 0) return 'Nadie de esta invitación asiste'

  const people = `${total} persona${total !== 1 ? 's' : ''}`
  return `${attending} de ${people} asiste${attending !== 1 ? 'n' : ''}`
}

type GuestsLike = { attending: boolean }[]
