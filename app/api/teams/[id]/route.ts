import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { teamSchema } from '@/lib/validations/team'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        players: {
          include: {
            playerStats: {
              include: { match: true },
            },
          },
        },
        homeMatches: {
          include: { awayTeam: true, season: true },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
        awayMatches: {
          include: { homeTeam: true, season: true },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const data = teamSchema.parse(body)

    const team = await prisma.team.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(team)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.team.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Team deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
}
