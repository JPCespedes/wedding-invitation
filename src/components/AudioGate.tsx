import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, persistAudioPreference, persistGatePassed } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
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
            <p className="text-stone-500 text-sm uppercase tracking-widest mb-2">
              Bienvenidos a la invitación de
            </p>
            <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mb-4">
              {groomName} & {brideName}
            </h1>
            <p className="text-stone-600 mb-10">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleEnter(true)}
                className="px-8 py-3 bg-stone-800 text-white rounded-full font-medium hover:bg-stone-700 transition"
              >
                Ingresar con música
              </button>
              <button
                type="button"
                onClick={() => handleEnter(false)}
                className="px-8 py-3 border border-stone-300 text-stone-700 rounded-full font-medium hover:bg-stone-50 transition"
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
