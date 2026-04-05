import { z } from 'zod'

export const matchSchema = z.object({
  seasonId: z.string().min(1, 'Pilih musim'),
  homeTeamId: z.string().min(1, 'Pilih tim tuan rumah'),
  awayTeamId: z.string().min(1, 'Pilih tim tamu'),
  scheduledAt: z.string().min(1, 'Tentukan jadwal pertandingan'),
}).refine(data => data.homeTeamId !== data.awayTeamId, {
  message: 'Tim home dan away tidak boleh sama',
  path: ['awayTeamId'],
})

export const resultSchema = z.object({
  homeScore: z.number().int().min(0).max(99),
  awayScore: z.number().int().min(0).max(99),
  playedAt: z.string().optional(),
  playerStats: z.array(z.object({
    playerId: z.string(),
    goals: z.number().int().min(0).default(0),
    assists: z.number().int().min(0).default(0),
    rating: z.number().min(0).max(10).optional().nullable(),
    yellowCard: z.boolean().default(false),
    redCard: z.boolean().default(false),
    minutesPlayed: z.number().int().min(0).max(120).default(90),
  })).optional(),
})

export type MatchInput = z.infer<typeof matchSchema>
export type ResultInput = z.infer<typeof resultSchema>
