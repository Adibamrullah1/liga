import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { playerSchema } from '@/lib/validations/player'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('teamId')

    const players = await prisma.player.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const data = playerSchema.parse(body)

    const player = await prisma.player.create({
      data,
    })
    return NextResponse.json(player, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}
