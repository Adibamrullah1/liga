export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

export default async function AdminTimPage() {
  const teams = await prisma.team.findMany({
    include: { _count: { select: { players: true, homeMatches: true, awayMatches: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Kelola Tim</h1>
          <p className="text-muted-foreground">{teams.length} tim terdaftar</p>
        </div>
        <Link
          href="/admin/tim/tambah"
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Tim
        </Link>
      </div>

      <div className="game-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Tim</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Singkatan</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Kota</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Pemain</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Pertandingan</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-border/30 table-row-hover transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-xs font-bold text-primary">
                        {team.shortName}
                      </div>
                      <span className="font-semibold text-foreground">{team.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-muted-foreground font-mono">{team.shortName}</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">{team.city || '-'}</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-primary font-semibold">{team._count.players}</span>
                  </td>
                  <td className="text-center py-3 px-4 text-muted-foreground">
                    {team._count.homeMatches + team._count.awayMatches}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/tim/${team.id}/edit`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
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
