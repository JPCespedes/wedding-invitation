import { z } from 'zod'

export const rsvpSchema = z.object({
  names: z
    .array(z.string())
    .min(1, 'Indicá al menos una persona')
    .refine(
      (arr) => arr.some((s) => s.trim().length >= 2),
      'Al menos un nombre con 2 caracteres o más'
    )
    .refine(
      (arr) => arr.every((s) => !s.trim() || s.trim().length >= 2),
      'Cada nombre debe tener al menos 2 caracteres'
    ),
  attending: z.enum(['Sí', 'No'], { message: 'Elige una opción' }),
  message: z.string().optional(),
})

export type RsvpFormValues = z.infer<typeof rsvpSchema>
