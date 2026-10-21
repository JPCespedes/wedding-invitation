import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GuestEntry } from '../features/rsvp/rsvpSchema'
import { checkExistingRsvp } from '../features/rsvp/useGoogleFormSubmit'

const AUDIO_PREF_KEY = 'wedding-invitation-audio'
const GATE_PASSED_KEY = 'wedding-invitation-gate-passed'

type ModalId = 'rsvp' | 'dressCode' | 'tips' | 'gifts' | 'gallery' | null

/**
 * `idle` = todavía no se preguntó; `loaded` = ya sabemos la respuesta, que puede
 * ser «no hay RSVP» (confirmedGuests en null). Distinguir los dos evita que el
 * botón muestre «Confirmar asistencia» por un instante a quien ya confirmó.
 */
type RsvpStatus = 'idle' | 'loading' | 'loaded'

interface AppState {
  audioEnabled: boolean
  gatePassed: boolean
  openModal: ModalId
  rsvpEventId: string | null
  galleryIndex: number | null
  confirmedGuests: GuestEntry[] | null
  rsvpStatus: RsvpStatus
  setAudioEnabled: (enabled: boolean) => void
  setGatePassed: (passed: boolean) => void
  openModalAction: (id: ModalId, payload?: { eventId?: string; galleryIndex?: number }) => void
  closeModal: () => void
  setConfirmedGuests: (guests: GuestEntry[] | null) => void
  loadRsvp: (code: string) => Promise<void>
  hydrateFromStorage: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      gatePassed: false,
      openModal: null,
      rsvpEventId: null,
      galleryIndex: null,
      confirmedGuests: null,
      rsvpStatus: 'idle',

      setAudioEnabled: (enabled) =>
        set({ audioEnabled: enabled }, false),

      setGatePassed: (passed) =>
        set({ gatePassed: passed }, false),

      openModalAction: (id, payload) =>
        set({
          openModal: id,
          rsvpEventId: payload?.eventId ?? null,
          galleryIndex: payload?.galleryIndex ?? null,
        }, false),

      closeModal: () =>
        set({
          openModal: null,
          rsvpEventId: null,
          galleryIndex: null,
        }, false),

      setConfirmedGuests: (guests) =>
        set({ confirmedGuests: guests, rsvpStatus: 'loaded' }, false),

      /**
       * El botón de confirmar, la lista de invitados y el modal necesitan el
       * mismo dato al montarse a la vez. El guardia sobre `rsvpStatus` hace que
       * los tres compartan una sola consulta en lugar de pedirla cada uno.
       */
      loadRsvp: async (code) => {
        if (get().rsvpStatus !== 'idle') return
        set({ rsvpStatus: 'loading' }, false)

        const result = await checkExistingRsvp(code)

        set({
          confirmedGuests: result.exists && result.guests ? result.guests : null,
          rsvpStatus: 'loaded',
        }, false)
      },

      hydrateFromStorage: () => {
        try {
          const audio = localStorage.getItem(AUDIO_PREF_KEY)
          const gate = localStorage.getItem(GATE_PASSED_KEY)
          set({
            audioEnabled: audio === 'true',
            gatePassed: gate === 'true',
          }, false)
        } catch {
          // ignore
        }
      },
    }),
    {
      name: 'wedding-invitation-store',
      partialize: (s) => ({ audioEnabled: s.audioEnabled, gatePassed: s.gatePassed }),
    }
  )
)

export function persistAudioPreference(enabled: boolean): void {
  try {
    localStorage.setItem(AUDIO_PREF_KEY, String(enabled))
  } catch {
    // ignore
  }
}

export function persistGatePassed(): void {
  try {
    localStorage.setItem(GATE_PASSED_KEY, 'true')
  } catch {
    // ignore
  }
}
