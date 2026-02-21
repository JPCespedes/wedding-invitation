import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Shirt, Info, X, Loader2, Check } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'
import { submitSongSuggestion } from '../features/rsvp/useGoogleFormSubmit'

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [locked])
}

const { party } = invitationData

function ModalContent({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="p-6">
      <h3 className="font-heading text-xl text-stone-800 mb-4">{title}</h3>
      <div className="text-stone-600 whitespace-pre-line">{children}</div>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 py-2 px-4 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700"
      >
        Cerrar
      </button>
    </div>
  )
}

function SongModal({ onClose }: { onClose: () => void }) {
  const [songName, setSongName] = useState('')
  const [suggestedBy, setSuggestedBy] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!songName.trim()) return

    setIsSubmitting(true)
    const result = await submitSongSuggestion(songName.trim(), suggestedBy.trim())
    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-xl text-stone-800">Sugerir canción</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      {submitted ? (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="songName" className="block text-sm font-medium text-stone-700 mb-1">
              Canción *
            </label>
            <input
              id="songName"
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="Nombre de la canción - Artista"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="suggestedBy" className="block text-sm font-medium text-stone-700 mb-1">
              Tu nombre (opcional)
            </label>
            <input
              id="suggestedBy"
              type="text"
              value={suggestedBy}
              onChange={(e) => setSuggestedBy(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !songName.trim()}
            className="w-full py-3 px-4 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
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
    </div>
  )
}

export function PartySection() {
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)

  const [showSongModal, setShowSongModal] = useState(false)

  useBodyScrollLock(openModalId === 'dressCode' || openModalId === 'tips' || showSongModal)

  return (
    <section id="party" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-4">
            Fiesta
          </h2>
          <p className="text-stone-600">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en
            cuenta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="bg-stone-50 rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0 }}
          >
            <div className="flex items-start gap-4">
              <Music className="shrink-0 text-stone-400 mt-1" size={22} />
              <div>
                <h3 className="font-heading text-lg text-stone-800 mb-2">
                  Música
                </h3>
                <p className="text-stone-600 text-sm mb-4">{party.songPrompt}</p>
                <button
                  type="button"
                  onClick={() => setShowSongModal(true)}
                  className="inline-block py-2 px-4 border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50"
                >
                  Sugerir canción
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-stone-50 rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
          >
            <div className="flex items-start gap-4">
              <Shirt className="shrink-0 text-stone-400 mt-1" size={22} />
              <div>
                <h3 className="font-heading text-lg text-stone-800 mb-2">
                  Dress Code
                </h3>
                <p className="text-stone-600 text-sm mb-4">
                  {party.dressCodeShort}
                </p>
                <button
                  type="button"
                  onClick={() => openModal('dressCode')}
                  className="text-stone-600 text-sm underline hover:text-stone-800"
                >
                  Ver más
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-stone-50 rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <Info className="shrink-0 text-stone-400 mt-1" size={22} />
              <div>
                <h3 className="font-heading text-lg text-stone-800 mb-2">
                  Tips y Notas
                </h3>
                <p className="text-stone-600 text-sm">
                  Información adicional para tener en cuenta.
                </p>
                <button
                  type="button"
                  onClick={() => openModal('tips')}
                  className="mt-2 text-stone-600 text-sm underline hover:text-stone-800"
                >
                  + Info
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Song suggestion modal */}
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
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SongModal onClose={() => setShowSongModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dress code & tips modals */}
      {openModalId === 'dressCode' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-stone-100 px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="font-heading text-xl text-stone-800">Dress Code</h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">

              <p className="text-stone-600 text-sm mb-6">{party.dressCodeLong}</p>

              <div className="mb-6">
                <h4 className="font-heading text-sm uppercase tracking-wide text-stone-500 mb-3">
                  Paleta de colores
                </h4>
                <div className="flex gap-2 justify-center">
                  {['#F7F2ED', '#EDE5DB', '#DDD0C3', '#C4AA8C', '#B09A82', '#8B7560', '#7A5F3A'].map((color) => (
                    <div
                      key={color}
                      className="w-10 h-10 rounded-full border border-stone-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-stone-400 text-xs text-center mt-2 italic">
                  Tonos neutros, cálidos y tierra
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-heading text-sm uppercase tracking-wide text-stone-500 mb-3">
                  Mujeres
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop"
                    alt="Vestido elegante 1"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop"
                    alt="Vestido elegante 2"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop"
                    alt="Vestido elegante 3"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-heading text-sm uppercase tracking-wide text-stone-500 mb-3">
                  Hombres
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73b4177fef0?w=300&h=400&fit=crop"
                    alt="Traje elegante 1"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&h=400&fit=crop"
                    alt="Traje elegante 2"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop"
                    alt="Traje elegante 3"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-full py-2.5 px-4 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {openModalId === 'tips' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ModalContent title="Tips y Notas" onClose={closeModal}>
              <ul className="space-y-3 text-stone-600 text-sm list-none">
                {party.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </ModalContent>
          </motion.div>
        </div>
      )}
    </section>
  )
}
