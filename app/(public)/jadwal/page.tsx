export const revalidate = 60

import { prisma } from '@/lib/prisma'
import ScheduleClient from '@/components/public/ScheduleClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jadwal & Hasil Pertandingan',
  description: 'Lihat jadwal dan hasil pertandingan liga eFootball',
}

async function getMatches() {
  const season = await prisma.season.findFirst({
    where: { isActive: true },
    select: { id: true, name: true }
  })

  if (!season) {
    return { scheduled: [], finished: [] }
  }

  const [scheduled, finished] = await Promise.all([
    prisma.match.findMany({
      where: { status: { in: ['SCHEDULED', 'LIVE'] }, seasonId: season.id },
      select: {
        id: true, status: true, homeScore: true, awayScore: true, scheduledAt: true,
        homePlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
        awayPlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    }),
    prisma.match.findMany({
      where: { status: 'FINISHED', seasonId: season.id },
      select: {
        id: true, status: true, homeScore: true, awayScore: true, scheduledAt: true,
        homePlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
        awayPlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    }),
  ])
  
  return { scheduled, finished }
}

export default async function JadwalPage() {
  const { scheduled, finished } = await getMatches()
  
  return <ScheduleClient scheduled={scheduled} finished={finished} />
}
