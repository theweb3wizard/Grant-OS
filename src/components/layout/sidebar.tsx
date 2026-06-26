'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Kanban, 
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/grants', label: 'Grant Calendar', icon: Calendar },
  { href: '/dashboard/tracker', label: 'My Applications', icon: Kanban },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ projectName }: { projectName: string | undefined }) {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex h-screen w-60 flex-col bg-zinc-900 border-r border-zinc-800 fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-cyan-400 rounded-lg flex items-center justify-center font-bold text-zinc-950 transition-transform group-hover:scale-110">G</div>
          <span className="font-mono text-2xl font-bold text-zinc-100">GrantOS</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4">
        <p className="px-3 text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-4">Menu</p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive 
                    ? "bg-cyan-400/10 text-cyan-400" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-100"
                )} />
                {item.label}
                {isActive && (
                  <div className="absolute right-0 w-1 h-4 bg-cyan-400 rounded-l-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="px-3 py-2">
          <p className="text-[11px] font-mono text-zinc-500 truncate bg-zinc-950 p-2 rounded border border-zinc-800">
            {projectName || 'Guest'}
          </p>
        </div>
      </div>
    </div>
  )
}
