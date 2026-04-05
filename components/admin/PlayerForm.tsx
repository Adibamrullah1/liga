'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PlayerFormProps {
  initialData?: {
    id?: string
    name: string
    username: string
    position: string
    nationality: string | null
    avatarUrl: string | null
    teamId: string | null
  }
  mode: 'create' | 'edit'
}

const positions = [
  { value: 'GK', label: 'Goalkeeper (GK)' },
  { value: 'CB', label: 'Center Back (CB)' },
  { value: 'LB', label: 'Left Back (LB)' },
  { value: 'RB', label: 'Right Back (RB)' },
  { value: 'CDM', label: 'Defensive Mid (CDM)' },
  { value: 'CM', label: 'Central Mid (CM)' },
  { value: 'CAM', label: 'Attacking Mid (CAM)' },
  { value: 'LW', label: 'Left Wing (LW)' },
  { value: 'RW', label: 'Right Wing (RW)' },
  { value: 'ST', label: 'Striker (ST)' },
  { value: 'CF', label: 'Center Forward (CF)' },
]

export default function PlayerForm({ initialData, mode }: PlayerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [form, setForm] = useState({
    name: initialData?.name || '',
    username: initialData?.username || '',
    position: initialData?.position || 'ST',
    nationality: initialData?.nationality || '',
    avatarUrl: initialData?.avatarUrl || '',
    teamId: initialData?.teamId || '',
  })

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).then(setTeams).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = mode === 'edit' ? `/api/players/${initialData?.id}` : '/api/players'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          nationality: form.nationality || null,
          avatarUrl: form.avatarUrl || null,
          teamId: form.teamId || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan pemain')
      }

      router.push('/admin/pemain')
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nama Pemain *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Nama lengkap" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Username Game *</label>
          <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Username eFootball / PSN ID" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Posisi *</label>
          <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
            {positions.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tim</label>
          <select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
            <option value="">Tanpa Tim</option>
            {teams.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Kebangsaan</label>
        <input type="text" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Contoh: Indonesia" />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 disabled:opacity-50">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Update Pemain' : 'Tambah Pemain'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border/50 transition-all">
          Batal
        </button>
      </div>
    </form>
  )
}
