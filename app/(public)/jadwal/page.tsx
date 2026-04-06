export const revalidate = 60

import { prisma } from '@/lib/prisma'
import MatchCard from '@/components/public/MatchCard'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

async function getMatches() {
  const [scheduled, finished] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'SCHEDULED' },
      include: { homePlayer: true, awayPlayer: true },
      orderBy: { scheduledAt: 'asc' },
      take: 20, // Batasi tampilan awal
    }),
    prisma.match.findMany({
      where: { status: 'FINISHED' },
      include: { homePlayer: true, awayPlayer: true },
      orderBy: { scheduledAt: 'desc' },
      take: 10,
    }),
  ])
  const [totalScheduled, totalFinished] = await Promise.all([
    prisma.match.count({ where: { status: 'SCHEDULED' } }),
    prisma.match.count({ where: { status: 'FINISHED' } }),
  ])
  return { scheduled, finished, totalScheduled, totalFinished }
}

export default async function JadwalPage() {
  const { scheduled, finished, totalScheduled, totalFinished } = await getMatches()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-blue-600/10 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-neon-blue" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Jadwal & Hasil</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {totalFinished} selesai · {totalScheduled} mendatang
          </p>
        </div>
      </div>

      {/* Upcoming Matches */}
      {scheduled.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              Jadwal Mendatang
            </h2>
            {totalScheduled > 20 && (
              <span className="text-xs text-muted-foreground">
                Menampilkan 20 dari {totalScheduled}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {scheduled.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Finished Matches */}
      {finished.length > 0 && (
        <section>
          <h2 className="font-heading text-lg md:text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            Hasil Pertandingan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {finished.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {scheduled.length === 0 && finished.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Belum ada jadwal pertandingan</p>
        </div>
      )}
    </div>
  )
}
