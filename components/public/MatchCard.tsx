'use client'

import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { formatDateTime, getStatusBadgeColor, getStatusLabel } from '@/lib/utils'

interface MatchCardProps {
  match: {
    id: string
    status: string
    homeScore: number | null
    awayScore: number | null
    scheduledAt: string
    homeTeam: { id: string; name: string; shortName: string }
    awayTeam: { id: string; name: string; shortName: string }
  }
}

export default function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === 'FINISHED'
  const isLive = match.status === 'LIVE'

  return (
    <div className="game-card p-5 group">
      {/* Status & Date */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(match.status)} ${isLive ? 'pulse-live' : ''}`}>
          {isLive && <span className="w-2 h-2 rounded-full bg-red-400 mr-1.5 animate-pulse" />}
          {getStatusLabel(match.status)}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDateTime(match.scheduledAt)}
        </span>
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <Link href={`/tim/${match.homeTeam.id}`} className="flex-1 text-center group/team">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-sm font-bold text-primary mb-2 group-hover/team:neon-glow transition-all duration-300">
            {match.homeTeam.shortName}
          </div>
          <p className="text-sm font-semibold text-foreground group-hover/team:text-primary transition-colors truncate">
            {match.homeTeam.name}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Home</p>
        </Link>

        {/* Score */}
        <div className="text-center px-4">
          {isFinished || isLive ? (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-gaming font-bold text-foreground">{match.homeScore}</span>
              <span className="text-lg text-muted-foreground font-bold">:</span>
              <span className="text-3xl font-gaming font-bold text-foreground">{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-lg font-heading font-bold text-muted-foreground">VS</div>
          )}
        </div>

        {/* Away Team */}
        <Link href={`/tim/${match.awayTeam.id}`} className="flex-1 text-center group/team">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-gaming-accent/20 to-secondary flex items-center justify-center text-sm font-bold text-gaming-accent mb-2 group-hover/team:shadow-lg group-hover/team:shadow-gaming-accent/20 transition-all duration-300">
            {match.awayTeam.shortName}
          </div>
          <p className="text-sm font-semibold text-foreground group-hover/team:text-gaming-accent transition-colors truncate">
            {match.awayTeam.name}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Away</p>
        </Link>
      </div>
    </div>
  )
}
