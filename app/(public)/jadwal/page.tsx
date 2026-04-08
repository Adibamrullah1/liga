export const revalidate = 0

import { prisma } from '@/lib/prisma'
import ScheduleClient from '@/components/public/ScheduleClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jadwal & Hasil Pertandingan',
  description: 'Lihat jadwal dan hasil pertandingan liga eFootball',
}

async function getMatches(seasonIdParam?: string) {
  const seasons = await prisma.season.findMany({
    orderBy: { startDate: 'desc' }
  })

  // Jika parameter dikirim, pakai itu. Kalau tidak, default ke yang Aktif, atau fallback terbawah
  let targetSeason = undefined
  if (seasonIdParam) {
    targetSeason = seasons.find(s => s.id === seasonIdParam)
  }
  if (!targetSeason) {
    targetSeason = seasons.find(s => s.isActive) || seasons[0]
  }

  if (!targetSeason) {
    return { scheduled: [], finished: [], seasons: [], activeSeasonId: null }
  }

  const [scheduled, finished] = await Promise.all([
    prisma.match.findMany({
      where: { status: { in: ['SCHEDULED', 'LIVE'] }, seasonId: targetSeason.id },
      select: {
        id: true, status: true, homeScore: true, awayScore: true, scheduledAt: true,
        homePlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
        awayPlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    }),
    prisma.match.findMany({
      where: { status: 'FINISHED', seasonId: targetSeason.id },
      select: {
        id: true, status: true, homeScore: true, awayScore: true, scheduledAt: true,
        homePlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
        awayPlayer: { select: { id: true, name: true, shortName: true, avatarUrl: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    }),
  ])
  
  return { scheduled, finished, seasons, activeSeasonId: targetSeason.id }
}

export default async function JadwalPage({ searchParams }: { searchParams: { season?: string } }) {
  const { scheduled, finished, seasons, activeSeasonId } = await getMatches(searchParams.season)
  
  return <ScheduleClient scheduled={scheduled} finished={finished} seasons={seasons} currentSeasonId={activeSeasonId} />
}
