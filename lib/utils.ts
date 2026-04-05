import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

export function getPositionLabel(position: string): string {
  const labels: Record<string, string> = {
    GK: 'Goalkeeper',
    CB: 'Center Back',
    LB: 'Left Back',
    RB: 'Right Back',
    CDM: 'Defensive Mid',
    CM: 'Central Mid',
    CAM: 'Attacking Mid',
    LW: 'Left Wing',
    RW: 'Right Wing',
    ST: 'Striker',
    CF: 'Center Forward',
  }
  return labels[position] || position
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    LIVE: 'bg-red-500/20 text-red-400 border-red-500/30',
    FINISHED: 'bg-green-500/20 text-green-400 border-green-500/30',
    POSTPONED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Dijadwalkan',
    LIVE: 'Berlangsung',
    FINISHED: 'Selesai',
    POSTPONED: 'Ditunda',
    CANCELLED: 'Dibatalkan',
  }
  return labels[status] || status
}
