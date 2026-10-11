import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, ZoomIn } from 'lucide-react'
import { invitationData } from '../data/invitation'
import { LeafRule } from './ornaments/LeafRule'

const { dressCode } = invitationData.party

interface WashSwatchProps {
  /** One colour fills the disc; two are painted as overlapping discs on the strike's diagonal. */
  colors: readonly string[]
  /** Degrees. Every swatch shares one noise field, so turning each one gives it its own edge. */
  turn?: number
  /** Strike it through, for what to avoid. */
  crossed?: boolean
  /** Drawn over the paint, in the same 64×64 box. */
  children?: ReactNode
  className?: string
}

/** A watercolour disc of paint. Requires <OrnamentDefs /> mounted once. */
function WashSwatch({ colors, turn = 0, crossed = false, children, className = '' }: WashSwatchProps) {
  const discs =
    colors.length === 1
      ? [{ hex: colors[0], cx: 32, cy: 32, r: 28 }]
      : colors.slice(0, 2).map((hex, i) => ({ hex, cx: 23 + i * 18, cy: 23 + i * 18, r: 18 }))

  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={className}>
      {/* Each disc turns about its own centre, so a pair stays on the diagonal. */}
      {discs.map(({ hex, cx, cy, r }, i) => (
        <g key={hex} filter="url(#orn-wash)" transform={`rotate(${turn + i * 120} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={r} fill={hex} />
          <circle cx={cx} cy={cy} r={r} fill="url(#orn-wash-glow)" />
          <circle cx={cx} cy={cy} r={r - 1} fill="none" className="stroke-stone-900" strokeOpacity="0.12" strokeWidth="2" />
        </g>
      ))}
      {children}
      {crossed && (
        <>
          {/* Paper-coloured halo keeps the strike legible over red and black. */}
          <path d="M15,15 L49,49" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
          <path d="M15,15 L49,49" className="stroke-terra-500" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/** A sneaker in profile, sized for the 64×64 swatch box. */
function Sneaker() {
  return (
    <g
      transform="translate(14 12) scale(1.5)"
      fill="none"
      className="stroke-stone-600"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 17 H20.5 A1.5 1.5 0 0 1 20.5 20 H3.5 A1.5 1.5 0 0 1 3.5 17 Z" />
      <path d="M3 17 V10 C3 9.2 3.6 8.6 4.4 8.7 L7.2 9 L9 6.2 L14.6 11.6 C17.6 12.1 20.2 12.9 21.3 14 C21.8 14.5 22 15.2 22 16 V17" />
      <path d="M10.4 8.1 L11.7 6.8 M12.1 9.7 L13.4 8.4" />
    </g>
  )
}

const avoidIcons = { sneaker: Sneaker }

/** Small letterspaced label between gold hairlines. */
function BlockLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-stone-500">
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/60" />
      {children}
      <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/60" />
    </p>
  )
}

/** The palette as a row of dots, for the Dress Code card. */
export function PaletteDots({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex gap-1.5 ${className}`}>
      {dressCode.palette.map((color) => (
        <span
          key={color.name}
          className="h-3.5 w-3.5 rounded-full"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </div>
  )
}

/** Mirrors the left panel of the moodboard, legible at phone size. */
function DressCodePalette() {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-terra-400">{dressCode.style}</p>
      <h4 className="mt-2 font-heading text-2xl sm:text-3xl font-medium leading-snug text-stone-800">
        Nuestra paleta de colores
      </h4>
      <LeafRule className="mt-2 w-32 h-5" />
      <p className="mt-2 max-w-md font-heading italic font-light text-base sm:text-lg text-stone-500 text-pretty">
        {dressCode.paletteIntro}
      </p>

      <ul className="mt-6 grid w-full max-w-sm grid-cols-3 gap-x-2 gap-y-5">
        {dressCode.palette.map((color, i) => (
          <li key={color.name} className="flex flex-col items-center gap-2">
            <WashSwatch
              colors={[color.hex]}
              turn={i * 67}
              className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]"
            />
            <span className="text-[10px] uppercase tracking-[0.12em] leading-snug text-stone-600 text-balance">
              {color.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** What not to wear, each struck through. Stands alone so it can live anywhere. */
export function DressCodeAvoid({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-gold-500/40 bg-terra-50/70 p-5 sm:p-6 ${className}`}>
      <h4 className="text-center font-body text-[10px] uppercase tracking-[0.3em] text-terra-600">
        Te pedimos evitar
      </h4>
      <ul className="mx-auto mt-4 grid max-w-md gap-4">
        {dressCode.avoid.map((item, i) => {
          const Icon = 'icon' in item ? avoidIcons[item.icon] : null
          return (
            <li key={item.title} className="flex items-center gap-3.5">
              <WashSwatch
                colors={'swatches' in item ? item.swatches : ['#FFFFFF']}
                turn={i * 67 + 30}
                crossed
                className="w-14 h-14 shrink-0"
              >
                {Icon && <Icon />}
              </WashSwatch>
              <div className="min-w-0">
                <p className="font-heading text-lg font-medium leading-snug text-stone-800">
                  {item.title}
                </p>
                <p className="text-[13px] leading-snug text-stone-500">{item.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Moodboard() {
  const [isOpen, setIsOpen] = useState(false)
  const { src, alt, width, height } = dressCode.moodboard

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <div className="flex flex-col gap-4">
      <BlockLabel>Inspiración</BlockLabel>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block w-full rounded-xl border border-gold-500/40 bg-white p-1.5 shadow-[0_2px_10px_rgba(17,42,67,0.08)]"
        aria-label="Ver el moodboard en grande"
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className="block h-auto w-full rounded-lg"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-sm transition group-hover:bg-white">
          <ZoomIn size={13} strokeWidth={1.75} />
          Ampliar
        </span>
      </button>

      {/* Portalled: the modal around it clips overflow and animates a transform,
          either of which would trap a fixed overlay inside it. */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[60] bg-stone-900/90"
              role="dialog"
              aria-modal="true"
              aria-label="Moodboard de vestimenta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              {/* On a phone the board is drawn taller than the screen is wide,
                  so it pans sideways instead of shrinking to unreadable. */}
              <div className="flex h-full w-full overflow-auto overscroll-contain">
                <img
                  src={src}
                  alt={alt}
                  className="m-auto block h-[78dvh] w-auto max-w-none rounded-md sm:h-auto sm:max-h-[90dvh] sm:max-w-[94vw]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
              <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-xs text-white/70 sm:hidden">
                Deslizá para recorrer la imagen
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

/** Pinterest's mark (Simple Icons, CC0), in the current colour. */
function PinterestMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" fill="currentColor" className={className}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
}

function PinterestBoard() {
  // Widened from its literal type so both branches type-check, set or empty.
  const url: string = dressCode.pinterestUrl

  return (
    <div className="rounded-2xl border border-stone-100 border-l-[3px] border-l-gold-500 bg-white p-5 shadow-[0_2px_10px_rgba(17,42,67,0.06)]">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/50 bg-terra-50">
          <PinterestMark className="h-5 w-5 text-terra-500" />
        </span>
        <div>
          <h4 className="font-heading text-xl font-medium text-stone-800">¿Querés más ideas?</h4>
          <p className="mt-1 text-sm text-stone-600">
            Seguí nuestro tablero de Pinterest: ahí encontrás más looks en los tonos de la paleta.
          </p>
        </div>
      </div>
      {/* Under the text column from sm up; full width below that, where the
          column beside the icon is too narrow for the label. */}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-terra-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_2px_8px_rgba(173,85,49,0.26)] transition hover:bg-terra-600 sm:ml-[3.75rem] sm:inline-flex sm:w-auto"
        >
          <ExternalLink size={16} />
          Ver tablero en Pinterest
        </a>
      ) : (
        <span className="mt-4 flex w-full items-center justify-center rounded-lg border border-dashed border-gold-500/60 px-4 py-2.5 text-sm text-stone-500 sm:ml-[3.75rem] sm:inline-flex sm:w-auto">
          Enlace disponible muy pronto
        </span>
      )}
    </div>
  )
}

/** Body of the Dress Code modal. */
export function DressCodeDetails() {
  return (
    <div className="flex flex-col gap-8">
      <DressCodePalette />
      <DressCodeAvoid />
      <Moodboard />
      <PinterestBoard />
    </div>
  )
}
