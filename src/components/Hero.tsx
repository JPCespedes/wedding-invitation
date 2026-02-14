import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { invitationData } from '../data/invitation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function Hero() {
  const { groomName, brideName, dateISO, quote } = invitationData.couple
  const heroImage = invitationData.gallery[0].src
  const date = new Date(dateISO)
  const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es })

  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Background moves slower than scroll (parallax)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Text fades out and moves up as user scrolls
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80])

  // Overlay gets darker as you scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 0.7])

  const scrollToContent = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          y: bgY,
          scale: bgScale,
        }}
      />
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 max-w-2xl"
      >
        <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-4">
          {formattedDate}
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white mb-6 drop-shadow-lg">
          {groomName} & {brideName}
        </h1>
        <p className="text-white/80 italic text-lg md:text-xl mb-12 font-heading drop-shadow-md">
          {quote}
        </p>
        <motion.button
          type="button"
          onClick={scrollToContent}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition"
          aria-label="Ver contenido"
          whileHover={{ y: 4 }}
        >
          <span className="text-sm">Descubre más</span>
          <ChevronDown size={20} />
        </motion.button>
      </motion.div>
    </section>
  )
}
