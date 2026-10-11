interface FloralSprayProps {
  /** Position and size it from the caller, e.g. "absolute -top-3 -left-6 w-44". */
  className?: string
  /** Mirror horizontally, for the opposite corner. */
  mirrored?: boolean
  /** 'full' is a rose + eucalyptus bouquet, 'sprig' is just the branch. */
  variant?: 'full' | 'sprig'
}

/**
 * Watercolour corner bouquet: terracotta roses with blue eucalyptus.
 * Drawn rather than placed as an image so it scales cleanly, and painted
 * with theme classes so it follows the palette in index.css.
 * Requires <OrnamentDefs /> mounted once in the tree.
 */
export function FloralSpray({
  className = '',
  mirrored = false,
  variant = 'full',
}: FloralSprayProps) {
  return (
    <svg
      viewBox="0 0 240 210"
      aria-hidden
      focusable="false"
      className={`pointer-events-none ${mirrored ? 'scale-x-[-1]' : ''} ${className}`}
    >
      <g filter="url(#orn-paint)" style={{ mixBlendMode: 'multiply' }}>
        {/* eucalyptus branch */}
        <path
          d="M36,28 C78,44 116,66 150,96"
          fill="none"
          className="stroke-dusty-400"
          strokeWidth="1.6"
          opacity="0.74"
          strokeLinecap="round"
        />
        <ellipse cx="62" cy="40" rx="15" ry="9" className="fill-dusty-300" opacity="0.66" transform="rotate(28 62 40)" />
        <ellipse cx="92" cy="58" rx="14" ry="8" className="fill-dusty-200" opacity="0.7" transform="rotate(34 92 58)" />
        <ellipse cx="122" cy="78" rx="13" ry="8" className="fill-dusty-400" opacity="0.54" transform="rotate(38 122 78)" />

        {variant === 'full' && (
          <>
            <path
              d="M24,66 C60,78 96,104 122,138"
              fill="none"
              className="stroke-dusty-300"
              strokeWidth="1.4"
              opacity="0.64"
              strokeLinecap="round"
            />
            <ellipse cx="48" cy="86" rx="13" ry="8" className="fill-dusty-200" opacity="0.62" transform="rotate(46 48 86)" />
            <ellipse cx="78" cy="112" rx="12" ry="7" className="fill-dusty-300" opacity="0.56" transform="rotate(50 78 112)" />

            {/* open rose */}
            <circle cx="54" cy="56" r="25" className="fill-terra-300" opacity="0.66" />
            <circle cx="50" cy="59" r="16" className="fill-terra-400" opacity="0.5" />
            <path
              d="M40,60 a13,13 0 1,1 21,-7"
              fill="none"
              className="stroke-terra-600"
              strokeWidth="1.7"
              opacity="0.56"
              strokeLinecap="round"
            />
            <path
              d="M45,62 a8,8 0 1,1 13,-4"
              fill="none"
              className="stroke-terra-600"
              strokeWidth="1.5"
              opacity="0.48"
              strokeLinecap="round"
            />

            {/* buds */}
            <circle cx="104" cy="34" r="17" className="fill-terra-200" opacity="0.78" />
            <circle cx="101" cy="36" r="10" className="fill-terra-300" opacity="0.54" />
            <circle cx="96" cy="100" r="13" className="fill-terra-200" opacity="0.66" />
            <circle cx="26" cy="112" r="9" className="fill-terra-300" opacity="0.56" />
            <circle cx="132" cy="112" r="7" className="fill-terra-400" opacity="0.44" />
          </>
        )}

        {variant === 'sprig' && (
          <>
            <circle cx="40" cy="62" r="16" className="fill-terra-300" opacity="0.5" />
            <circle cx="86" cy="26" r="11" className="fill-terra-200" opacity="0.6" />
          </>
        )}
      </g>
    </svg>
  )
}
