'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MatchFormProps {
  initialData?: any
}

export default function MatchForm({ initialData }: MatchFormProps = {}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [players, setPlayers] = useState<any[]>([])
  const [seasons, setSeasons] = useState<any[]>([])
  const [form, setForm] = useState({
    seasonId: initialData?.seasonId || '',
    homePlayerId: initialData?.homePlayerId || '',
    awayPlayerId: initialData?.awayPlayerId || '',
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : '',
  })

  useEffect(() => {
    fetch('/api/players').then(r => r.json()).then(setPlayers).catch(() => {})
    fetch('/api/seasons').then(r => r.json()).then((data) => {
      setSeasons(data)
      if (!initialData?.seasonId) {
        const active = data.find((s: any) => s.isActive)
        if (active) setForm(f => ({ ...f, seasonId: active.id }))
      }
    }).catch(() => {})
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.homePlayerId === form.awayPlayerId) {
      setError('Player home dan away tidak boleh sama')
      setLoading(false)
      return
    }

    try {
      const url = initialData ? `/api/matches/${initialData.id}` : '/api/matches'
      const method = initialData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
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
          <label className="block text-sm font-medium text-foreground mb-2">Player 1 (Home) *</label>
          <select value={form.homePlayerId} onChange={(e) => setForm({ ...form, homePlayerId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required>
            <option value="">Pilih Player Home</option>
            {players.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Player 2 (Away) *</label>
          <select value={form.awayPlayerId} onChange={(e) => setForm({ ...form, awayPlayerId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required>
            <option value="">Pilih Player Away</option>
            {players.filter((p: any) => p.id !== form.homePlayerId).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
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
          {loading ? 'Menyimpan...' : (initialData ? 'Update Pertandingan' : 'Buat Pertandingan')}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border/50 transition-all">
          Batal
        </button>
      </div>
    </form>
  )
}
