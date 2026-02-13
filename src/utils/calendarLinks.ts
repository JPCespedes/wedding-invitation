import { format } from 'date-fns'
import { invitationData } from '../data/invitation'

type Event = (typeof invitationData.events)[number]

const eventTitle = (event: Event) =>
  `Boda de ${invitationData.couple.groomName} y ${invitationData.couple.brideName} (${event.title})`

/**
 * Genera URL para agregar evento a Google Calendar
 */
export function getGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.datetimeISO)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000) // +2h por defecto
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(event),
    dates: `${format(start, "yyyyMMdd'T'HHmmss")}/${format(end, "yyyyMMdd'T'HHmmss")}`,
    details: `${event.venueName}\n${event.address}`,
    location: event.address,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Genera contenido del archivo .ics para descarga
 */
export function getIcsContent(event: Event): string {
  const start = new Date(event.datetimeISO)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const now = new Date()
  const formatIcs = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ES',
    'BEGIN:VEVENT',
    `UID:${event.id}-${start.getTime()}@wedding`,
    `DTSTAMP:${formatIcs(now)}`,
    `DTSTART:${formatIcs(start)}`,
    `DTEND:${formatIcs(end)}`,
    `SUMMARY:${eventTitle(event)}`,
    `DESCRIPTION:${event.venueName}\\n${event.address}`,
    `LOCATION:${event.address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/**
 * Descarga un archivo .ics con el evento
 */
export function downloadIcs(event: Event): void {
  const blob = new Blob([getIcsContent(event)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `boda-${event.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
