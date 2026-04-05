import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const stats = await prisma.playerStat.findMany({
      where: { playerId: params.id },
      include: {
        match: {
          include: {
            homeTeam: { select: { name: true, shortName: true } },
            awayTeam: { select: { name: true, shortName: true } },
            season: { select: { name: true } },
          },
        },
      },
      orderBy: { match: { scheduledAt: 'desc' } },
    })

    const summary = {
      totalMatches: stats.length,
      totalGoals: stats.reduce((sum, s) => sum + s.goals, 0),
      totalAssists: stats.reduce((sum, s) => sum + s.assists, 0),
      avgRating: stats.filter(s => s.rating).length > 0
        ? stats.filter(s => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) / stats.filter(s => s.rating).length
        : null,
      yellowCards: stats.filter(s => s.yellowCard).length,
      redCards: stats.filter(s => s.redCard).length,
      totalMinutes: stats.reduce((sum, s) => sum + s.minutesPlayed, 0),
    }

    return NextResponse.json({ stats, summary })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch player stats' }, { status: 500 })
  }
}
