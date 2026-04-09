'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ClipboardCheck, Pencil, Calendar } from 'lucide-react'
import { formatShortDate, formatTime, getStatusBadgeColor, getStatusLabel, formatDayDate } from '@/lib/utils'
import DeleteButton from '@/components/admin/DeleteButton'
import RescheduleButton from '@/components/admin/RescheduleButton'
import SeasonSelector from '@/components/public/SeasonSelector'

interface Player {
  id: string
  name: string
  shortName: string
}

interface Match {
  id: string
  status: string
  homeScore: number | null
  awayScore: number | null
  scheduledAt: string | Date
  homePlayer: Player
  awayPlayer: Player
  season: { name: string }
}

interface MatchTableClientProps {
  matches: Match[]
  seasons: {id: string, name: string, isActive: boolean}[]
  currentSeasonId: string | null
}

export default function MatchTableClient({ matches, seasons, currentSeasonId }: MatchTableClientProps) {
  const [search, setSearch] = useState('')

  // Filter matches based on search query
  const filteredMatches = useMemo(() => {
    if (!search.trim()) return matches
    const q = search.toLowerCase()
    return matches.filter(match => {
      const homeName = match.homePlayer.name?.toLowerCase() || ''
      const awayName = match.awayPlayer.name?.toLowerCase() || ''
      const homeShort = match.homePlayer.shortName?.toLowerCase() || ''
      const awayShort = match.awayPlayer.shortName?.toLowerCase() || ''
      
      return homeName.includes(q) || awayName.includes(q) || homeShort.includes(q) || awayShort.includes(q)
    })
  }, [matches, search])

  // Group matches by day/date
  const groupedMatches = useMemo(() => {
    const grouped = new Map<string, Match[]>()
    filteredMatches.forEach(match => {
      const dateKey = formatDayDate(match.scheduledAt)
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(match)
    })
    return Array.from(grouped.entries())
  }, [filteredMatches])

  return (
    <div className="space-y-6">
      {/* Search Bar & Season Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SeasonSelector seasons={seasons} currentSeasonId={currentSeasonId || undefined} />

        <div className="relative w-full sm:w-64">
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
      {search && groupedMatches.length === 0 && (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
          <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-semibold">Tidak ada kecocokan</p>
          <p className="text-sm text-muted-foreground">Coba kata kunci pencarian yang lain.</p>
        </div>
      )}

      {!search && matches.length === 0 && (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Belum ada pertandingan.</p>
        </div>
      )}

      {/* Grouped Match Tables */}
      {groupedMatches.map(([dateConfig, dayMatches]) => (
        <div key={dateConfig} className="space-y-3">
          <div className="inline-block px-3 py-1.5 rounded-lg bg-secondary text-foreground font-semibold text-sm border border-border/50">
            {dateConfig}
          </div>
          
          <div className="game-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Pertandingan</th>
                    <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase">Skor</th>
                    <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase">Status</th>
                    <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase hidden md:table-cell">Musim</th>
                    <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase hidden sm:table-cell">Jadwal</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dayMatches.map((match) => (
                    <tr key={match.id} className="border-b border-border/30 table-row-hover transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground text-xs sm:text-sm">{match.homePlayer.name}</span>
                          <span className="text-muted-foreground text-xs">vs</span>
                          <span className="font-semibold text-foreground text-xs sm:text-sm">{match.awayPlayer.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-3">
                        {match.status === 'FINISHED' ? (
                          <span className="font-gaming font-bold tabular-nums text-sm">{match.homeScore} : {match.awayScore}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(match.status)}`}>
                          {getStatusLabel(match.status)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-3 text-muted-foreground text-xs hidden md:table-cell">{match.season.name}</td>
                      <td className="text-center py-3 px-3 text-muted-foreground text-xs hidden sm:table-cell">
                        <div className="font-semibold text-primary">{formatTime(match.scheduledAt)} WIB</div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {match.status === 'SCHEDULED' && (
                            <>
                              <RescheduleButton
                                matchId={match.id}
                                currentSchedule={match.scheduledAt}
                                matchLabel={`${match.homePlayer.name} vs ${match.awayPlayer.name}`}
                              />
                              <Link href={`/admin/pertandingan/${match.id}/edit`}
                                className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center"
                                title="Edit">
                                <Pencil className="w-3.5 h-3.5" />
                              </Link>
                              <Link href={`/admin/pertandingan/${match.id}/hasil`}
                                className="px-2 py-1.5 rounded-lg bg-gaming-accent/10 text-gaming-accent text-xs font-semibold hover:bg-gaming-accent/20 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                                title="Input Hasil">
                                <ClipboardCheck className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Input</span>
                              </Link>
                            </>
                          )}
                          <DeleteButton apiUrl={`/api/matches/${match.id}`} confirmMessage="Hapus pertandingan ini?" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
