interface LeafRuleProps {
  className?: string
}

/**
 * Gold hairlines flanking two blue leaves and a terracotta bud — the
 * rule under every section title. Requires <OrnamentDefs /> mounted once.
 */
export function LeafRule({ className = 'w-36 h-5' }: LeafRuleProps) {
  return (
    <svg viewBox="0 0 150 20" aria-hidden focusable="false" className={className}>
      <g filter="url(#orn-paint)" style={{ mixBlendMode: 'multiply' }}>
        <ellipse cx="62" cy="10" rx="10" ry="5.5" className="fill-dusty-300" opacity="0.6" transform="rotate(-20 62 10)" />
        <ellipse cx="88" cy="10" rx="10" ry="5.5" className="fill-dusty-300" opacity="0.6" transform="rotate(20 88 10)" />
        <circle cx="75" cy="10" r="7" className="fill-terra-300" opacity="0.62" />
      </g>
      {/* Thin rects, not stroked lines: a gradient in bounding-box units has
          nothing to span on a zero-height line, so the browser paints nothing. */}
      <rect x="6" y="9.55" width="40" height="0.9" fill="url(#orn-gold)" />
      <rect x="104" y="9.55" width="40" height="0.9" fill="url(#orn-gold)" />
    </svg>
  )
}
