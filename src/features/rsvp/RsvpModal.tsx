import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, CalendarCheck, UserCheck, UserX, PencilLine } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { rsvpSchema, type RsvpFormValues, type GuestEntry } from './rsvpSchema'
import { saveRsvp } from './useGoogleFormSubmit'
import { useInvitation } from './useInvitation'
import { useRsvpStatus, describeAttendance } from './useRsvpStatus'

/**
 * Quién está invitado lo manda la invitación, no la respuesta anterior: si los
 * novios agregaron o quitaron a alguien desde el panel después de que esta
 * familia confirmara, la lista nueva es la que vale. De la respuesta guardada
 * solo arrastramos lo que la persona eligió, emparejando por nombre.
 */
function buildFormGuests(names: string[], saved: GuestEntry[] | null): GuestEntry[] {
  return names.map((name) => {
    const previous = saved?.find((g) => g.name === name)
    return {
      name,
      attending: previous?.attending ?? true,
      message: previous?.message ?? '',
    }
  })
}

function GuestCard({
  guest,
  index,
  onToggle,
  onMessageChange,
}: {
  guest: GuestEntry
  index: number
  onToggle: (index: number) => void
  onMessageChange: (index: number, value: string) => void
}) {
  return (
    <motion.div
      layout
      className={`rounded-xl border p-4 transition-colors ${
        guest.attending
          ? 'bg-stone-50 border-stone-200'
          : 'bg-white border-stone-100 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="font-medium text-stone-800">{guest.name}</span>
        <button
          type="button"
          onClick={() => onToggle(index)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
            guest.attending
              ? 'bg-terra-500 text-white'
              : 'bg-stone-200 text-stone-500'
          }`}
        >
          {guest.attending ? (
            <>
              <UserCheck size={14} />
              Asiste
            </>
          ) : (
            <>
              <UserX size={14} />
              No asiste
            </>
          )}
        </button>
      </div>

      {guest.attending && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="text"
            value={guest.message ?? ''}
            onChange={(e) => onMessageChange(index, e.target.value)}
            placeholder="Alergias o restricciones alimentarias"
            className="w-full mt-2 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

function ConfirmedGuestList({ guests }: { guests: GuestEntry[] }) {
  const attending = guests.filter((g) => g.attending)
  const notAttending = guests.filter((g) => !g.attending)

  return (
    <div className="text-left max-w-xs mx-auto space-y-3">
      {attending.length > 0 && (
        <div className="bg-stone-50 rounded-lg p-4">
          <p className="text-xs uppercase text-stone-400 mb-2">Asisten</p>
          {attending.map((g) => (
            <div key={g.name} className="mb-1">
              <p className="text-stone-700 font-medium">{g.name}</p>
              {g.message && (
                <p className="text-stone-500 text-xs">{g.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {notAttending.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-stone-100">
          <p className="text-xs uppercase text-stone-400 mb-2">No asisten</p>
          {notAttending.map((g) => (
            <p key={g.name} className="text-stone-400 font-medium">
              {g.name}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function RsvpModal() {
  const openModal = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)
  const setConfirmedGuests = useAppStore((s) => s.setConfirmedGuests)
  const isOpen = openModal === 'rsvp'

  const { code, confirmedGuests, isConfirmed, isLoaded } = useRsvpStatus()
  const { invitation, isLoading: isLoadingInvitation } = useInvitation(code)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState<'created' | 'updated' | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { handleSubmit, control, setValue, watch, reset } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guests: [], invitationCode: code ?? '' },
  })

  const { fields } = useFieldArray({ control, name: 'guests' })
  const guests = watch('guests')

  const toggleAttending = (index: number) => {
    const current = guests[index]
    setValue(`guests.${index}.attending`, !current.attending)
    if (current.attending) {
      setValue(`guests.${index}.message`, '')
    }
  }

  const updateMessage = (index: number, value: string) => {
    setValue(`guests.${index}.message`, value)
  }

  const isReady = isLoaded && !isLoadingInvitation

  // Cada apertura empieza limpia: quien ya confirmó ve primero su respuesta, y
  // quien no, el formulario con todos marcados como asistentes.
  useEffect(() => {
    if (!isOpen || !isReady) return

    setSaved(null)
    setSubmitError(null)
    setIsEditing(!isConfirmed)

    if (invitation?.guests?.length) {
      setValue('guests', buildFormGuests(invitation.guests, confirmedGuests))
      setValue('invitationCode', code ?? '')
    }
    // `confirmedGuests` queda fuera a propósito: al guardar cambia y volvería a
    // reiniciar el formulario encima de la pantalla de éxito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isReady])

  const startEditing = () => {
    setSubmitError(null)
    if (invitation?.guests?.length) {
      setValue('guests', buildFormGuests(invitation.guests, confirmedGuests))
    }
    setIsEditing(true)
  }

  const onSubmit = async (values: RsvpFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const wasConfirmed = isConfirmed
    const result = await saveRsvp(values)
    setIsSubmitting(false)

    if (result.success) {
      // El store es lo que leen el botón de la página y la lista de invitados,
      // así que la invitación entera refleja el cambio sin recargar.
      setConfirmedGuests(values.guests)
      setSaved(wasConfirmed ? 'updated' : 'created')
      setTimeout(closeModal, 2500)
      return
    }

    // Si falla, la respuesta anterior sigue intacta en la base: el upsert no
    // llegó a escribir nada, así que basta con reintentar.
    setSubmitError('Hubo un error al enviar. Por favor intentá de nuevo.')
  }

  const attendingCount = guests.filter((g) => g.attending).length

  const renderContent = () => {
    if (!isReady) {
      return (
        <div className="py-12 flex flex-col items-center">
          <Loader2 size={32} className="animate-spin text-stone-400 mb-4" />
          <p className="text-stone-500">Verificando invitación...</p>
        </div>
      )
    }

    if (saved) {
      return (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-terra-50 flex items-center justify-center mx-auto mb-4">
            <Check className="text-terra-600" size={32} />
          </div>
          <h3 className="font-heading text-xl text-stone-800 mb-2">
            {saved === 'updated' ? '¡Respuesta actualizada!' : '¡Confirmado!'}
          </h3>
          <p className="text-stone-600">
            {saved === 'updated'
              ? 'Guardamos tu cambio. Podés volver a modificarlo cuando quieras.'
              : 'Gracias por confirmar. ¡Los esperamos!'}
          </p>
        </motion.div>
      )
    }

    // Respuesta ya guardada: primero se muestra, y solo se entra a editar a
    // propósito. Así nadie sobrescribe lo que había sin haberlo visto antes.
    if (isConfirmed && confirmedGuests && !isEditing) {
      return (
        <motion.div
          className="py-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-terra-50 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="text-terra-600" size={32} />
          </div>
          <h3 className="font-heading text-xl text-stone-800 mb-1">
            Tu asistencia ya está confirmada
          </h3>
          <p className="text-stone-500 text-sm mb-5">
            {describeAttendance(confirmedGuests)}. Esto es lo que nos enviaste:
          </p>

          <ConfirmedGuestList guests={confirmedGuests} />

          {submitError && (
            <p className="text-sm text-rose-600 mt-4">{submitError}</p>
          )}

          <div className="flex flex-col gap-2 mt-6">
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-terra-500 text-white rounded-lg font-medium hover:bg-terra-600 transition"
            >
              <PencilLine size={17} />
              Modificar respuesta
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="py-2.5 px-8 text-stone-500 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      )
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 id="rsvp-title" className="text-xl font-heading font-semibold text-stone-800">
            {isConfirmed ? 'Modificar respuesta' : 'Confirmar asistencia'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {!invitation ? (
          <div className="py-4">
            <p className="text-stone-600 text-center">
              Para confirmar asistencia, entrá con el link que te enviamos en tu invitación.
            </p>
            <button
              type="button"
              onClick={closeModal}
              className="w-full mt-6 py-3 px-4 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <p className="text-xs text-stone-500 mb-1">
              {isConfirmed
                ? 'Cambiá lo que necesités y guardá: reemplaza la respuesta anterior.'
                : 'Indicá quién asiste y dejá un mensaje individual si es necesario.'}
            </p>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <GuestCard
                  key={field.id}
                  guest={guests[index]}
                  index={index}
                  onToggle={toggleAttending}
                  onMessageChange={updateMessage}
                />
              ))}
            </div>

            <div className="text-center text-xs text-stone-400 pt-1">
              {attendingCount} de {guests.length} persona
              {guests.length !== 1 ? 's' : ''} asiste{attendingCount !== 1 ? 'n' : ''}
            </div>

            {submitError && (
              <p className="text-sm text-rose-600 text-center">{submitError}</p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-terra-500 text-white rounded-lg font-medium hover:bg-terra-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : isConfirmed ? (
                  'Guardar cambios'
                ) : (
                  'Confirmar asistencia'
                )}
              </button>

              {isConfirmed && (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError(null)
                    setIsEditing(false)
                  }}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-stone-500 rounded-lg text-sm font-medium hover:bg-stone-100 transition disabled:opacity-60"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </>
    )
  }

  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // Al cerrarse se suelta el formulario, para que la próxima apertura lo
  // reconstruya desde la respuesta vigente y no desde lo que quedó a medias.
  useEffect(() => {
    if (!isOpen) reset({ guests: [], invitationCode: code ?? '' })
  }, [isOpen, reset, code])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
