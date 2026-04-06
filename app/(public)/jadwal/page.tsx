export const revalidate = 60

import { prisma } from '@/lib/prisma'
import MatchCard from '@/components/public/MatchCard'
import { Calendar, CheckCircle, Clock, List } from 'lucide-react'
import Link from 'next/link'

async function getMatches() {
  const [allMatches, seasons] = await Promise.all([
    prisma.match.findMany({
      include: { homePlayer: true, awayPlayer: true, season: true },
      orderBy: { scheduledAt: 'desc' },
    }),
    prisma.season.findMany({ orderBy: { startDate: 'desc' } }),
  ])
  return { allMatches, seasons }
}

export default async function JadwalPage() {
  const { allMatches, seasons } = await getMatches()

  const scheduled = allMatches.filter(m => m.status === 'SCHEDULED')
  const finished = allMatches.filter(m => m.status === 'FINISHED')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-blue-600/10 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-neon-blue" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Jadwal & Hasil</h1>
          <p className="text-sm text-muted-foreground">
            {allMatches.length} pertandingan · {finished.length} selesai · {scheduled.length} mendatang
          </p>
        </div>
      </div>

      {/* Upcoming Matches */}
      {scheduled.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            Jadwal Mendatang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduled.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Finished Matches */}
      {finished.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Hasil Pertandingan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finished.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {allMatches.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Belum ada jadwal pertandingan</p>
        </div>
      )}
    </div>
  )
}
