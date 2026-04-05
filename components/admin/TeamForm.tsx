'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeamFormProps {
  initialData?: {
    id?: string
    name: string
    shortName: string
    city: string | null
    description: string | null
    logoUrl: string | null
  }
  mode: 'create' | 'edit'
}

export default function TeamForm({ initialData, mode }: TeamFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: initialData?.name || '',
    shortName: initialData?.shortName || '',
    city: initialData?.city || '',
    description: initialData?.description || '',
    logoUrl: initialData?.logoUrl || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = mode === 'edit' ? `/api/teams/${initialData?.id}` : '/api/teams'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          city: form.city || null,
          description: form.description || null,
          logoUrl: form.logoUrl || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan tim')
      }

      router.push('/admin/tim')
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
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nama Tim *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="Contoh: FC Garuda"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Singkatan *</label>
          <input
            type="text"
            value={form.shortName}
            onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="Contoh: FCG"
            maxLength={5}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Kota</label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          placeholder="Contoh: Jakarta"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Deskripsi</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
          placeholder="Deskripsi singkat tim..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">URL Logo</label>
        <input
          type="url"
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Update Tim' : 'Tambah Tim'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
