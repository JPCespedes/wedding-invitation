import { supabase } from '../../lib/supabase'
import type { RsvpFormValues, GuestEntry } from './rsvpSchema'

export async function checkExistingRsvp(
  invitationCode: string,
): Promise<{ exists: boolean; guests?: GuestEntry[]; error?: string }> {
  const { data, error } = await supabase
    .from('rsvp_confirmations')
    .select('guests')
    .eq('invitation_code', invitationCode)
    .maybeSingle()

  if (error) {
    console.error('Supabase check RSVP error:', error)
    return { exists: false, error: error.message }
  }

  if (data) {
    return { exists: true, guests: data.guests as GuestEntry[] }
  }

  return { exists: false }
}

export async function submitRsvp(
  values: RsvpFormValues,
): Promise<{ success: boolean; alreadyConfirmed?: boolean; error?: string }> {
  const { error } = await supabase.from('rsvp_confirmations').insert({
    invitation_code: values.invitationCode ?? null,
    guests: values.guests,
  })

  if (error) {
    if (error.code === '23505') {
      return { success: false, alreadyConfirmed: true }
    }
    console.error('Supabase RSVP error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteRsvp(
  invitationCode: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('rsvp_confirmations')
    .delete()
    .eq('invitation_code', invitationCode)

  if (error) {
    console.error('Supabase delete RSVP error:', error)
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
