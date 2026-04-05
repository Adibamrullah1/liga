import { z } from 'zod'

export const playerSchema = z.object({
  name: z.string().min(2).max(100),
  username: z.string().min(3).max(50, 'Username game maksimal 50 karakter'),
  position: z.enum(['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF']),
  nationality: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  teamId: z.string().optional().nullable(),
})

export type PlayerInput = z.infer<typeof playerSchema>
