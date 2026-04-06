import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const seasonId = searchParams.get('seasonId')
    const playerId = searchParams.get('playerId')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (status) where.status = status
    if (seasonId) where.seasonId = seasonId
    if (playerId) {
      where.OR = [{ homePlayerId: playerId }, { awayPlayerId: playerId }]
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homePlayer: true,
        awayPlayer: true,
        season: true,
      },
      orderBy: { scheduledAt: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    })
    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    if (body.homePlayerId === body.awayPlayerId) {
      return NextResponse.json({ error: 'Player home dan away tidak boleh sama' }, { status: 400 })
    }

    const match = await prisma.match.create({
      data: {
        seasonId: body.seasonId,
        homePlayerId: body.homePlayerId,
        awayPlayerId: body.awayPlayerId,
        scheduledAt: new Date(body.scheduledAt),
        status: 'SCHEDULED',
      },
      include: { homePlayer: true, awayPlayer: true, season: true },
    })
    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}
