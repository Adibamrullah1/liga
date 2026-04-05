import TeamForm from '@/components/admin/TeamForm'

export default function TambahTimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Tambah Tim Baru</h1>
        <p className="text-muted-foreground">Isi data tim di bawah ini</p>
      </div>
      <TeamForm mode="create" />
    </div>
  )
}
