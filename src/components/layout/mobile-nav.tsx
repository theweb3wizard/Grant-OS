'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LayoutDashboard, Calendar, Kanban, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/grants', label: 'Grant Calendar', icon: Calendar },
  { href: '/dashboard/tracker', label: 'My Applications', icon: Kanban },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ projectName }: { projectName: string | undefined }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
      <Link href="/dashboard">
        <Logo variant="horizontal" markSize={24} />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-zinc-900 border-zinc-800 p-0 w-72">
          <div className="p-6 border-b border-zinc-800">
            <SheetTitle className="font-mono text-2xl font-bold text-cyan-400">
              <Logo variant="horizontal" markSize={24} />
            </SheetTitle>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-cyan-400/10 text-cyan-400 border-l-2 border-cyan-400 rounded-l-none" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-cyan-400" : "text-zinc-500")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-0 w-full p-6 border-t border-zinc-800 bg-zinc-900">
             <p className="text-xs font-mono text-zinc-500 truncate">
               {projectName || 'Guest'}
             </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
