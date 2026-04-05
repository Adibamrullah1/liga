import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { playerSchema } from '@/lib/validations/player'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: {
        team: true,
        playerStats: {
          include: {
            match: {
              include: {
                homeTeam: { select: { name: true, shortName: true } },
                awayTeam: { select: { name: true, shortName: true } },
              },
            },
          },
          orderBy: { match: { scheduledAt: 'desc' } },
        },
      },
    })

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const data = playerSchema.parse(body)

    const player = await prisma.player.update({
      where: { id: params.id },
      data,
      include: { team: true },
    })
    return NextResponse.json(player)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.player.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Player deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
  }
}
