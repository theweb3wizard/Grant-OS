'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

interface DashboardHeaderProps {
  title: string
  description?: string
  showBack?: boolean
  backHref?: string
  children?: React.ReactNode
}

export function DashboardHeader({ title, description, showBack, backHref, children }: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
        <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
          <Logo variant="mark" markSize={14} className="text-cyan-400" />
          <span className="text-zinc-400">GrantOS</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-400">{title}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => backHref ? router.push(backHref) : router.back()}
                className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-4xl font-bold text-zinc-50 font-mono tracking-tight">{title}</h1>
          </div>
          {description && <p className="text-zinc-400 max-w-2xl">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}
