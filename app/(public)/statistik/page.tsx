export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { BarChart3, Target, Trophy, Star } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const topScorers = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { goals: { gt: 0 } },
    _sum: { goals: true, assists: true },
    _count: { playerId: true },
    orderBy: { _sum: { goals: 'desc' } },
    take: 10,
  })

  const topAssists = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { assists: { gt: 0 } },
    _sum: { assists: true, goals: true },
    _count: { playerId: true },
    orderBy: { _sum: { assists: 'desc' } },
    take: 10,
  })

  const bestRatings = await prisma.playerStat.groupBy({
    by: ['playerId'],
    where: { rating: { not: null } },
    _avg: { rating: true },
    _count: { playerId: true },
    orderBy: { _avg: { rating: 'desc' } },
    take: 10,
  })

  const enrich = async (list: any[]) => {
    return Promise.all(list.map(async (item) => {
      const player = await prisma.player.findUnique({
        where: { id: item.playerId },
        include: { team: { select: { name: true, shortName: true } } },
      })
      return { ...item, player }
    }))
  }

  return {
    topScorers: await enrich(topScorers),
    topAssists: await enrich(topAssists),
    bestRatings: await enrich(bestRatings),
  }
}

export default async function StatistikPage() {
  const stats = await getStats()

  const renderTable = (
    data: any[],
    title: string,
    icon: React.ReactNode,
    valueKey: string,
    valueLabel: string,
    color: string,
  ) => {
    const maxVal = data.length > 0
      ? (valueKey === 'rating' ? (data[0]._avg?.rating || 0) : (data[0]._sum?.[valueKey] || 0))
      : 1

    return (
      <div className="game-card overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            {icon} {title}
          </h2>
        </div>
        <div className="divide-y divide-border/30">
          {data.map((item, index) => {
            const value = valueKey === 'rating'
              ? item._avg?.rating?.toFixed(1) || '0'
              : item._sum?.[valueKey] || 0
            const barWidth = valueKey === 'rating'
              ? ((item._avg?.rating || 0) / 10) * 100
              : (Number(value) / Number(maxVal)) * 100

            return (
              <div key={item.playerId} className="p-4 table-row-hover transition-colors flex items-center gap-4 relative overflow-hidden">
                {/* Bar background */}
                <div className={`absolute inset-y-0 left-0 ${color} opacity-5`} style={{ width: `${barWidth}%` }} />

                <div className="relative flex items-center gap-4 w-full">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'badge-gold' : index === 1 ? 'badge-silver' : index === 2 ? 'badge-bronze' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>

                  <Link href={`/pemain/${item.playerId}`} className="flex-1 min-w-0 group">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {item.player?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.player?.team?.name || 'No team'} · {item._count?.playerId || 0} pertandingan
                    </p>
                  </Link>

                  <div className="text-right">
                    <span className={`font-gaming text-2xl font-bold ${color.replace('bg-', 'text-').replace('/20', '')}`}>
                      {value}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase">{valueLabel}</p>
                  </div>
                </div>
              </div>
            )
          })}
          {data.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">Belum ada data</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gaming-accent/20 to-orange-600/10 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-gaming-accent" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Statistik Liga</h1>
          <p className="text-sm text-muted-foreground">Top scorer, assist, dan rating terbaik</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderTable(
          stats.topScorers,
          'Top Scorer',
          <Target className="w-5 h-5 text-neon" />,
          'goals',
          'Gol',
          'bg-neon/20',
        )}
        {renderTable(
          stats.topAssists,
          'Top Assist',
          <Trophy className="w-5 h-5 text-gaming-accent" />,
          'assists',
          'Assist',
          'bg-gaming-accent/20',
        )}
        {renderTable(
          stats.bestRatings,
          'Rating Terbaik',
          <Star className="w-5 h-5 text-yellow-400" />,
          'rating',
          'Avg',
          'bg-yellow-500/20',
        )}
      </div>
    </div>
  )
}
