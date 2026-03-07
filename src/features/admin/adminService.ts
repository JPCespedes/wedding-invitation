import { supabase } from '../../lib/supabase'
import type { GuestEntry } from '../rsvp/rsvpSchema'

export interface InvitationRow {
  id: string
  code: string
  guests: string[]
  message: string
  created_at: string
}

export interface RsvpRow {
  invitation_code: string
  guests: GuestEntry[]
  created_at?: string
}

export async function fetchAllInvitations(): Promise<{ data: InvitationRow[]; error?: string }> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as InvitationRow[] }
}

export async function fetchAllRsvps(): Promise<{ data: RsvpRow[]; error?: string }> {
  const { data, error } = await supabase
    .from('rsvp_confirmations')
    .select('*')

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as RsvpRow[] }
}

export async function createInvitation(
  code: string,
  guests: string[],
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('invitations')
    .insert({ code: code.toLowerCase().trim(), guests, message })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateInvitation(
  id: string,
  guests: string[],
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('invitations')
    .update({ guests, message })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteInvitation(
  id: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  await supabase.from('rsvp_confirmations').delete().eq('invitation_code', code)

  const { error } = await supabase.from('invitations').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function upsertRsvp(
  code: string,
  guests: GuestEntry[],
): Promise<{ success: boolean; error?: string }> {
  await supabase.from('rsvp_confirmations').delete().eq('invitation_code', code)

  const { error } = await supabase
    .from('rsvp_confirmations')
    .insert({ invitation_code: code, guests })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function clearRsvp(
  code: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('rsvp_confirmations')
    .delete()
    .eq('invitation_code', code)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
