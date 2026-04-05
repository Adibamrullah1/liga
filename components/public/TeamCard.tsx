'use client'

import Link from 'next/link'
import { Users, MapPin } from 'lucide-react'

interface TeamCardProps {
  team: {
    id: string
    name: string
    shortName: string
    city: string | null
    description: string | null
    _count?: { players: number }
  }
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/tim/${team.id}`} className="game-card p-6 block group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-lg font-bold text-primary group-hover:neon-glow transition-all duration-300 shrink-0">
          {team.shortName}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {team.name}
          </h3>
          {team.city && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {team.city}
            </p>
          )}
          {team.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{team.description}</p>
          )}
        </div>
      </div>
      {team._count && (
        <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{team._count.players} pemain</span>
        </div>
      )}
    </Link>
  )
}
