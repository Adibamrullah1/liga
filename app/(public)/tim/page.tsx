export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import TeamCard from '@/components/public/TeamCard'
import { Users } from 'lucide-react'

export default async function TimPage() {
  const teams = await prisma.team.findMany({
    include: { _count: { select: { players: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-neon-blue/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Daftar Tim</h1>
          <p className="text-sm text-muted-foreground">{teams.length} tim terdaftar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team: any) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Belum ada tim terdaftar</p>
        </div>
      )}
    </div>
  )
}
