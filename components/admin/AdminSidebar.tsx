'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Swords,
  CalendarClock,
  Settings,
  LogOut,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/tim', label: 'Tim', icon: Users },
  { href: '/admin/pemain', label: 'Pemain', icon: UserCircle },
  { href: '/admin/pertandingan', label: 'Pertandingan', icon: Swords },
  { href: '/admin/musim', label: 'Musim', icon: CalendarClock },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gaming-surface border-r border-border/50 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon to-neon-blue flex items-center justify-center shrink-0">
            <Gamepad2 className="w-6 h-6 text-gaming-dark" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-gaming text-sm font-bold tracking-wider text-neon">eFOOTBALL</h1>
              <p className="text-[9px] text-muted-foreground tracking-widest uppercase">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          title={collapsed ? 'Lihat Situs' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Lihat Situs</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Tutup Sidebar</span>}
        </button>
      </div>
    </aside>
  )
}
