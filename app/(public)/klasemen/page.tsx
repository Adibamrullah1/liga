export const revalidate = 120

import { prisma } from '@/lib/prisma'
import StandingsTable from '@/components/public/StandingsTable'
import { Trophy } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Klasemen',
  description: 'Lihat klasemen liga eFootball Mobile terkini.',
}

async function getStandings() {
  const [matches, players, seasons] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'FINISHED' },
      select: {
        homePlayerId: true, awayPlayerId: true,
        homeScore: true, awayScore: true,
        season: { select: { isActive: true } },
      },
    }),
    prisma.player.findMany({
      select: { id: true, name: true, shortName: true, avatarUrl: true },
    }),
    prisma.season.findFirst({ where: { isActive: true }, select: { id: true, name: true } }),
  ])

  const standingsMap = new Map<string, any>()
  players.forEach(player => {
    standingsMap.set(player.id, {
      playerId: player.id, playerName: player.name, shortName: player.shortName, avatarUrl: player.avatarUrl,
      played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
    })
  })

  matches.forEach(match => {
    if (match.homeScore === null || match.awayScore === null) return
    const home = standingsMap.get(match.homePlayerId)
    const away = standingsMap.get(match.awayPlayerId)
    if (!home || !away) return
    home.played++; away.played++
    home.goalsFor += match.homeScore; home.goalsAgainst += match.awayScore
    away.goalsFor += match.awayScore; away.goalsAgainst += match.homeScore
    if (match.homeScore > match.awayScore) { home.won++; home.points += 3; away.lost++ }
    else if (match.homeScore < match.awayScore) { away.won++; away.points += 3; home.lost++ }
    else { home.drawn++; home.points += 1; away.drawn++; away.points += 1 }
    home.goalDiff = home.goalsFor - home.goalsAgainst
    away.goalDiff = away.goalsFor - away.goalsAgainst
  })

  const standings = Array.from(standingsMap.values())
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor)

  return { standings, activeSeason: seasons }
}

export default async function KlasemenPage() {
  const { standings, activeSeason } = await getStandings()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Klasemen</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {activeSeason ? activeSeason.name : 'Belum ada musim aktif'}
          </p>
        </div>
      </div>

      <div className="game-card overflow-hidden">
        <StandingsTable standings={standings} />
      </div>

      {/* Legend — scroll pada mobile */}
      <div className="mt-4 overflow-x-auto">
        <div className="flex items-center gap-4 text-xs text-muted-foreground min-w-max pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <span>Juara</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400/60" />
            <span>Runner-up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600/60" />
            <span>Peringkat 3</span>
          </div>
          <span className="text-muted-foreground/60">
            M=Menang · S=Seri · K=Kalah · GF · GA · GD
          </span>
        </div>
      </div>
    </div>
  )
}
