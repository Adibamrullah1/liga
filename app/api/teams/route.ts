import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { teamSchema } from '@/lib/validations/team'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: { select: { players: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const data = teamSchema.parse(body)

    const team = await prisma.team.create({ data })
    return NextResponse.json(team, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}
