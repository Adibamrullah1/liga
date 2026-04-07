'use client'

import { useState } from 'react'
import { CalendarClock, X, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RescheduleButtonProps {
  matchId: string
  currentSchedule: string | Date
  matchLabel: string
}

function toWIBDatetimeLocal(date: string | Date): string {
  const d = new Date(date)
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000)
  return wib.toISOString().slice(0, 16)
}

function wibInputToISO(datetimeLocal: string): string {
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

  const handleOpen = () => {
    setValue(toWIBDatetimeLocal(currentSchedule))
    setError('')
    setSuccess(false)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!value) return
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
      {/* Tombol kuning di tabel */}
      <button
        onClick={handleOpen}
        title="Reschedule"
        style={{ background: 'rgba(234,179,8,0.15)', color: '#facc15' }}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <CalendarClock className="w-3.5 h-3.5" />
      </button>

      {/* Modal */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          />

          {/* Dialog box */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '400px',
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CalendarClock style={{ width: '18px', height: '18px', color: '#facc15' }} />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#f9fafb' }}>Reschedule Pertandingan</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{matchLabel}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>
                Jadwal Baru <span style={{ color: '#9ca3af', fontWeight: 400 }}>(WIB)</span>
              </label>
              <input
                type="datetime-local"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#1f2937',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  colorScheme: 'dark',
                }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '13px' }}>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                disabled={loading || success || !value}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  background: success ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                  color: success ? '#4ade80' : '#facc15',
                  opacity: loading || !value ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                ) : success ? (
                  <><Check style={{ width: '16px', height: '16px' }} /> Tersimpan!</>
                ) : (
                  <><CalendarClock style={{ width: '16px', height: '16px' }} /> Simpan Jadwal</>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9ca3af',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
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
