'use client'

import { useState, useMemo } from 'react'
import MatchCard from '@/components/public/MatchCard'
import { Calendar, CheckCircle, Clock, Search } from 'lucide-react'
import { formatDayDate } from '@/lib/utils'

interface Player {
  id: string
  name: string
  shortName: string
  avatarUrl: string | null
}

interface Match {
  id: string
  status: string
  homeScore: number | null
  awayScore: number | null
  scheduledAt: string | Date
  homePlayer: Player
  awayPlayer: Player
}

interface ScheduleClientProps {
  scheduled: Match[]
  finished: Match[]
}

export default function ScheduleClient({ scheduled, finished }: ScheduleClientProps) {
  const [search, setSearch] = useState('')

  // Filter function
  const matchSearch = (match: Match) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      match.homePlayer.name.toLowerCase().includes(q) ||
      match.awayPlayer.name.toLowerCase().includes(q) ||
      match.homePlayer.shortName.toLowerCase().includes(q) ||
      match.awayPlayer.shortName.toLowerCase().includes(q)
    )
  }

  // Filtered lists
  const filteredScheduled = useMemo(() => scheduled.filter(matchSearch), [scheduled, search])
  const filteredFinished = useMemo(() => finished.filter(matchSearch), [finished, search])

  // Group by date (formatDayDate returns standard string representing the day)
  const groupMatches = (matches: Match[]) => {
    const grouped = new Map<string, Match[]>()
    matches.forEach(match => {
      const dateKey = formatDayDate(match.scheduledAt)
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(match)
    })
    return Array.from(grouped.entries())
  }

  const groupedScheduled = useMemo(() => groupMatches(filteredScheduled), [filteredScheduled])
  const groupedFinished = useMemo(() => groupMatches(filteredFinished), [filteredFinished])

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-blue-600/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-neon-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Jadwal & Hasil</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {finished.length} selesai · {scheduled.length} mendatang
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72 mt-2 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* No Results Fallback */}
      {search && filteredScheduled.length === 0 && filteredFinished.length === 0 && (
        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border/50">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-foreground font-semibold">Tidak ada hasil ditemukan</p>
          <p className="text-sm text-muted-foreground">Coba gunakan kata kunci nama player yang lain.</p>
        </div>
      )}

      {/* Upcoming Matches */}
      {groupedScheduled.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="font-heading text-xl font-bold text-foreground">Jadwal Mendatang</h2>
          </div>

          <div className="space-y-8">
            {groupedScheduled.map(([dateConfig, dayMatches]) => (
              <div key={dateConfig}>
                <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-blue-500/10 text-blue-400 font-semibold text-sm border border-blue-500/20">
                  {dateConfig}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {dayMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Finished Matches */}
      {groupedFinished.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h2 className="font-heading text-xl font-bold text-foreground">Hasil Pertandingan</h2>
          </div>

          <div className="space-y-8">
            {groupedFinished.map(([dateConfig, dayMatches]) => (
              <div key={dateConfig}>
                <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-green-500/10 text-green-400 font-semibold text-sm border border-green-500/20">
                  {dateConfig}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {dayMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!search && scheduled.length === 0 && finished.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Belum ada pertandingan dijadwalkan uuntuk musim ini.</p>
        </div>
      )}
    </div>
  )
}
