import { useRef, useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

export function AudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const gatePassed = useAppStore((s) => s.gatePassed)

  useEffect(() => {
    if (!gatePassed || !audioEnabled || !audioRef.current) return
    audioRef.current.play().catch(() => {})
  }, [gatePassed, audioEnabled])

  if (!gatePassed || !audioEnabled) return null

  const toggle = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
      setIsMuted(false)
    } else {
      audioRef.current.pause()
      setIsMuted(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={invitationData.audioSrc} loop playsInline />
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-white/90 shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition"
        aria-label="Silenciar / Reproducir música"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </>
  )
}
