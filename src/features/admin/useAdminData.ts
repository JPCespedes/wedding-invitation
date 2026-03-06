import { useState, useCallback } from 'react'
import {
  fetchAllInvitations,
  fetchAllRsvps,
  type InvitationRow,
  type RsvpRow,
} from './adminService'
import type { GuestEntry } from '../rsvp/rsvpSchema'

export type RsvpStatus = 'confirmed' | 'declined' | 'pending'

export interface AdminRow extends InvitationRow {
  rsvp: RsvpRow | null
  status: RsvpStatus
}

function computeStatus(rsvp: RsvpRow | null): RsvpStatus {
  if (!rsvp) return 'pending'
  const guests = rsvp.guests as GuestEntry[]
  if (guests.some((g) => g.attending)) return 'confirmed'
  return 'declined'
}

export function useAdminData() {
  const [rows, setRows] = useState<AdminRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const [invRes, rsvpRes] = await Promise.all([
      fetchAllInvitations(),
      fetchAllRsvps(),
    ])

    if (invRes.error) {
      setError(invRes.error)
      setIsLoading(false)
      return
    }

    const rsvpMap = new Map<string, RsvpRow>()
    for (const r of rsvpRes.data) {
      rsvpMap.set(r.invitation_code, r)
    }

    const merged: AdminRow[] = invRes.data.map((inv) => {
      const rsvp = rsvpMap.get(inv.code) ?? null
      return { ...inv, rsvp, status: computeStatus(rsvp) }
    })

    setRows(merged)
    setIsLoading(false)
  }, [])

  return { rows, isLoading, error, refresh }
}
