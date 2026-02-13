import { motion } from 'framer-motion'
import { Music, Shirt, Info } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

const { party, googleForms } = invitationData

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

export function PartySection() {
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const closeModal = useAppStore((s) => s.closeModal)

  const songFormUrl = googleForms.songFormUrl

  return (
    <section id="party" className="py-16 px-6 bg-stone-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
            className="bg-white rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <Music className="shrink-0 text-stone-400 mt-1" size={22} />
              <div>
                <h3 className="font-heading text-lg text-stone-800 mb-2">
                  Música
                </h3>
                <p className="text-stone-600 text-sm mb-4">{party.songPrompt}</p>
                <a
                  href={songFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 px-4 border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50"
                >
                  Sugerir canción
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            className="bg-white rounded-xl shadow-sm border border-stone-100 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

      {/* Modales */}
      {openModalId === 'dressCode' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ModalContent title="Dress Code" onClose={closeModal}>
              {party.dressCodeLong}
            </ModalContent>
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
              {party.tips}
            </ModalContent>
          </motion.div>
        </div>
      )}
    </section>
  )
}
