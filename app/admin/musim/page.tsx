'use client'

import { useState, useEffect } from 'react'
import { CalendarClock, Plus, CheckCircle } from 'lucide-react'

export default function AdminMusimPage() {
  const [seasons, setSeasons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false,
  })

  const fetchSeasons = async () => {
    const res = await fetch('/api/seasons')
    const data = await res.json()
    setSeasons(data)
    setLoading(false)
  }

  useEffect(() => { fetchSeasons() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setShowForm(false)
      setForm({ name: '', startDate: '', endDate: '', isActive: false })
      fetchSeasons()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Kelola Musim</h1>
          <p className="text-muted-foreground">{seasons.length} musim terdaftar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Musim
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="game-card p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground">Musim Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nama Musim *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Contoh: Season 2 - 2025" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tanggal Mulai *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tanggal Selesai *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-primary text-primary" />
            <span className="text-sm text-foreground">Jadikan musim aktif</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-lg bg-secondary text-muted-foreground border border-border/50">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {seasons.map((season: any) => (
          <div key={season.id} className="game-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <CalendarClock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{season.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(season.startDate).toLocaleDateString('id-ID')} — {new Date(season.endDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{season._count?.matches || 0} pertandingan</span>
              {season.isActive && (
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Aktif
                </span>
              )}
            </div>
          </div>
        ))}
        {!loading && seasons.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Belum ada musim. Buat musim pertama!</p>
        )}
      </div>
    </div>
  )
}
