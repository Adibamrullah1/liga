export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Trophy, Star, Clock } from 'lucide-react'
import { getPositionLabel, formatShortDate } from '@/lib/utils'

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
    include: {
      team: true,
      playerStats: {
        include: {
          match: {
            include: {
              homeTeam: { select: { name: true, shortName: true } },
              awayTeam: { select: { name: true, shortName: true } },
            },
          },
        },
        orderBy: { match: { scheduledAt: 'desc' } },
      },
    },
  })

  if (!player) notFound()

  const totalGoals = player.playerStats.reduce((s, ps) => s + ps.goals, 0)
  const totalAssists = player.playerStats.reduce((s, ps) => s + ps.assists, 0)
  const ratingsArr = player.playerStats.filter(ps => ps.rating !== null)
  const avgRating = ratingsArr.length > 0
    ? ratingsArr.reduce((s, ps) => s + (ps.rating || 0), 0) / ratingsArr.length
    : null
  const yellowCards = player.playerStats.filter(ps => ps.yellowCard).length
  const redCards = player.playerStats.filter(ps => ps.redCard).length
  const totalMinutes = player.playerStats.reduce((s, ps) => s + ps.minutesPlayed, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/pemain" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pemain
      </Link>

      {/* Player Header */}
      <div className="game-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-4xl font-bold text-primary/50 shrink-0">
            {player.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-4xl font-bold text-foreground">{player.name}</h1>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{player.position}</span>
            </div>
            <p className="text-muted-foreground">@{player.username}</p>
            {player.team && (
              <Link href={`/tim/${player.team.id}`} className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:text-primary/80 transition-colors">
                <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[9px] font-bold">{player.team.shortName}</span>
                {player.team.name}
              </Link>
            )}
            {player.nationality && <p className="text-sm text-muted-foreground mt-1">🌍 {player.nationality}</p>}
            <p className="text-sm text-muted-foreground mt-1">📍 {getPositionLabel(player.position)}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mt-8 pt-6 border-t border-border/50">
          {[
            { icon: '⚽', label: 'Gol', value: totalGoals, color: 'text-neon' },
            { icon: '🅰️', label: 'Assist', value: totalAssists, color: 'text-neon-blue' },
            { icon: '⭐', label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : '-', color: 'text-yellow-400' },
            { icon: '🏟️', label: 'Pertandingan', value: player.playerStats.length },
            { icon: '⏱️', label: 'Total Menit', value: totalMinutes },
            { icon: '🟨', label: 'Kartu Kuning', value: yellowCards, color: 'text-yellow-400' },
            { icon: '🟥', label: 'Kartu Merah', value: redCards, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.icon} {stat.label}</p>
              <p className={`font-gaming text-2xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Match History */}
      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Riwayat Pertandingan</h2>
      <div className="space-y-2">
        {player.playerStats.map((ps) => (
          <div key={ps.id} className="game-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-muted-foreground w-16 shrink-0">{formatShortDate(ps.match.scheduledAt)}</span>
              <span className="text-sm font-semibold text-foreground truncate">
                {ps.match.homeTeam.shortName} {ps.match.homeScore ?? '-'} : {ps.match.awayScore ?? '-'} {ps.match.awayTeam.shortName}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {ps.goals > 0 && <span className="text-neon font-semibold">⚽ {ps.goals}</span>}
              {ps.assists > 0 && <span className="text-neon-blue font-semibold">🅰️ {ps.assists}</span>}
              {ps.rating && <span className="text-yellow-400">⭐ {ps.rating.toFixed(1)}</span>}
              {ps.yellowCard && <span>🟨</span>}
              {ps.redCard && <span>🟥</span>}
              <span className="text-muted-foreground text-xs">{ps.minutesPlayed}&apos;</span>
            </div>
          </div>
        ))}
        {player.playerStats.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Belum ada riwayat pertandingan</p>
        )}
      </div>
    </div>
  )
}
