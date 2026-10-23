import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, persistAudioPreference, persistGatePassed } from '../store/useAppStore'
import { invitationData } from '../data/invitation'
import { Rings } from './ornaments/Rings'
import { FloralSpray } from './ornaments/FloralSpray'

export function AudioGate() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const setGatePassed = useAppStore((s) => s.setGatePassed)
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled)
  const gatePassed = useAppStore((s) => s.gatePassed)

  const handleEnter = (withMusic: boolean) => {
    if (withMusic && audioRef.current) {
      audioRef.current.play().catch(() => {})
      setAudioEnabled(true)
      persistAudioPreference(true)
    } else {
      setAudioEnabled(false)
      persistAudioPreference(false)
    }
    setGatePassed(true)
    persistGatePassed()
  }

  const { groomName, brideName } = invitationData.couple

  return (
    <AnimatePresence>
      {!gatePassed && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50/80 backdrop-blur-md px-6 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FloralSpray className="absolute -top-4 -left-8 w-44 sm:w-56" />
          <FloralSpray mirrored className="absolute -bottom-4 -right-8 w-40 sm:w-52" />

          <audio
            ref={audioRef}
            src={invitationData.audioSrc}
            loop
            preload="metadata"
            playsInline
          />
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-stone-500 text-[11px] uppercase tracking-[0.3em] mb-3">
              Bienvenidos a la invitación de
            </p>
            <h1 className="font-script text-5xl md:text-6xl text-stone-800 leading-tight">
              {brideName} &amp; {groomName}
            </h1>
            <div className="flex items-center justify-center gap-3.5 mt-4 mb-5">
              <span className="block w-11 h-px bg-gradient-to-r from-transparent to-gold-500" />
              <Rings className="w-11 h-6" />
              <span className="block w-11 h-px bg-gradient-to-r from-gold-500 to-transparent" />
            </div>
            <p className="font-heading italic font-light text-lg text-stone-600 mb-9">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleEnter(true)}
                className="px-8 py-3.5 bg-terra-500 text-white rounded-full font-medium hover:bg-terra-600 transition shadow-[0_2px_8px_rgba(173,85,49,0.28)]"
              >
                Ingresar con música
              </button>
              <button
                type="button"
                onClick={() => handleEnter(false)}
                className="px-8 py-3.5 border border-dusty-500/30 bg-white/70 text-dusty-600 rounded-full font-medium hover:bg-white transition"
              >
                Ingresar sin música
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
