import { motion } from 'framer-motion'
import { Gift, Copy, Check, Calendar, Music, CheckCircle, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'
import { getGoogleCalendarUrl, downloadIcs } from '../utils/calendarLinks'

export function Footer() {
  const [copied, setCopied] = useState<'bac' | 'iban' | 'sinpe' | null>(null)
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)
  const { gifts, couple, events, googleForms } = invitationData
  const ceremonia = events.find((e) => e.id === 'ceremonia')!
  const celebracion = events.find((e) => e.id === 'celebracion')!
  const songFormUrl = googleForms.songFormUrl

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
              <a
                href={songFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-4 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
              >
                <Music size={18} />
                Sugerir canción
              </a>
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
