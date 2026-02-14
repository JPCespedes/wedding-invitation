import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

const SWIPE_THRESHOLD = 50
const AUTO_PLAY_INTERVAL = 5000

export function Gallery() {
  const { gallery, gallerySubtitle } = invitationData
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const galleryIndex = useAppStore((s) => s.galleryIndex)
  const closeModal = useAppStore((s) => s.closeModal)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getWrappedIndex = useCallback(
    (index: number) => ((index % gallery.length) + gallery.length) % gallery.length,
    [gallery.length],
  )

  const paginate = useCallback(
    (dir: number) => {
      setCurrentSlide((prev) => getWrappedIndex(prev + dir))
    },
    [getWrappedIndex],
  )

  // Auto-play
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => getWrappedIndex(prev + 1))
    }, AUTO_PLAY_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, getWrappedIndex])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
      else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
    },
    [paginate],
  )

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (galleryIndex === null) return
    openModal('gallery', { galleryIndex: getWrappedIndex(galleryIndex - 1) })
  }

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (galleryIndex === null) return
    openModal('gallery', { galleryIndex: getWrappedIndex(galleryIndex + 1) })
  }

  const isLightboxOpen = openModalId === 'gallery' && galleryIndex !== null
  const currentImage = galleryIndex !== null ? gallery[galleryIndex] : null

  const prevIndex = getWrappedIndex(currentSlide - 1)
  const nextIndex = getWrappedIndex(currentSlide + 1)

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <section id="gallery" className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
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

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* 3 visible images */}
          <div className="relative flex items-center gap-3 sm:gap-4 md:gap-6">
            {/* Left image */}
            <div
              className="w-[22%] sm:w-[24%] shrink-0 cursor-pointer"
              onClick={() => paginate(-1)}
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-md border border-stone-200 p-1.5 sm:p-2 opacity-50 scale-95 hover:opacity-70 transition-all">
                <img
                  src={gallery[prevIndex].src}
                  alt={gallery[prevIndex].alt}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/400x500/f5f5f4/78716c?text=Foto'
                  }}
                />
              </div>
            </div>

            {/* Center image */}
            <div
              className="flex-1 min-w-0 cursor-grab active:cursor-grabbing"
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-xl border border-stone-200 p-2 sm:p-3 relative"
                  onClick={() => openModal('gallery', { galleryIndex: currentSlide })}
                >
                  <AnimatePresence initial={false} mode="sync">
                    <motion.img
                      key={currentSlide}
                      src={gallery[currentSlide].src}
                      alt={gallery[currentSlide].alt}
                      className="absolute inset-2 sm:inset-3 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] h-[calc(100%-1rem)] sm:h-[calc(100%-1.5rem)] object-cover rounded-lg"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      loading="lazy"
                      draggable={false}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://placehold.co/400x500/f5f5f4/78716c?text=Foto'
                      }}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Right image */}
            <div
              className="w-[22%] sm:w-[24%] shrink-0 cursor-pointer"
              onClick={() => paginate(1)}
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-md border border-stone-200 p-1.5 sm:p-2 opacity-50 scale-95 hover:opacity-70 transition-all">
                <img
                  src={gallery[nextIndex].src}
                  alt={gallery[nextIndex].alt}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/400x500/f5f5f4/78716c?text=Foto'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2.5 mt-8">
            {gallery.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`relative rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-3 h-3 bg-stone-700'
                    : 'w-3 h-3 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Ir a foto ${index + 1}`}
              >
                {/* Progress ring on active dot */}
                {index === currentSlide && !isPaused && (
                  <svg
                    className="absolute -inset-1 w-5 h-5"
                    viewBox="0 0 20 20"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-stone-300"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray={2 * Math.PI * 8}
                      className="text-stone-700 animate-progress-ring"
                      style={{
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
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
                onClick={handleLightboxPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
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
                onClick={handleLightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Siguiente"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
