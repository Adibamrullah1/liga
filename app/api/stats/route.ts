import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const seasonId = searchParams.get('seasonId')

    const matchFilter = seasonId ? { match: { seasonId } } : {}

    // Top Scorer
    const topScorers = await prisma.playerStat.groupBy({
      by: ['playerId'],
      where: { goals: { gt: 0 }, ...matchFilter },
      _sum: { goals: true, assists: true },
      orderBy: { _sum: { goals: 'desc' } },
      take: 10,
    })

    // Top Assist
    const topAssists = await prisma.playerStat.groupBy({
      by: ['playerId'],
      where: { assists: { gt: 0 }, ...matchFilter },
      _sum: { assists: true, goals: true },
      orderBy: { _sum: { assists: 'desc' } },
      take: 10,
    })

    // Best Rating
    const bestRatings = await prisma.playerStat.groupBy({
      by: ['playerId'],
      where: { rating: { not: null }, ...matchFilter },
      _avg: { rating: true },
      _count: { playerId: true },
      orderBy: { _avg: { rating: 'desc' } },
      take: 10,
    })

    const enrichWithPlayer = async (statList: any[]) => {
      return Promise.all(
        statList.map(async (stat) => {
          const player = await prisma.player.findUnique({
            where: { id: stat.playerId },
            include: { team: { select: { name: true, shortName: true } } },
          })
          return { ...stat, player }
        })
      )
    }

    return NextResponse.json({
      topScorers: await enrichWithPlayer(topScorers),
      topAssists: await enrichWithPlayer(topAssists),
      bestRatings: await enrichWithPlayer(bestRatings),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
