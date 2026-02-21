import { motion } from 'framer-motion'
import { Gift, Copy, Check, Calendar, Music, CheckCircle, Linkedin, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'
import { getGoogleCalendarUrl, downloadIcs } from '../utils/calendarLinks'
import { submitSongSuggestion } from '../features/rsvp/useGoogleFormSubmit'

export function Footer() {
  const [copied, setCopied] = useState<'bac' | 'iban' | 'sinpe' | null>(null)
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)
  const [showSongModal, setShowSongModal] = useState(false)
  const [songName, setSongName] = useState('')
  const [suggestedBy, setSuggestedBy] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [songSent, setSongSent] = useState(false)

  const { gifts, couple, events } = invitationData
  const ceremonia = events.find((e) => e.id === 'ceremonia')!
  const celebracion = events.find((e) => e.id === 'celebracion')!

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!songName.trim()) return
    setIsSending(true)
    const result = await submitSongSuggestion(songName.trim(), suggestedBy.trim())
    setIsSending(false)
    if (result.success) {
      setSongSent(true)
      setTimeout(() => {
        setShowSongModal(false)
        setSongName('')
        setSuggestedBy('')
        setSongSent(false)
      }, 2000)
    }
  }

  const copyToClipboard = async (value: string, key: 'bac' | 'iban' | 'sinpe') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <>
      <section id="gifts" className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-4">
              Regalos
            </h2>
            <p className="text-stone-600 mb-6">
              Si deseas regalarnos algo más que tu hermosa presencia...
            </p>
            <button
              type="button"
              onClick={() => openModal('gifts')}
              className="inline-flex items-center gap-2 py-2 px-4 border border-stone-200 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
            >
              <Gift size={18} />
              Ver más
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <p className="font-heading text-4xl md:text-5xl text-stone-800 text-center md:text-left">
            {couple.groomName} & {couple.brideName}
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <button
                type="button"
                onClick={() => openModal('rsvp', { eventId: 'celebracion' })}
                className="inline-flex items-center gap-2 py-2.5 px-4 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
              >
                <CheckCircle size={18} />
                Confirmar asistencia a celebración
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setShowSongModal(true)}
                className="inline-flex items-center gap-2 py-2.5 px-4 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
              >
                <Music size={18} />
                Sugerir canción
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  window.open(getGoogleCalendarUrl(celebracion), '_blank')
                  downloadIcs(celebracion)
                }}
                className="inline-flex items-center gap-2 py-2.5 px-4 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
              >
                <Calendar size={18} />
                Agendar celebración
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  window.open(getGoogleCalendarUrl(ceremonia), '_blank')
                  downloadIcs(ceremonia)
                }}
                className="inline-flex items-center gap-2 py-2.5 px-4 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
              >
                <Calendar size={18} />
                Agendar ceremonia
              </button>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-8 px-6 bg-white">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-stone-600 text-sm inline-flex items-center justify-center gap-2 flex-wrap">
            Built with code, coffee & AI · Pablo Cespedes
            <span className="inline-flex items-center gap-1.5" aria-hidden>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/14/Escudo_Saprissa_2012.svg"
              alt="Saprissa"
              className="w-7 h-7 object-contain"
              style={{ imageRendering: 'crisp-edges' }}
              title="Saprissa"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/sco/7/7a/Manchester_United_FC_crest.svg"
              alt="Manchester United"
              className="w-7 h-7 object-contain"
              style={{ imageRendering: 'crisp-edges' }}
              title="Manchester United"
            />
            </span>
          </p>
          <a
            href="https://www.linkedin.com/in/jose-pablo-cespedes-castro-640242ba/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm transition-colors"
          >
            <Linkedin size={18} className="shrink-0" strokeWidth={2} />
            <span className="leading-none">LinkedIn</span>
          </a>
        </div>
      </section>

      <AnimatePresence>
        {showSongModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSongModal(false)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-xl text-stone-800">Sugerir canción</h3>
                <button
                  type="button"
                  onClick={() => setShowSongModal(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
              {songSent ? (
                <motion.div
                  className="py-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                    <Check className="text-stone-700" size={28} />
                  </div>
                  <p className="text-stone-700 font-medium">¡Canción agregada!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSongSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="footerSongName" className="block text-sm font-medium text-stone-700 mb-1">
                      Canción *
                    </label>
                    <input
                      id="footerSongName"
                      type="text"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                      placeholder="Nombre de la canción - Artista"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="footerSuggestedBy" className="block text-sm font-medium text-stone-700 mb-1">
                      Tu nombre (opcional)
                    </label>
                    <input
                      id="footerSuggestedBy"
                      type="text"
                      value={suggestedBy}
                      onChange={(e) => setSuggestedBy(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending || !songName.trim()}
                    className="w-full py-3 px-4 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar sugerencia'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {openModalId === 'gifts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="font-heading text-xl text-stone-800 mb-4">Regalos</h3>
            <p className="text-stone-600 text-sm whitespace-pre-line mb-6">
              {gifts.text}
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <button
                type="button"
                onClick={() => copyToClipboard(gifts.accountBAC, 'bac')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-stone-200 rounded-lg text-stone-700 text-sm hover:bg-stone-50 transition"
              >
                {copied === 'bac' ? (
                  <>
                    <Check size={18} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar cuenta BAC
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(gifts.accountIBAN, 'iban')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-stone-200 rounded-lg text-stone-700 text-sm hover:bg-stone-50 transition"
              >
                {copied === 'iban' ? (
                  <>
                    <Check size={18} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar cuenta IBAN
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(gifts.sinpeMovil, 'sinpe')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-stone-200 rounded-lg text-stone-700 text-sm hover:bg-stone-50 transition"
              >
                {copied === 'sinpe' ? (
                  <>
                    <Check size={18} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar Sinpe Móvil
                  </>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="w-full py-2.5 px-4 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}
