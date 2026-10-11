interface RingsProps {
  className?: string
}

/** Interlocking wedding bands in soft gold, with a diamond above the join. */
export function Rings({ className = '' }: RingsProps) {
  return (
    <svg viewBox="0 0 44 26" aria-hidden focusable="false" className={className}>
      <g fill="none" stroke="url(#orn-gold)" strokeWidth="1.8">
        <circle cx="17" cy="15" r="9" />
        <circle cx="28" cy="15" r="9" />
      </g>
      <path d="M22.5 6 l2.4 3.6 -2.4 1.8 -2.4 -1.8 Z" fill="#E3CFA0" />
    </svg>
  )
}
