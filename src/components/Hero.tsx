import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { invitationData } from '../data/invitation'
import { FloralSpray } from './ornaments/FloralSpray'
import { Rings } from './ornaments/Rings'

/** Cross-fade at the loop seam. Long enough to hide the cut, short enough
 *  not to read as an effect. */
const FADE_MS = 700

const videoLayer =
  'absolute inset-0 w-full h-full object-cover object-[center_32%] transition-opacity ease-linear'

export function Hero() {
  const { groomName, brideName, quote } = invitationData.couple
  const { src, poster } = invitationData.heroVideo

  const sectionRef = useRef<HTMLElement>(null)
  // Two layers that hand over to each other: see the loop effect below.
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Text fades out and drifts up as you scroll past the hero.
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.55], [0, -70])

  useEffect(() => {
    const a = videoARef.current
    const b = videoBRef.current
    if (!a || !b) return

    // A looping video is motion the user may have asked not to see.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a.pause()
      b.pause()
      return
    }

    /*
      Native `loop` leaves a gap: the decoder runs dry while it seeks back to
      zero and the section background paints through for a frame or two.
      Instead, two layers hand over — the idle one starts from the top while
      the outgoing one is still showing, and they cross-fade. That also
      softens the cut between the clip's closing close-up and its opening
      wide shot, which are different takes.
    */
    let visible = a
    let hidden = b
    let disposed = false

    /*
      The second layer is not fetched up front: two `preload="auto"` elements
      can pull the same several-MB file twice on a cold load, which is real
      money on mobile data. It is only warmed once the first layer has the
      whole clip, so it comes straight from cache — and it is not needed until
      roughly thirteen seconds in.
    */
    const warmSecondLayer = () => {
      if (disposed || b.preload === 'auto') return
      b.preload = 'auto'
      b.load()
    }
    if (a.readyState >= 4) warmSecondLayer()
    else a.addEventListener('canplaythrough', warmSecondLayer, { once: true })

    const handOver = () => {
      hidden.currentTime = 0
      // Autoplay can be refused (low power mode, strict settings); the
      // poster underneath stays up and nothing breaks.
      void hidden.play().catch(() => {})
      hidden.style.opacity = '1'
      visible.style.opacity = '0'

      const outgoing = visible
      visible = hidden
      hidden = outgoing
      window.setTimeout(() => {
        if (disposed) return
        outgoing.pause()
        outgoing.currentTime = 0
      }, FADE_MS)
    }

    const tick = () => {
      if (visible.paused || !visible.duration) return
      if (visible.duration - visible.currentTime <= FADE_MS / 1000) handOver()
    }
    const timer = window.setInterval(tick, 80)

    // Only play while the hero is on screen: the clip is several MB and there
    // is no reason to keep two decoders running further down the page.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void visible.play().catch(() => {})
        } else {
          a.pause()
          b.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(a)

    return () => {
      disposed = true
      window.clearInterval(timer)
      observer.disconnect()
      a.removeEventListener('canplaythrough', warmSecondLayer)
    }
  }, [])

  const scrollToContent = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    // Deep terracotta rather than the navy stone-900: if anything ever paints
    // through from behind the footage it should read as sunset, not as a glitch.
    <section
      ref={sectionRef}
      className="relative min-h-svh lg:h-svh overflow-hidden bg-terra-900 lg:bg-stone-50"
    >
      {/* Desktop only: the video moves into a frame, so the page needs a ground. */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-terra-50 via-stone-50 to-dusty-50 paper-grain" />

      {/* Bouquets sit over the bright sky at the top of the frame. */}
      <FloralSpray className="absolute -top-3 -left-7 w-52 sm:w-72 lg:w-96 z-20" />
      <FloralSpray
        mirrored
        className="absolute -top-2 -right-8 w-44 sm:w-60 lg:w-[26rem] z-20"
      />

      {/* Double gold rule */}
      <div className="absolute inset-4 sm:inset-6 lg:inset-8 border border-gold-100/60 pointer-events-none z-20" />
      <div className="absolute inset-[1.375rem] sm:inset-8 lg:inset-11 border border-gold-100/25 pointer-events-none z-20" />

      <div className="relative z-10 flex min-h-svh lg:min-h-0 lg:h-full flex-col px-8 py-16 sm:px-14 lg:flex-row-reverse lg:items-center lg:justify-center lg:gap-14 xl:gap-20 lg:px-16 xl:px-20 lg:py-16">
        {/*
          One <video>, two layouts. Below lg it is the full-bleed background.
          At lg it becomes a portrait arch: the clip is 9:16, so covering a
          wide viewport would blow it up past 2500px tall and crop their faces.
        */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:shrink-0 lg:h-[min(42rem,calc(100svh-9rem))] lg:w-auto lg:aspect-[9/16] lg:p-2.5 lg:bg-white lg:border lg:border-gold-500/50 lg:rounded-t-[11rem] lg:rounded-b-xl lg:shadow-[0_14px_44px_rgba(17,42,67,0.14)]">
          {/*
            The poster sits under both layers, so a decode hiccup shows a
            still of them rather than the section colour behind.
          */}
          <div
            className="absolute inset-0 lg:inset-2.5 overflow-hidden lg:rounded-t-[10.5rem] lg:rounded-b-lg"
            style={{
              backgroundImage: `url(${poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 32%',
            }}
          >
            <video
              ref={videoARef}
              src={src}
              poster={poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label={`${groomName} y ${brideName} en su sesión de compromiso`}
              className={videoLayer}
              style={{ opacity: 1, transitionDuration: `${FADE_MS}ms` }}
            />
            <video
              ref={videoBRef}
              src={src}
              muted
              playsInline
              preload="none"
              aria-hidden
              className={videoLayer}
              style={{ opacity: 0, transitionDuration: `${FADE_MS}ms` }}
            />
          </div>

          {/* Warm tint pulls the footage toward the invitation palette. */}
          <div className="absolute inset-0 lg:inset-2.5 bg-gradient-to-b from-terra-300/15 via-terra-500/8 to-stone-900/5 mix-blend-multiply pointer-events-none lg:rounded-t-[10.5rem] lg:rounded-b-lg" />
          {/* Scrim so the names read — only needed when text sits on the video. */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/35 to-stone-900/85 pointer-events-none" />
        </div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative flex flex-1 flex-col items-center text-center lg:items-start lg:text-left lg:max-w-2xl"
        >
          {/* Mobile and tablet: the date gives the top third a job. */}
          <motion.div
            className="flex flex-col items-center gap-2 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block w-px h-8 bg-gradient-to-b from-transparent to-gold-100" />
            <p className="font-heading text-xl sm:text-2xl uppercase tracking-[0.3em] pl-[0.3em] text-white drop-shadow-md">
              29 · Enero · 2027
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center lg:items-start mt-auto lg:mt-0"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <div className="flex items-center gap-3.5">
              <span className="hidden lg:block w-14 h-px bg-gradient-to-r from-gold-500 to-transparent" />
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/80 lg:text-terra-400">
                Nos casamos
              </p>
            </div>

            <h1 className="font-script text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-normal leading-[1.02] lg:whitespace-nowrap mt-2.5 text-white drop-shadow-[0_2px_18px_rgba(17,42,67,0.55)] lg:text-stone-800 lg:drop-shadow-none">
              {groomName} &amp; {brideName}
            </h1>

            <div className="flex items-center gap-3.5 mt-5 lg:mt-6">
              <span className="block w-11 h-px bg-gradient-to-r from-transparent to-gold-100 lg:hidden" />
              <Rings className="w-11 h-6 lg:w-12 lg:h-7" />
              <span className="block w-11 h-px bg-gradient-to-r from-gold-100 to-transparent lg:hidden" />
              <p className="hidden lg:block font-heading text-2xl xl:text-[1.7rem] uppercase tracking-[0.3em] pl-[0.3em] text-stone-700">
                29 · Enero · 2027
              </p>
            </div>

            <p className="font-heading italic font-light text-[17px] sm:text-xl lg:text-[1.4rem] leading-relaxed mt-6 lg:mt-7 max-w-[19rem] sm:max-w-md lg:max-w-lg text-pretty text-white/90 drop-shadow-[0_1px_8px_rgba(17,42,67,0.5)] lg:text-stone-600 lg:drop-shadow-none">
              {quote}
            </p>

            <button
              type="button"
              onClick={scrollToContent}
              className="inline-flex flex-col items-center gap-1.5 mt-8 lg:mt-10 lg:flex-row lg:gap-2.5 text-white/70 hover:text-white lg:text-dusty-600 lg:hover:text-dusty-700 transition"
              aria-label="Ver el resto de la invitación"
            >
              <span className="text-[11px] uppercase tracking-[0.22em]">Descubre más</span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
