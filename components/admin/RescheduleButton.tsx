'use client'

import { useState } from 'react'
import { CalendarClock, X, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RescheduleButtonProps {
  matchId: string
  currentSchedule: string | Date
  matchLabel: string // "Wildan vs Iqbal"
}

// Konversi UTC ke format datetime-local WIB (UTC+7)
function toWIBDatetimeLocal(date: string | Date): string {
  const d = new Date(date)
  // Tambahkan offset WIB +7 jam
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000)
  return wib.toISOString().slice(0, 16)
}

// Konversi datetime-local input (WIB) ke ISO UTC string
function wibInputToISO(datetimeLocal: string): string {
  // datetimeLocal adalah waktu WIB, kurangi 7 jam untuk dapat UTC
  const d = new Date(datetimeLocal)
  const utc = new Date(d.getTime() - 7 * 60 * 60 * 1000)
  return utc.toISOString()
}

export default function RescheduleButton({ matchId, currentSchedule, matchLabel }: RescheduleButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(toWIBDatetimeLocal(currentSchedule))
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: wibInputToISO(value) }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan')
      }
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        router.refresh()
      }, 800)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Tombol Reschedule */}
      <button
        onClick={() => { setOpen(true); setValue(toWIBDatetimeLocal(currentSchedule)) }}
        className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center justify-center"
        title="Reschedule"
      >
        <CalendarClock className="w-3.5 h-3.5" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-sm bg-gaming-surface border border-border/50 rounded-2xl shadow-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-yellow-400" />
                  Reschedule
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{matchLabel}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Jadwal Baru <span className="text-muted-foreground font-normal">(WIB)</span>
              </label>
              <input
                type="datetime-local"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={loading || success || !value}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                  ${success
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 disabled:opacity-50'
                  }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                  <><Check className="w-4 h-4" /> Tersimpan!</>
                ) : (
                  <><CalendarClock className="w-4 h-4" /> Simpan Jadwal</>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border/50 transition-all text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
