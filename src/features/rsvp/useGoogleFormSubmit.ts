import { supabase } from '../../lib/supabase'
import type { RsvpFormValues } from './rsvpSchema'

export async function submitRsvp(values: RsvpFormValues): Promise<{ success: boolean; error?: string }> {
  const guestNames = values.names.filter((n) => n.trim())

  const { error } = await supabase.from('rsvp_confirmations').insert({
    invitation_code: values.invitationCode ?? null,
    guest_names: guestNames,
    message: values.message || null,
  })

  if (error) {
    console.error('Supabase RSVP error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function submitSongSuggestion(
  songName: string,
  suggestedBy?: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('song_suggestions').insert({
    song_name: songName,
    suggested_by: suggestedBy || null,
  })

  if (error) {
    console.error('Supabase song error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
