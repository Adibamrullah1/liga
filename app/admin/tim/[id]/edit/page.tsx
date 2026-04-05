export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TeamForm from '@/components/admin/TeamForm'

export default async function EditTimPage({ params }: { params: { id: string } }) {
  const team = await prisma.team.findUnique({ where: { id: params.id } })
  if (!team) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Edit Tim</h1>
        <p className="text-muted-foreground">Edit data {team.name}</p>
      </div>
      <TeamForm mode="edit" initialData={team} />
    </div>
  )
}
