export const revalidate = 60

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Trophy, Star, Clock } from 'lucide-react'
import { getPositionLabel, formatShortDate } from '@/lib/utils'

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
  })

  if (!player) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/pemain" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Player
      </Link>

      {/* Player Header */}
      <div className="game-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-4xl font-bold text-primary/50 shrink-0 overflow-hidden">
            {player.avatarUrl ? (
              <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : player.shortName}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-4xl font-bold text-foreground">{player.name}</h1>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{player.shortName}</span>
            </div>
            <p className="text-muted-foreground">@{player.username}</p>
            {player.city && <p className="text-sm text-muted-foreground mt-2">📍 {player.city}</p>}
            {player.description && <p className="text-sm text-muted-foreground mt-2">{player.description}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
