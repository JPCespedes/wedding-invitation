import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

export function Gallery() {
  const { gallery, gallerySubtitle } = invitationData
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const galleryIndex = useAppStore((s) => s.galleryIndex)
  const closeModal = useAppStore((s) => s.closeModal)

  const isLightboxOpen = openModalId === 'gallery' && galleryIndex !== null
  const currentImage = galleryIndex !== null ? gallery[galleryIndex] : null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (galleryIndex === null) return
    const next = galleryIndex === 0 ? gallery.length - 1 : galleryIndex - 1
    openModal('gallery', { galleryIndex: next })
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (galleryIndex === null) return
    const next = galleryIndex === gallery.length - 1 ? 0 : galleryIndex + 1
    openModal('gallery', { galleryIndex: next })
  }

  return (
    <section id="gallery" className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-2">
            Retratos de Nuestro Amor
          </h2>
          <p className="text-stone-500 italic">{gallerySubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gallery.map((img, index) => (
            <motion.button
              key={img.id}
              type="button"
              className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openModal('gallery', { galleryIndex: index })}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/f5f5f4/78716c?text=Foto'
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen && currentImage && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Anterior"
              >
                ‹
              </button>
              <motion.img
                key={currentImage.id}
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-h-[85vh] max-w-full object-contain rounded-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Siguiente"
              >
                ›
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
