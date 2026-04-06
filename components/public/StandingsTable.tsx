'use client'

interface Standing {
  playerId: string
  playerName: string
  shortName: string
  avatarUrl: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

interface StandingsTableProps {
  standings: Standing[]
  compact?: boolean
}

export default function StandingsTable({ standings, compact = false }: StandingsTableProps) {
  const displayStandings = compact ? standings.slice(0, 3) : standings

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">#</th>
            <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Player</th>
            <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Main</th>
            {!compact && (
              <>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">M</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">S</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">K</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">GF</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">GA</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider">GD</th>
              </>
            )}
            <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Poin</th>
          </tr>
        </thead>
        <tbody>
          {displayStandings.map((player, index) => {
            const position = index + 1
            let rowClass = 'table-row-hover transition-colors duration-150'
            let positionClass = ''

            if (position === 1) {
              rowClass += ' bg-yellow-500/5'
              positionClass = 'badge-gold'
            } else if (position === 2) {
              rowClass += ' bg-gray-400/5'
              positionClass = 'badge-silver'
            } else if (position === 3) {
              rowClass += ' bg-amber-600/5'
              positionClass = 'badge-bronze'
            }

            return (
              <tr key={player.playerId} className={`${rowClass} border-b border-border/30`}>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${positionClass || 'bg-secondary text-muted-foreground'}`}>
                    {position}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                      {player.avatarUrl ? (
                        <img src={player.avatarUrl} alt={player.playerName} className="w-full h-full object-cover" />
                      ) : player.shortName}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{player.playerName}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-2 text-muted-foreground">{player.played}</td>
                {!compact && (
                  <>
                    <td className="text-center py-3 px-2 text-green-400 font-medium">{player.won}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground">{player.drawn}</td>
                    <td className="text-center py-3 px-2 text-red-400 font-medium">{player.lost}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground">{player.goalsFor}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground">{player.goalsAgainst}</td>
                    <td className="text-center py-3 px-2">
                      <span className={player.goalDiff > 0 ? 'text-green-400' : player.goalDiff < 0 ? 'text-red-400' : 'text-muted-foreground'}>
                        {player.goalDiff > 0 ? '+' : ''}{player.goalDiff}
                      </span>
                    </td>
                  </>
                )}
                <td className="text-center py-3 px-3">
                  <span className="font-bold text-lg text-primary">{player.points}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {standings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada data klasemen</p>
        </div>
      )}
    </div>
  )
}
