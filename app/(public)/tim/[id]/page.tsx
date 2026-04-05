export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Users, Trophy, Target, ArrowLeft } from 'lucide-react'
import { getPositionLabel, formatShortDate } from '@/lib/utils'
import MatchCard from '@/components/public/MatchCard'

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      players: {
        include: {
          playerStats: { select: { goals: true, assists: true, rating: true } },
        },
        orderBy: { name: 'asc' },
      },
      homeMatches: {
        where: { status: 'FINISHED' },
        include: { homeTeam: true, awayTeam: true },
        orderBy: { playedAt: 'desc' },
        take: 5,
      },
      awayMatches: {
        where: { status: 'FINISHED' },
        include: { homeTeam: true, awayTeam: true },
        orderBy: { playedAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!team) notFound()

  const allMatches = [...team.homeMatches, ...team.awayMatches]
    .sort((a, b) => new Date(b.playedAt || b.scheduledAt).getTime() - new Date(a.playedAt || a.scheduledAt).getTime())
    .slice(0, 5)

  // Compute team stats
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0
  const allFinished = [
    ...team.homeMatches.map(m => ({ ...m, isHome: true })),
    ...team.awayMatches.map(m => ({ ...m, isHome: false })),
  ]

  allFinished.forEach(m => {
    if (m.homeScore === null || m.awayScore === null) return
    if (m.isHome) {
      goalsFor += m.homeScore; goalsAgainst += m.awayScore
      if (m.homeScore > m.awayScore) wins++
      else if (m.homeScore < m.awayScore) losses++
      else draws++
    } else {
      goalsFor += m.awayScore; goalsAgainst += m.homeScore
      if (m.awayScore > m.homeScore) wins++
      else if (m.awayScore < m.homeScore) losses++
      else draws++
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/tim" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tim
      </Link>

      {/* Team Header */}
      <div className="game-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-3xl font-bold text-primary neon-glow shrink-0">
            {team.shortName}
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-4xl font-bold text-foreground">{team.name}</h1>
            {team.city && (
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" /> {team.city}
              </p>
            )}
            {team.description && <p className="text-muted-foreground mt-3">{team.description}</p>}
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 pt-6 border-t border-border/50">
          {[
            { label: 'Main', value: allFinished.length },
            { label: 'Menang', value: wins, color: 'text-green-400' },
            { label: 'Seri', value: draws },
            { label: 'Kalah', value: losses, color: 'text-red-400' },
            { label: 'Gol Masuk', value: goalsFor, color: 'text-neon' },
            { label: 'Gol Kemasukan', value: goalsAgainst },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className={`font-gaming text-2xl font-bold mt-1 ${stat.color || 'text-foreground'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roster */}
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-primary" /> Daftar Pemain ({team.players.length})
          </h2>
          <div className="space-y-2">
            {team.players.map((player) => {
              const totalGoals = player.playerStats.reduce((s, ps) => s + ps.goals, 0)
              const totalAssists = player.playerStats.reduce((s, ps) => s + ps.assists, 0)
              return (
                <Link key={player.id} href={`/pemain/${player.id}`}
                  className="game-card p-4 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-primary/60 group-hover:text-primary transition-colors">
                    {player.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{player.name}</p>
                    <p className="text-xs text-muted-foreground">@{player.username}</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">{player.position}</span>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{totalGoals}⚽</span>
                    <span>{totalAssists}🅰️</span>
                  </div>
                </Link>
              )
            })}
            {team.players.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Belum ada pemain</p>
            )}
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" /> Pertandingan Terakhir
          </h2>
          <div className="space-y-3">
            {allMatches.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {allMatches.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Belum ada pertandingan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
