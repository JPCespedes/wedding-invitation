import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { invitationData } from '../data/invitation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function Hero() {
  const { groomName, brideName, dateISO, quote } = invitationData.couple
  const date = new Date(dateISO)
  const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es })

  const scrollToContent = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <p className="text-stone-400 text-sm uppercase tracking-[0.3em] mb-4">
          {formattedDate}
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-stone-800 mb-6">
          {groomName} & {brideName}
        </h1>
        <p className="text-stone-500 italic text-lg md:text-xl mb-12 font-heading">
          {quote}
        </p>
        <motion.button
          type="button"
          onClick={scrollToContent}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 transition"
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
