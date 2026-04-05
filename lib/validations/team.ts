import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().min(2, 'Nama tim minimal 2 karakter').max(50),
  shortName: z.string().min(2).max(5, 'Short name maksimal 5 karakter').toUpperCase(),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
})

export type TeamInput = z.infer<typeof teamSchema>
