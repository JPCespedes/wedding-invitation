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

/**
 * Guarda la respuesta de una invitación, tanto la primera vez como cuando
 * alguien vuelve a cambiarla.
 *
 * Una sola escritura: la restricción `unique_invitation_code` hace que un
 * segundo guardado sobre el mismo código actualice la fila en vez de duplicarla.
 * Como no tocamos `created_at`, esa columna sigue marcando cuándo confirmaron
 * por primera vez. De `updated_at` se encarga la base —`now()` por defecto al
 * insertar y un trigger al actualizar—, para no depender del reloj del visitante.
 */
export async function saveRsvp(
  values: RsvpFormValues,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('rsvp_confirmations').upsert(
    {
      invitation_code: values.invitationCode?.trim() || null,
      guests: values.guests,
    },
    { onConflict: 'invitation_code' },
  )

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
