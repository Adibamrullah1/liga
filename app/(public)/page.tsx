export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Trophy, Calendar, ArrowRight, Gamepad2, Zap, Target } from 'lucide-react'
import StandingsTable from '@/components/public/StandingsTable'
import MatchCard from '@/components/public/MatchCard'
import StatsBanner from '@/components/public/StatsBanner'

async function getHomeData() {
  const [recentMatches, upcomingMatches, teams, season] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'FINISHED' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { playedAt: 'desc' },
      take: 4,
    }),
    prisma.match.findMany({
      where: { status: 'SCHEDULED' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: 'asc' },
      take: 4,
    }),
    prisma.team.findMany(),
    prisma.season.findFirst({ where: { isActive: true } }),
  ])

  // Compute standings
  const finishedMatches = await prisma.match.findMany({
    where: { status: 'FINISHED' },
    include: { homeTeam: true, awayTeam: true },
  })

  const standingsMap = new Map<string, any>()
  teams.forEach(team => {
    standingsMap.set(team.id, {
      teamId: team.id, teamName: team.name, shortName: team.shortName, logoUrl: team.logoUrl,
      played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
    })
  })

  finishedMatches.forEach(match => {
    if (match.homeScore === null || match.awayScore === null) return
    const home = standingsMap.get(match.homeTeamId)
    const away = standingsMap.get(match.awayTeamId)
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
    .filter(s => s.played > 0)
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)

  // Top stats
  const topScorers = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { goals: { gt: 0 } },
    _sum: { goals: true, assists: true },
    orderBy: { _sum: { goals: 'desc' } },
    take: 1,
  })

  const topAssists = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { assists: { gt: 0 } },
    _sum: { assists: true },
    orderBy: { _sum: { assists: 'desc' } },
    take: 1,
  })

  const bestRatings = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { rating: { not: null } },
    _avg: { rating: true },
    orderBy: { _avg: { rating: 'desc' } },
    take: 1,
  })

  const enrichPlayer = async (stat: any) => {
    if (!stat) return null
    const player = await prisma.player.findUnique({
      where: { id: stat.playerId },
      include: { team: { select: { shortName: true, name: true } } },
    })
    return { ...stat, player }
  }

  return {
    recentMatches,
    upcomingMatches,
    standings,
    season,
    topScorer: topScorers[0] ? await enrichPlayer(topScorers[0]) : null,
    topAssist: topAssists[0] ? await enrichPlayer(topAssists[0]) : null,
    bestRating: bestRatings[0] ? await enrichPlayer(bestRatings[0]) : null,
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gaming-accent rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-neon" />
              <span className="text-sm text-primary font-medium">
                {data.season ? data.season.name : 'Liga eFootball Mobile'}
              </span>
            </div>
            <h1 className="font-gaming text-4xl md:text-6xl font-black tracking-wider mb-4">
              <span className="gradient-text">LIGA eFOOTBALL</span>
              <br />
              <span className="text-foreground">MOBILE</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Platform liga eFootball Mobile terlengkap. Ikuti klasemen, jadwal pertandingan, statistik pemain, dan data tim dari liga.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/klasemen"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-bold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Lihat Klasemen
              </Link>
              <Link
                href="/jadwal"
                className="px-6 py-3 rounded-xl bg-secondary border border-border/50 text-foreground font-semibold hover:border-primary/30 hover:bg-secondary/80 transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Jadwal Tanding
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Stats Banner */}
        <section>
          <StatsBanner
            topScorer={data.topScorer}
            topAssist={data.topAssist}
            bestRating={data.bestRating}
          />
        </section>

        {/* Recent Results */}
        {data.recentMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-neon" />
                Hasil Terbaru
              </h2>
              <Link href="/jadwal" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recentMatches.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Standings Preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Klasemen
              </h2>
              <Link href="/klasemen" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Selengkapnya <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="game-card overflow-hidden">
              <StandingsTable standings={data.standings} />
            </div>
          </div>

          {/* Upcoming Matches */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-6 h-6 text-neon-blue" />
                Mendatang
              </h2>
            </div>
            <div className="space-y-3">
              {data.upcomingMatches.length > 0 ? data.upcomingMatches.map((match: any) => (
                <div key={match.id} className="game-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{match.homeTeam.shortName}</span>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className="text-xs font-bold text-gaming-accent bg-gaming-accent/10 px-2 py-0.5 rounded">{match.awayTeam.shortName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(match.scheduledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </p>
                </div>
              )) : (
                <div className="game-card p-6 text-center">
                  <p className="text-muted-foreground text-sm">Belum ada jadwal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
