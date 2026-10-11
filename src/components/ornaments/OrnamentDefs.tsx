/**
 * Shared SVG defs for every ornament: the soft-gold gradient and the
 * watercolour filter. SVG fragment ids resolve document-wide, so this
 * mounts ONCE near the app root and every ornament references it by id.
 *
 * Keep it out of a `display: none` wrapper — several browsers refuse to
 * resolve defs inside a hidden subtree.
 */
export function OrnamentDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <linearGradient id="orn-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E3CFA0" />
          <stop offset="45%" stopColor="#C3A265" />
          <stop offset="100%" stopColor="#A8823F" />
        </linearGradient>

        {/* Organic, hand-painted edge. Displacement is what sells it as
            watercolour rather than flat vector shapes. */}
        <filter id="orn-paint" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="4"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>

        {/* Paint swatches for the dress-code palette. A gentler wobble than
            orn-paint so a 64-unit disc still reads as round, then a fine
            noise multiplied in for the mottling of dried pigment. */}
        <filter
          id="orn-wash"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed="3"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.3"
            numOctaves="2"
            seed="9"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0.2 0 0 0 0.89  0.2 0 0 0 0.89  0.2 0 0 0 0.89  0 0 0 0 1"
            result="mottle"
          />
          <feComposite in="shape" in2="mottle" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>

        {/* Pigment pools at the rim of a wash and thins towards the middle. */}
        <radialGradient id="orn-wash-glow">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
