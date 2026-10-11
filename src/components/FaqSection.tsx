import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { FloralSpray } from './ornaments/FloralSpray'

const faqs = [
  {
    question: '¿Puedo llevar acompañante?',
    answer:
      'Nos encantaría poder recibir a todos, pero lamentablemente el cupo es limitado. Las invitaciones fueron pensadas con mucho cariño para cada persona, así que agradecemos tu comprensión.',
  },
  {
    question: '¿Puedo traspasar mi entrada a otra persona?',
    answer:
      'Cada invitación fue hecha especialmente para vos. Si por alguna razón no podés asistir, te pedimos que nos avises, pero no es posible transferirla a alguien más.',
  },
  {
    question: '¿Hay descorche?',
    answer:
      'Sí, el lugar ofrece servicio de descorche. Así que si querés llevar algo especial para brindar, ¡sentite en confianza! Solo recordá disfrutar con responsabilidad.',
  },
  {
    question: '¿Hay parqueo disponible?',
    answer:
      'Sí, el lugar tiene estacionamiento. Eso sí, si planeás brindar y celebrar como se debe, mejor dejá el carro en casa y llegá en Uber o con un conductor designado.',
  },
  {
    question: '¿Hay after después de la boda?',
    answer:
      '¡Sí! Nuestra idea es seguir pasándola bien con los nuestros. Si querés sumarte, nos alegraría mucho que formes parte. Los detalles los compartiremos más adelante.',
  },
]

function FaqItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      className={`border-b border-stone-200 last:border-b-0 rounded-lg px-4 -mx-4 transition-colors duration-300 ${
        isOpen ? 'bg-white shadow-[0_1px_6px_rgba(17,42,67,0.05)]' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring' as const, stiffness: 150, damping: 20, delay: index * 0.08 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className={`font-medium text-[15px] leading-snug transition-colors ${isOpen ? 'text-stone-900' : 'text-stone-800 group-hover:text-stone-600'}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 transition-colors ${isOpen ? 'text-terra-500' : 'text-stone-400'}`}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-stone-600 text-[13.5px] leading-relaxed pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="relative py-16 sm:py-20 px-5 sm:px-6 bg-white overflow-hidden paper-grain"
    >
      <FloralSpray className="absolute -top-3 -right-7 w-36 sm:w-44" mirrored variant="sprig" />

      <div className="relative max-w-2xl mx-auto">
        <SectionHeading
          eyebrow="Por si acaso"
          title="Preguntas frecuentes"
          subtitle="Algunas cositas que tal vez te estés preguntando"
          className="mb-9 sm:mb-10"
        />

        <div className="bg-stone-50 rounded-2xl border border-gold-500/35 shadow-[0_2px_10px_rgba(17,42,67,0.05)] px-5 sm:px-6">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              {...faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
