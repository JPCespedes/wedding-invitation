import { motion } from 'framer-motion'

interface SectionDividerProps {
  className?: string
}

/** Watercolour leaves flanking interlocking rings, on a gold hairline. */
export function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <motion.svg
        viewBox="0 0 240 44"
        aria-hidden
        focusable="false"
        className="w-56 h-11"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <g filter="url(#orn-paint)" style={{ mixBlendMode: 'multiply' }}>
          <ellipse cx="72" cy="22" rx="11" ry="6" className="fill-dusty-300" opacity="0.6" transform="rotate(-18 72 22)" />
          <ellipse cx="54" cy="26" rx="10" ry="5.5" className="fill-dusty-200" opacity="0.55" transform="rotate(-8 54 26)" />
          <ellipse cx="168" cy="22" rx="11" ry="6" className="fill-dusty-300" opacity="0.6" transform="rotate(18 168 22)" />
          <ellipse cx="186" cy="26" rx="10" ry="5.5" className="fill-dusty-200" opacity="0.55" transform="rotate(8 186 26)" />
          <circle cx="96" cy="22" r="9" className="fill-terra-300" opacity="0.55" />
          <circle cx="144" cy="22" r="9" className="fill-terra-300" opacity="0.55" />
        </g>
        <motion.path
          d="M6,22 H44"
          stroke="url(#orn-gold)"
          strokeWidth="0.9"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d="M196,22 H234"
          stroke="url(#orn-gold)"
          strokeWidth="0.9"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <g fill="none" stroke="url(#orn-gold)" strokeWidth="1.5">
          <circle cx="114" cy="22" r="7.5" />
          <circle cx="126" cy="22" r="7.5" />
        </g>
      </motion.svg>
    </div>
  )
}
