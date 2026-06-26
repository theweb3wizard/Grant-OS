'use client'

import { ApplicationCard } from './application-card'
import { Badge } from '@/components/ui/badge'

interface KanbanBoardProps {
  applications: any[]
  onRefresh: () => void
}

const COLUMNS = [
  { id: 'interested', label: 'Interested', color: 'text-zinc-400' },
  { id: 'drafting', label: 'Drafting', color: 'text-zinc-400' },
  { id: 'submitted', label: 'Submitted', color: 'text-zinc-400' },
  { id: 'review', label: 'Under Review', color: 'text-zinc-400' },
  { id: 'won', label: 'Won', color: 'text-emerald-400' },
  { id: 'lost', label: 'Lost', color: 'text-zinc-500' },
]

import Link from 'next/link'
import { Kanban, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function KanbanBoard({ applications, onRefresh }: KanbanBoardProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 p-8 text-center">
        <div className="p-4 rounded-full bg-zinc-900 mb-4 border border-zinc-800">
          <Kanban className="h-8 w-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-bold text-zinc-50 mb-2">You haven't tracked any grants yet</h3>
        <p className="text-zinc-500 max-w-md mb-8">
          Browse the Grant Calendar to find opportunities and start your application journey.
        </p>
        <Button asChild className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold gap-2">
          <Link href="/dashboard/grants">
            Open Grant Calendar <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter((app) => app.status === col.id)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-200px)]">
      {COLUMNS.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className={`font-mono text-sm font-bold uppercase tracking-wider ${column.color}`}>
              {column.label}
            </h2>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-zinc-700 font-mono text-[10px]">
              {grouped[column.id].length}
            </Badge>
          </div>

          <div className="space-y-3 p-2 rounded-xl bg-zinc-900/50 min-h-[200px] border border-transparent hover:border-zinc-800 transition-colors">
            {grouped[column.id].map((app) => (
              <ApplicationCard key={app.id} application={app} onRefresh={onRefresh} />
            ))}
            
            {grouped[column.id].length === 0 && (
              <div className="h-24 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg">
                <span className="text-[10px] text-zinc-700 uppercase font-mono tracking-widest">
                  No {column.label}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
