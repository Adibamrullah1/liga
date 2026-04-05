'use client'

import { Trophy, Target, Star } from 'lucide-react'

interface StatsBannerProps {
  topScorer?: { player: { name: string; team?: { shortName: string } | null }; _sum: { goals: number } } | null
  topAssist?: { player: { name: string; team?: { shortName: string } | null }; _sum: { assists: number } } | null
  bestRating?: { player: { name: string; team?: { shortName: string } | null }; _avg: { rating: number } } | null
}

export default function StatsBanner({ topScorer, topAssist, bestRating }: StatsBannerProps) {
  const stats = [
    {
      icon: Target,
      label: 'Top Scorer',
      name: topScorer?.player?.name || '-',
      team: topScorer?.player?.team?.shortName || '',
      value: topScorer?._sum?.goals ? `${topScorer._sum.goals} gol` : '-',
      color: 'from-neon/20 to-neon-blue/20 border-neon/30',
      iconColor: 'text-neon',
    },
    {
      icon: Trophy,
      label: 'Top Assist',
      name: topAssist?.player?.name || '-',
      team: topAssist?.player?.team?.shortName || '',
      value: topAssist?._sum?.assists ? `${topAssist._sum.assists} assist` : '-',
      color: 'from-gaming-accent/20 to-orange-600/20 border-gaming-accent/30',
      iconColor: 'text-gaming-accent',
    },
    {
      icon: Star,
      label: 'Best Rating',
      name: bestRating?.player?.name || '-',
      team: bestRating?.player?.team?.shortName || '',
      value: bestRating?._avg?.rating ? `${bestRating._avg.rating.toFixed(1)}` : '-',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`rounded-xl bg-gradient-to-r ${stat.color} border p-5 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{stat.name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">{stat.team}</span>
              <span className={`font-gaming text-lg font-bold ${stat.iconColor}`}>{stat.value}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
