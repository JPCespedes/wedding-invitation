import { motion } from 'framer-motion'
import { Gift, Copy, Check, Calendar, Music, Linkedin, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { invitationData } from '../data/invitation'
import { getGoogleCalendarUrl, downloadIcs } from '../utils/calendarLinks'
import { submitSongSuggestion } from '../features/rsvp/useGoogleFormSubmit'
import { RsvpCta } from '../features/rsvp/RsvpCta'
import { FaqSection } from './FaqSection'
import { SectionHeading } from './SectionHeading'
import { FloralSpray } from './ornaments/FloralSpray'
import { Rings } from './ornaments/Rings'

type AccountKey = 'bac' | 'iban' | 'bacUsd' | 'ibanUsd' | 'sinpe'
type Account = { key: AccountKey; label: string; value: string }

export function Footer() {
  const [copied, setCopied] = useState<AccountKey | null>(null)
  const [showSongModal, setShowSongModal] = useState(false)
  const [songName, setSongName] = useState('')
  const [suggestedBy, setSuggestedBy] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [songSent, setSongSent] = useState(false)

  const { gifts, couple, events } = invitationData
  const ceremonia = events.find((e) => e.id === 'ceremonia')!
  const celebracion = events.find((e) => e.id === 'celebracion')!

  const accountGroups: { currency: string; accounts: Account[] }[] = [
    {
      currency: 'Colones',
      accounts: [
        { key: 'bac', label: 'Cuenta BAC', value: gifts.accountBAC },
        { key: 'iban', label: 'IBAN', value: gifts.accountIBAN },
      ],
    },
    {
      currency: 'Dólares',
      accounts: [
        { key: 'bacUsd', label: 'Cuenta BAC', value: gifts.accountBACUsd },
        { key: 'ibanUsd', label: 'IBAN', value: gifts.accountIBANUsd },
      ],
    },
  ]
  const sinpe: Account = { key: 'sinpe', label: 'Sinpe Móvil', value: gifts.sinpeMovil }

  const renderAccount = ({ key, label, value }: Account) => (
    <button
      key={key}
      type="button"
      onClick={() => copyToClipboard(value, key)}
      className="flex items-center justify-between gap-3 text-left bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 hover:bg-terra-50 hover:border-gold-500/40 transition"
    >
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] uppercase tracking-[0.12em] text-stone-400">
          {label}
        </span>
        <span className="font-heading text-[17px] tracking-[0.04em] text-stone-800 truncate">
          {value}
        </span>
      </span>
      {copied === key ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-terra-600 shrink-0">
          <Check size={16} />
          Copiado
        </span>
      ) : (
        <Copy size={18} className="text-terra-500 shrink-0" strokeWidth={1.5} />
      )}
    </button>
  )

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

  const copyToClipboard = async (value: string, key: AccountKey) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard can be blocked; the number stays visible and selectable.
    }
  }

  const footerChip =
    'inline-flex items-center justify-center gap-1.5 py-2.5 px-2 border border-dusty-500/30 bg-white/70 text-dusty-600 rounded-lg text-xs font-medium whitespace-nowrap hover:bg-white transition lg:flex-1'

  return (
    <>
      {/* ── Regalos ─────────────────────────────────────────────── */}
      <section
        id="gifts"
        className="relative py-16 sm:py-20 px-5 sm:px-6 bg-stone-50 overflow-hidden paper-grain"
      >
        <FloralSpray className="absolute -top-4 -left-7 w-36 sm:w-48" variant="sprig" />

        <div className="relative max-w-xl md:max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Gracias por tanto"
            title="Regalos"
            subtitle="Con tenerte ahí ya nos basta y nos sobra, pero cualquier muestra de cariño nos llega al corazón."
            className="mb-8"
          />

          <motion.div
            className="relative bg-white border border-gold-500/45 rounded-2xl p-6 sm:p-7 shadow-[0_3px_14px_rgba(17,42,67,0.07)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            <div className="absolute inset-[6px] border border-gold-500/20 rounded-xl pointer-events-none" />

            <div className="relative flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-terra-50 border border-gold-500/50 shrink-0">
                  <Gift className="text-terra-500" size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-heading text-lg font-medium text-stone-800 leading-snug">
                    {gifts.holder}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-stone-400">
                    {gifts.bank}
                  </p>
                </div>
              </div>

              {/* Una columna por moneda en desktop; en mobile se apilan. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
                {accountGroups.map(({ currency, accounts }) => (
                  <div key={currency} className="flex flex-col gap-2.5">
                    <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-terra-500">
                      {currency}
                      <span className="flex-1 h-px bg-gradient-to-r from-gold-500/40 to-transparent" />
                    </p>
                    {accounts.map(renderAccount)}
                  </div>
                ))}
              </div>

              {renderAccount(sinpe)}
            </div>
          </motion.div>
        </div>
      </section>

      <FaqSection />

      {/* ── Cierre ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 px-5 sm:px-6 bg-stone-200 overflow-hidden paper-grain">
        <FloralSpray className="absolute -top-5 -left-7 w-40 sm:w-52" />

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="font-script text-5xl sm:text-6xl md:text-7xl text-stone-800 leading-[1.06]">
              {couple.groomName} &amp; {couple.brideName}
            </p>
            <div className="flex items-center gap-3.5 mt-4">
              <span className="block w-10 h-px bg-gradient-to-r from-transparent to-gold-500 md:hidden" />
              <Rings className="w-11 h-6" />
              <span className="block w-10 h-px bg-gradient-to-r from-gold-500 to-transparent md:hidden" />
            </div>
            <p className="font-heading text-lg uppercase tracking-[0.26em] pl-[0.26em] text-stone-600 mt-3.5">
              29 · Enero · 2027
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <RsvpCta variant="footer" />
            {/* Either one row or a stack, both flush with the button above: three
                abreast only fit once the column reaches ~460px (lg). */}
            <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
              <button
                type="button"
                onClick={() => setShowSongModal(true)}
                className={footerChip}
              >
                <Music size={15} />
                Sugerir canción
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(getGoogleCalendarUrl(celebracion), '_blank')
                  downloadIcs(celebracion)
                }}
                className={footerChip}
              >
                <Calendar size={15} />
                Agendar celebración
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(getGoogleCalendarUrl(ceremonia), '_blank')
                  downloadIcs(ceremonia)
                }}
                className={footerChip}
              >
                <Calendar size={15} />
                Agendar ceremonia
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Créditos ────────────────────────────────────────────── */}
      <section className="py-9 px-6 bg-dusty-600">
        <motion.div
          className="flex flex-col items-center justify-center gap-2.5 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-script text-3xl leading-none text-white/70" aria-hidden>
            P&amp;M
          </span>
          <p className="text-white/90 text-sm">
            Built with code, coffee &amp; AI · Pablo Cespedes
          </p>
          <a
            href="https://www.linkedin.com/in/jose-pablo-cespedes-castro-640242ba/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <Linkedin size={18} className="shrink-0" strokeWidth={2} />
            <span className="leading-none">LinkedIn</span>
          </a>
        </motion.div>
      </section>

      {/* ── Modal: sugerir canción ──────────────────────────────── */}
      <AnimatePresence>
        {showSongModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-stone-900/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSongModal(false)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gold-500/40"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-2xl font-medium text-stone-800">
                  Sugerir canción
                </h3>
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
                  <div className="w-14 h-14 rounded-full bg-terra-50 border border-gold-500/50 flex items-center justify-center mx-auto mb-3">
                    <Check className="text-terra-500" size={28} />
                  </div>
                  <p className="text-stone-700 font-medium">¡Canción agregada!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSongSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="footerSongName"
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      Canción *
                    </label>
                    <input
                      id="footerSongName"
                      type="text"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                      placeholder="Nombre de la canción - Artista"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-gold-100 focus:border-gold-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="footerSuggestedBy"
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      Tu nombre (opcional)
                    </label>
                    <input
                      id="footerSuggestedBy"
                      type="text"
                      value={suggestedBy}
                      onChange={(e) => setSuggestedBy(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-gold-100 focus:border-gold-500 outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending || !songName.trim()}
                    className="w-full py-3 px-4 bg-terra-500 text-white rounded-lg font-medium hover:bg-terra-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </>
  )
}
