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

  if (standings.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        Belum ada data klasemen
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/30">
            <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10">#</th>
            <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Player</th>
            <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-12">Main</th>
            {!compact && (
              <>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10 hidden sm:table-cell">M</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10 hidden sm:table-cell">S</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10 hidden sm:table-cell">K</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10 hidden md:table-cell">GF</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-10 hidden md:table-cell">GA</th>
                <th className="text-center py-3 px-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-12 hidden sm:table-cell">GD</th>
              </>
            )}
            <th className="text-center py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-14">Poin</th>
          </tr>
        </thead>
        <tbody>
          {displayStandings.map((player, index) => {
            const position = index + 1
            let rowClass = 'table-row-hover transition-colors duration-150'
            let positionStyle = 'bg-secondary text-muted-foreground'
            let positionEmoji = ''

            if (position === 1) {
              rowClass += ' bg-yellow-500/5'
              positionStyle = 'bg-yellow-500/20 text-yellow-400'
              positionEmoji = '🥇'
            } else if (position === 2) {
              rowClass += ' bg-gray-400/5'
              positionStyle = 'bg-gray-400/20 text-gray-300'
              positionEmoji = '🥈'
            } else if (position === 3) {
              rowClass += ' bg-amber-600/5'
              positionStyle = 'bg-amber-600/20 text-amber-500'
              positionEmoji = '🥉'
            }

            return (
              <tr key={player.playerId} className={`${rowClass} border-b border-border/30`}>
                {/* Rank */}
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${positionStyle}`}>
                    {positionEmoji || position}
                  </span>
                </td>

                {/* Player */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-xs font-bold text-primary overflow-hidden shrink-0">
                      {player.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={player.avatarUrl} alt={player.playerName} className="w-full h-full object-cover" loading="lazy" />
                      ) : player.shortName}
                    </div>
                    <p className="font-semibold text-foreground text-sm truncate max-w-[100px] sm:max-w-none">
                      {player.playerName}
                    </p>
                  </div>
                </td>

                {/* Main */}
                <td className="text-center py-3 px-2 text-muted-foreground tabular-nums">{player.played}</td>

                {!compact && (
                  <>
                    <td className="text-center py-3 px-2 text-green-400 font-medium tabular-nums hidden sm:table-cell">{player.won}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground tabular-nums hidden sm:table-cell">{player.drawn}</td>
                    <td className="text-center py-3 px-2 text-red-400 font-medium tabular-nums hidden sm:table-cell">{player.lost}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground tabular-nums hidden md:table-cell">{player.goalsFor}</td>
                    <td className="text-center py-3 px-2 text-muted-foreground tabular-nums hidden md:table-cell">{player.goalsAgainst}</td>
                    <td className="text-center py-3 px-2 tabular-nums hidden sm:table-cell">
                      <span className={player.goalDiff > 0 ? 'text-green-400' : player.goalDiff < 0 ? 'text-red-400' : 'text-muted-foreground'}>
                        {player.goalDiff > 0 ? '+' : ''}{player.goalDiff}
                      </span>
                    </td>
                  </>
                )}

                {/* Points */}
                <td className="text-center py-3 px-3">
                  <span className="font-bold text-lg text-primary tabular-nums">{player.points}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
