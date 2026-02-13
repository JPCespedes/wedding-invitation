import { invitationData } from '../../data/invitation'
import type { RsvpFormValues } from './rsvpSchema'

const { rsvpFormId, fieldMap } = invitationData.googleForms

/**
 * Construye la URL del Google Form con los valores pre-rellenados vía query params.
 * El usuario es redirigido a esta URL; el Form es la fuente de verdad (Google Sheets).
 */
export function buildGoogleFormRsvpUrl(values: RsvpFormValues): string {
  const base = `https://docs.google.com/forms/d/e/${rsvpFormId}/viewform`
  const params = new URLSearchParams()
  const namesString = values.names.filter((n) => n.trim()).join(', ')
  params.set(fieldMap.name, namesString)
  if (values.message) params.set(fieldMap.message, values.message)
  return `${base}?${params.toString()}`
}

export function submitRsvpToGoogleForm(values: RsvpFormValues): void {
  const url = buildGoogleFormRsvpUrl(values)
  window.open(url, '_blank', 'noopener,noreferrer')
}
