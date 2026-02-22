import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, CalendarCheck, UserCheck, UserX } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { invitationData } from '../../data/invitation'
import { rsvpSchema, type RsvpFormValues, type GuestEntry } from './rsvpSchema'
import { submitRsvp, checkExistingRsvp, deleteRsvp } from './useGoogleFormSubmit'

const guestLists = invitationData.guestLists as unknown as Record<
  string,
  { guests: string[] }
>

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
              ? 'bg-stone-700 text-white'
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
            <p key={g.name} className="text-stone-400 font-medium">{g.name}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export function RsvpModal() {
  const [searchParams] = useSearchParams()
  const openModal = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)
  const setStoreConfirmedGuests = useAppStore((s) => s.setConfirmedGuests)
  const isOpen = openModal === 'rsvp'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false)
  const [confirmedGuests, setConfirmedGuests] = useState<GuestEntry[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const code = searchParams.get('invitacion')?.toLowerCase().trim()
  const invitationList = code ? guestLists[code] : null

  const { handleSubmit, control, setValue, watch, reset } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guests: [],
      invitationCode: code ?? '',
    },
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

  useEffect(() => {
    if (!isOpen || !code) return

    setSubmitted(false)
    setSubmitError(null)
    setAlreadyConfirmed(false)
    setConfirmedGuests([])

    setIsChecking(true)
    checkExistingRsvp(code).then((result) => {
      setIsChecking(false)
      if (result.exists && result.guests) {
        setAlreadyConfirmed(true)
        setConfirmedGuests(result.guests)
        setStoreConfirmedGuests(result.guests)
      } else if (invitationList?.guests?.length) {
        const initial: GuestEntry[] = invitationList.guests.map((name) => ({
          name,
          attending: true,
          message: '',
        }))
        setValue('guests', initial)
        setValue('invitationCode', code)
      }
    })
  }, [isOpen, code, invitationList?.guests, setValue])

  const onSubmit = async (values: RsvpFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitRsvp(values)
    setIsSubmitting(false)

    if (result.alreadyConfirmed) {
      setAlreadyConfirmed(true)
      setConfirmedGuests(values.guests)
      setStoreConfirmedGuests(values.guests)
      return
    }

    if (result.success) {
      setSubmitted(true)
      setStoreConfirmedGuests(values.guests)
      setTimeout(() => {
        reset({ guests: [], invitationCode: '' })
        setSubmitted(false)
        closeModal()
      }, 2500)
    } else {
      setSubmitError('Hubo un error al enviar. Por favor intentá de nuevo.')
    }
  }

  const attendingCount = guests.filter((g) => g.attending).length

  const renderContent = () => {
    if (isChecking) {
      return (
        <div className="py-12 flex flex-col items-center">
          <Loader2 size={32} className="animate-spin text-stone-400 mb-4" />
          <p className="text-stone-500">Verificando invitación...</p>
        </div>
      )
    }

    if (alreadyConfirmed) {
      return (
        <motion.div
          className="py-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="text-stone-700" size={32} />
          </div>
          <h3 className="font-heading text-xl text-stone-800 mb-2">
            Invitación ya confirmada
          </h3>
          <p className="text-stone-600 mb-4">
            Esta invitación ya fue confirmada anteriormente.
          </p>
          <ConfirmedGuestList guests={confirmedGuests} />
          <div className="flex flex-col gap-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="py-3 px-8 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition"
            >
              Cerrar
            </button>
            {code === 'garcia' && (
              <button
                type="button"
                onClick={async () => {
                  if (!code) return
                  setIsSubmitting(true)
                  const result = await deleteRsvp(code)
                  setIsSubmitting(false)
                  if (result.success) {
                    setAlreadyConfirmed(false)
                    setConfirmedGuests([])
                    setStoreConfirmedGuests(null)
                    if (invitationList?.guests?.length) {
                      const initial: GuestEntry[] = invitationList.guests.map((name) => ({
                        name,
                        attending: true,
                        message: '',
                      }))
                      setValue('guests', initial)
                      setValue('invitationCode', code)
                    }
                  }
                }}
                disabled={isSubmitting}
                className="py-2 px-4 text-stone-400 text-xs hover:text-stone-600 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Eliminando...' : 'Desconfirmar (solo pruebas)'}
              </button>
            )}
          </div>
        </motion.div>
      )
    }

    if (submitted) {
      return (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Check className="text-stone-700" size={32} />
          </div>
          <h3 className="font-heading text-xl text-stone-800 mb-2">
            ¡Confirmado!
          </h3>
          <p className="text-stone-600">
            Gracias por confirmar. ¡Los esperamos!
          </p>
        </motion.div>
      )
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 id="rsvp-title" className="text-xl font-heading font-semibold text-stone-800">
            Confirmar asistencia
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

        {!invitationList ? (
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
              Indicá quién asiste y dejá un mensaje individual si es necesario.
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
              {attendingCount} de {guests.length} persona{guests.length !== 1 ? 's' : ''} asiste{attendingCount !== 1 ? 'n' : ''}
            </div>

            {submitError && (
              <p className="text-sm text-rose-600 text-center">{submitError}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Confirmar asistencia'
                )}
              </button>
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
    return () => { document.body.style.overflow = original }
  }, [isOpen])

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
