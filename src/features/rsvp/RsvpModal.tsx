import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserMinus, UserPlus, Check, Loader2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { invitationData } from '../../data/invitation'
import { rsvpSchema, type RsvpFormValues } from './rsvpSchema'
import { submitRsvp } from './useGoogleFormSubmit'

const guestLists = invitationData.guestLists as unknown as Record<
  string,
  { guests: string[] }
>

export function RsvpModal() {
  const [searchParams] = useSearchParams()
  const openModal = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)
  const isOpen = openModal === 'rsvp'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const code = searchParams.get('invitacion')?.toLowerCase().trim()
  const invitationList = code ? guestLists[code] : null

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      names: [],
      attending: 'Sí',
      message: '',
      invitationCode: code ?? '',
    },
  })

  const names = watch('names') ?? []
  const removedGuests = invitationList?.guests.filter((g) => !names.includes(g)) ?? []

  useEffect(() => {
    if (!isOpen || !invitationList?.guests?.length) return
    setValue('names', [...invitationList.guests])
    setValue('invitationCode', code ?? '')
    setSubmitted(false)
    setSubmitError(null)
  }, [isOpen, invitationList?.guests, setValue, code])

  const removePerson = (index: number) => {
    const current = getValues('names')
    const next = current.filter((_, i) => i !== index)
    setValue('names', next)
  }

  const addPerson = (name: string) => {
    setValue('names', [...getValues('names'), name])
  }

  const onSubmit = async (values: RsvpFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitRsvp(values)

    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        reset({ names: [], attending: 'Sí', message: '', invitationCode: '' })
        setSubmitted(false)
        closeModal()
      }, 2500)
    } else {
      setSubmitError('Hubo un error al enviar. Por favor intentá de nuevo.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 mx-4"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {submitted ? (
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
            ) : (
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Personas que asisten *
                      </label>
                      <p className="text-xs text-stone-500 mb-2">
                        Quitá a quien no vaya. Solo podés volver a agregar a alguien de la lista.
                      </p>
                      {names.map((name, index) => (
                        <div
                          key={`${name}-${index}`}
                          className="flex items-center gap-2 mb-2 py-2.5 px-4 bg-stone-50 rounded-lg border border-stone-100"
                        >
                          <span className="flex-1 font-medium text-stone-800">{name}</span>
                          <button
                            type="button"
                            onClick={() => removePerson(index)}
                            className="p-2 rounded-lg text-stone-500 hover:bg-stone-200 transition shrink-0"
                            aria-label={`Quitar a ${name}`}
                          >
                            <UserMinus size={18} />
                          </button>
                        </div>
                      ))}
                      {removedGuests.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-stone-500 mb-2">Agregar persona:</p>
                          <div className="flex flex-wrap gap-2">
                            {removedGuests.map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => addPerson(name)}
                                className="inline-flex items-center gap-1.5 py-2 px-3 border border-stone-200 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition"
                              >
                                <UserPlus size={16} />
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.names && (
                        <p className="mt-1 text-sm text-rose-600">{errors.names.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
                        Mensaje (opcional)
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition resize-none"
                        placeholder="Indicá por cada persona: nombre y si tiene alergias o restricciones alimentarias."
                      />
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
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
