export const revalidate = 0

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, ClipboardCheck, Pencil } from 'lucide-react'
import { formatDateTime, getStatusBadgeColor, getStatusLabel } from '@/lib/utils'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminPertandinganPage() {
  const matches = await prisma.match.findMany({
    select: {
      id: true, status: true, homeScore: true, awayScore: true, scheduledAt: true,
      homePlayer: { select: { id: true, name: true, shortName: true } },
      awayPlayer: { select: { id: true, name: true, shortName: true } },
      season: { select: { name: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  const scheduled = matches.filter(m => m.status === 'SCHEDULED').length
  const finished = matches.filter(m => m.status === 'FINISHED').length

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Kelola Pertandingan</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {matches.length} total · {scheduled} terjadwal · {finished} selesai
          </p>
        </div>
        <Link href="/admin/pertandingan/tambah"
          className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Buat</span> Pertandingan
        </Link>
      </div>

      {/* Table */}
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
              {matches.map((match) => (
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
                  <td className="text-center py-3 px-3 text-muted-foreground text-xs hidden sm:table-cell whitespace-nowrap">{formatDateTime(match.scheduledAt)}</td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {match.status === 'SCHEDULED' && (
                        <>
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
        {matches.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">Belum ada pertandingan.</p>
        )}
      </div>
    </div>
  )
}
