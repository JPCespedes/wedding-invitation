import { z } from 'zod'

export const guestSchema = z.object({
  name: z.string().min(2, 'Al menos 2 caracteres'),
  attending: z.boolean(),
  message: z.string().optional(),
})

export const rsvpSchema = z.object({
  guests: z.array(guestSchema).min(1, 'Debe haber al menos un invitado'),
  invitationCode: z.string().optional(),
})

export type GuestEntry = z.infer<typeof guestSchema>
export type RsvpFormValues = z.infer<typeof rsvpSchema>
