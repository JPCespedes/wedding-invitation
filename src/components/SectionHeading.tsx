import { motion } from 'framer-motion'
import { LeafRule } from './ornaments/LeafRule'

interface SectionHeadingProps {
  /** Small letterspaced line above the title. */
  eyebrow?: string
  title: string
  /** Italic line under the rule. */
  subtitle?: string
  /** 'script' for Great Vibes, 'serif' for Cormorant — use serif when the
   *  title is a full sentence rather than a one-word section name. */
  face?: 'script' | 'serif'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  face = 'script',
  className = '',
}: SectionHeadingProps) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.3em] text-terra-400">
          {eyebrow}
        </p>
      )}

      <h2
        className={
          face === 'script'
            ? 'font-script text-4xl sm:text-5xl font-normal text-stone-800 leading-tight'
            : 'font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-stone-800 leading-snug text-balance max-w-2xl'
        }
      >
        {title}
      </h2>

      <LeafRule />

      {subtitle && (
        <p className="font-heading italic font-light text-base sm:text-lg text-stone-500 text-pretty max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
