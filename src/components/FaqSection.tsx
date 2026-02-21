import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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
      '¡Si Dios lo permite, sí! Queremos seguir pasándola increíble con nuestras personas más queridas. Los detalles los compartiremos más adelante.',
  },
]

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-stone-200 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring' as const, stiffness: 150, damping: 20, delay: index * 0.08 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-medium text-stone-800 group-hover:text-stone-600 transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-stone-400"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-stone-600 text-sm leading-relaxed pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-stone-500 italic">
            Algunas cositas que tal vez te estés preguntando
          </p>
        </motion.div>

        <div className="bg-stone-50 rounded-2xl border border-stone-100 shadow-sm px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} {...faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
