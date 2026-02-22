import { useRef, useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useAppStore, persistAudioPreference } from '../store/useAppStore'
import { invitationData } from '../data/invitation'

export function AudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled)
  const gatePassed = useAppStore((s) => s.gatePassed)

  useEffect(() => {
    if (!gatePassed || !audioEnabled || !audioRef.current) return
    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      setIsPlaying(false)
    })
  }, [gatePassed, audioEnabled])

  if (!gatePassed) return null

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setAudioEnabled(false)
      persistAudioPreference(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        setAudioEnabled(true)
        persistAudioPreference(true)
      }).catch(() => {})
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
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  )
}
