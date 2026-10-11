import { useState, useCallback, useEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  usePageInView,
  type PanInfo,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'
import { SectionHeading } from './SectionHeading'
import { FloralSpray } from './ornaments/FloralSpray'

const SWIPE_THRESHOLD = 50
// How long each photo stays up. The progress ring on the active dot reads
// this too, so the two can't drift apart.
const AUTO_PLAY_INTERVAL = 4000

export function Gallery() {
  const { gallery, gallerySubtitle } = invitationData
  const openModal = useAppStore((s) => s.openModalAction)
  const openModalId = useAppStore((s) => s.openModal)
  const galleryIndex = useAppStore((s) => s.galleryIndex)
  const closeModal = useAppStore((s) => s.closeModal)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Plays while the carousel overlaps the middle half of the screen. No
  // hover or touch pause on purpose: the cursor or a finger lands on the
  // photos just from scrolling to them, which used to freeze it right
  // when you stopped to look.
  const isInView = useInView(carouselRef, { margin: '-25% 0px -25% 0px' })
  const isPageVisible = usePageInView()
  const isLightboxOpen = openModalId === 'gallery' && galleryIndex !== null
  const isPlaying = isInView && isPageVisible && !isDragging && !isLightboxOpen

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

  // Auto-play. Restarts on every slide change, so a photo picked by hand
  // also gets the full interval before moving on.
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => paginate(1), AUTO_PLAY_INTERVAL)
    return () => clearTimeout(timer)
  }, [isPlaying, currentSlide, paginate])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false)
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

  const currentImage = galleryIndex !== null ? gallery[galleryIndex] : null

  const prevIndex = getWrappedIndex(currentSlide - 1)
  const nextIndex = getWrappedIndex(currentSlide + 1)

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <section
      id="gallery"
      className="relative py-16 sm:py-20 bg-terra-50 overflow-hidden paper-grain"
    >
      <FloralSpray className="absolute -bottom-4 -left-7 w-40 sm:w-52" />

      <div className="relative max-w-6xl mx-auto px-4">
        <SectionHeading
          eyebrow="Nuestra historia"
          title="Galería"
          subtitle={gallerySubtitle}
          className="mb-10 sm:mb-12"
        />

        {/* Carousel */}
        <div ref={carouselRef} className="relative">
          {/* 3 visible images */}
          <div className="relative flex items-center gap-3 sm:gap-4 md:gap-6">
            {/* Left image */}
            <div
              className="w-[22%] sm:w-[24%] shrink-0 cursor-pointer"
              onClick={() => paginate(-1)}
            >
              <div className="arch-frame aspect-[3/4] overflow-hidden bg-white shadow-md border border-gold-500/35 p-1.5 sm:p-2 opacity-50 scale-95 hover:opacity-70 transition-all">
                <img
                  src={gallery[prevIndex].src}
                  alt={gallery[prevIndex].alt}
                  className="arch-frame w-full h-full object-cover"
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
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="arch-frame aspect-[3/4] overflow-hidden bg-white shadow-xl border border-gold-500/45 p-2 sm:p-3 relative"
                  onClick={() => openModal('gallery', { galleryIndex: currentSlide })}
                >
                  <AnimatePresence initial={false} mode="sync">
                    <motion.img
                      key={currentSlide}
                      src={gallery[currentSlide].src}
                      alt={gallery[currentSlide].alt}
                      className="arch-frame absolute inset-2 sm:inset-3 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] h-[calc(100%-1rem)] sm:h-[calc(100%-1.5rem)] object-cover"
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
              <div className="arch-frame aspect-[3/4] overflow-hidden bg-white shadow-md border border-gold-500/35 p-1.5 sm:p-2 opacity-50 scale-95 hover:opacity-70 transition-all">
                <img
                  src={gallery[nextIndex].src}
                  alt={gallery[nextIndex].alt}
                  className="arch-frame w-full h-full object-cover"
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
                    ? 'w-3 h-3 bg-terra-500'
                    : 'w-3 h-3 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Ir a foto ${index + 1}`}
              >
                {/* Progress ring on active dot */}
                {index === currentSlide && isPlaying && (
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
                      className="text-terra-500 animate-progress-ring"
                      style={{
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                        animationDuration: `${AUTO_PLAY_INTERVAL}ms`,
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
