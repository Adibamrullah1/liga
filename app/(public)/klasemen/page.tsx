export const revalidate = 60

import { prisma } from '@/lib/prisma'
import StandingsTable from '@/components/public/StandingsTable'
import { Trophy } from 'lucide-react'

async function getStandings() {
  const [matches, players, seasons] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'FINISHED' },
      include: { homePlayer: true, awayPlayer: true },
    }),
    prisma.player.findMany(),
    prisma.season.findMany({ orderBy: { startDate: 'desc' } }),
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
    home.goalDiff = home.goalsFor - home.goalsAgainst; away.goalDiff = away.goalsFor - away.goalsAgainst
  })

  const standings = Array.from(standingsMap.values())
    .filter(s => s.played > 0)
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor)

  return { standings, seasons }
}

export default async function KlasemenPage() {
  const { standings, seasons } = await getStandings()
  const activeSeason = seasons.find(s => s.isActive)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Klasemen</h1>
          <p className="text-sm text-muted-foreground">
            {activeSeason ? activeSeason.name : 'Semua Musim'}
          </p>
        </div>
      </div>

      <div className="game-card overflow-hidden">
        <StandingsTable standings={standings} />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full badge-gold" />
          <span>Juara</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full badge-silver" />
          <span>Runner-up</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full badge-bronze" />
          <span>Peringkat 3</span>
        </div>
        <div className="ml-auto text-muted-foreground">
          M = Menang · S = Seri · K = Kalah · GF = Gol For · GA = Gol Against · GD = Selisih Gol
        </div>
      </div>
    </div>
  )
}
