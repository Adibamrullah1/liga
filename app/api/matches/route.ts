import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const seasonId = searchParams.get('seasonId')
    const teamId = searchParams.get('teamId')
    const limit = searchParams.get('limit')

    const where: any = {}
    if (status) where.status = status
    if (seasonId) where.seasonId = seasonId
    if (teamId) {
      where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }]
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        season: true,
        _count: { select: { playerStats: true } },
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

    if (body.homeTeamId === body.awayTeamId) {
      return NextResponse.json({ error: 'Tim home dan away tidak boleh sama' }, { status: 400 })
    }

    const match = await prisma.match.create({
      data: {
        seasonId: body.seasonId,
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        scheduledAt: new Date(body.scheduledAt),
        status: 'SCHEDULED',
      },
      include: { homeTeam: true, awayTeam: true, season: true },
    })
    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}
