'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MatchForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [seasons, setSeasons] = useState<any[]>([])
  const [form, setForm] = useState({
    seasonId: '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledAt: '',
  })

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).then(setTeams).catch(() => {})
    fetch('/api/seasons').then(r => r.json()).then((data) => {
      setSeasons(data)
      const active = data.find((s: any) => s.isActive)
      if (active) setForm(f => ({ ...f, seasonId: active.id }))
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.homeTeamId === form.awayTeamId) {
      setError('Tim home dan away tidak boleh sama')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal membuat pertandingan')
      }

      router.push('/admin/pertandingan')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Musim *</label>
        <select value={form.seasonId} onChange={(e) => setForm({ ...form, seasonId: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required>
          <option value="">Pilih Musim</option>
          {seasons.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name} {s.isActive ? '(Aktif)' : ''}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tim Home *</label>
          <select value={form.homeTeamId} onChange={(e) => setForm({ ...form, homeTeamId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required>
            <option value="">Pilih Tim Home</option>
            {teams.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tim Away *</label>
          <select value={form.awayTeamId} onChange={(e) => setForm({ ...form, awayTeamId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required>
            <option value="">Pilih Tim Away</option>
            {teams.filter((t: any) => t.id !== form.homeTeamId).map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Jadwal *</label>
        <input type="datetime-local" value={form.scheduledAt}
          onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 disabled:opacity-50">
          {loading ? 'Menyimpan...' : 'Buat Pertandingan'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border/50 transition-all">
          Batal
        </button>
      </div>
    </form>
  )
}
