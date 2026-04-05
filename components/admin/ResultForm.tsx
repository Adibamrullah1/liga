'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ResultFormProps {
  match: {
    id: string
    homeTeam: { id: string; name: string; shortName: string; players: any[] }
    awayTeam: { id: string; name: string; shortName: string; players: any[] }
    homeScore: number | null
    awayScore: number | null
  }
}

export default function ResultForm({ match }: ResultFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0)
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0)
  const [playerStats, setPlayerStats] = useState<Record<string, {
    goals: number; assists: number; rating: number; yellowCard: boolean; redCard: boolean; minutesPlayed: number
  }>>({})

  const updateStat = (playerId: string, field: string, value: any) => {
    const defaults = { goals: 0, assists: 0, rating: 7, yellowCard: false, redCard: false, minutesPlayed: 90 }
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...defaults,
        ...(prev[playerId] || {}),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const stats = Object.entries(playerStats).map(([playerId, stat]) => ({
        playerId,
        ...stat,
      }))

      const res = await fetch(`/api/matches/${match.id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeScore,
          awayScore,
          playedAt: new Date().toISOString(),
          playerStats: stats,
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan hasil')

      router.push('/admin/pertandingan')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderPlayerStatsInput = (players: any[], teamName: string) => (
    <div>
      <h4 className="font-heading text-lg font-bold text-foreground mb-3">{teamName}</h4>
      <div className="space-y-3">
        {players.map((player: any) => {
          const stat = playerStats[player.id] || { goals: 0, assists: 0, rating: 7, yellowCard: false, redCard: false, minutesPlayed: 90 }
          return (
            <div key={player.id} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{player.position}</span>
                <span className="text-sm font-semibold text-foreground">{player.name}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Gol</label>
                  <input type="number" min={0} max={20} value={stat.goals}
                    onChange={(e) => updateStat(player.id, 'goals', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-background border border-border/50 text-foreground text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Assist</label>
                  <input type="number" min={0} max={20} value={stat.assists}
                    onChange={(e) => updateStat(player.id, 'assists', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-background border border-border/50 text-foreground text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Rating</label>
                  <input type="number" min={0} max={10} step={0.1} value={stat.rating}
                    onChange={(e) => updateStat(player.id, 'rating', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-background border border-border/50 text-foreground text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Menit</label>
                  <input type="number" min={0} max={120} value={stat.minutesPlayed}
                    onChange={(e) => updateStat(player.id, 'minutesPlayed', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-background border border-border/50 text-foreground text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={stat.yellowCard}
                      onChange={(e) => updateStat(player.id, 'yellowCard', e.target.checked)}
                      className="rounded border-yellow-500 text-yellow-500" />
                    <span className="text-[10px] text-yellow-400">🟨</span>
                  </label>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={stat.redCard}
                      onChange={(e) => updateStat(player.id, 'redCard', e.target.checked)}
                      className="rounded border-red-500 text-red-500" />
                    <span className="text-[10px] text-red-400">🟥</span>
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      {/* Score Input */}
      <div className="game-card p-6">
        <h3 className="font-heading text-xl font-bold text-foreground mb-6 text-center">Skor Pertandingan</h3>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-lg font-bold text-primary mb-2">
              {match.homeTeam.shortName}
            </div>
            <p className="text-sm font-semibold mb-3">{match.homeTeam.name}</p>
            <input type="number" min={0} max={99} value={homeScore}
              onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              className="w-20 h-16 rounded-xl bg-background border-2 border-primary/30 text-foreground text-3xl font-gaming font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <span className="text-3xl font-bold text-muted-foreground mt-8">:</span>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-gaming-accent/20 to-secondary flex items-center justify-center text-lg font-bold text-gaming-accent mb-2">
              {match.awayTeam.shortName}
            </div>
            <p className="text-sm font-semibold mb-3">{match.awayTeam.name}</p>
            <input type="number" min={0} max={99} value={awayScore}
              onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
              className="w-20 h-16 rounded-xl bg-background border-2 border-gaming-accent/30 text-foreground text-3xl font-gaming font-bold text-center focus:outline-none focus:ring-2 focus:ring-gaming-accent/50" />
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPlayerStatsInput(match.homeTeam.players, match.homeTeam.name)}
        {renderPlayerStatsInput(match.awayTeam.players, match.awayTeam.name)}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon to-neon-blue text-gaming-dark font-semibold text-lg hover:shadow-lg hover:shadow-neon/30 transition-all duration-300 disabled:opacity-50">
          {loading ? 'Menyimpan...' : 'Simpan Hasil'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 rounded-lg bg-secondary text-muted-foreground border border-border/50 transition-all">
          Batal
        </button>
      </div>
    </form>
  )
}
