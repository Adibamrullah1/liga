export const revalidate = 60

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, ClipboardCheck } from 'lucide-react'
import { formatDateTime, getStatusBadgeColor, getStatusLabel } from '@/lib/utils'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminPertandinganPage() {
  const matches = await prisma.match.findMany({
    include: { homePlayer: true, awayPlayer: true, season: true },
    orderBy: { scheduledAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Kelola Pertandingan</h1>
          <p className="text-muted-foreground">{matches.length} pertandingan</p>
        </div>
        <Link href="/admin/pertandingan/tambah"
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Buat Pertandingan
        </Link>
      </div>

      <div className="game-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Pertandingan</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Skor</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Status</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Musim</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Jadwal</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b border-border/30 table-row-hover transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-foreground">{match.homePlayer.name}</span>
                    <span className="text-muted-foreground mx-2">vs</span>
                    <span className="font-semibold text-foreground">{match.awayPlayer.name}</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {match.status === 'FINISHED' ? (
                      <span className="font-gaming font-bold">{match.homeScore} : {match.awayScore}</span>
                    ) : '-'}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(match.status)}`}>
                      {getStatusLabel(match.status)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-muted-foreground text-xs">{match.season.name}</td>
                  <td className="text-center py-3 px-4 text-muted-foreground text-xs">{formatDateTime(match.scheduledAt)}</td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {match.status === 'SCHEDULED' && (
                        <>
                          <Link href={`/admin/pertandingan/${match.id}/edit`}
                            className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors flex items-center justify-center">
                            ✎
                          </Link>
                          <Link href={`/admin/pertandingan/${match.id}/hasil`}
                            className="px-3 py-1.5 rounded-lg bg-gaming-accent/10 text-gaming-accent text-xs font-semibold hover:bg-gaming-accent/20 transition-colors inline-flex items-center gap-1">
                            <ClipboardCheck className="w-3.5 h-3.5" /> Input Hasil
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
  )
}
