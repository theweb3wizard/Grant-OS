'use client'

import { useState } from 'react'
import type { ApplicationWithGrant, ApplicationStatus } from '@/lib/store'
import { updateApplicationStatus } from '@/lib/store'
import { ApplicationCard } from './application-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  applications: ApplicationWithGrant[]
  onRefresh: () => void
}

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
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
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 p-8 text-center">
        <div className="p-4 rounded-full bg-zinc-900 mb-4 border border-zinc-800">
          <Kanban className="h-8 w-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-bold text-zinc-50 mb-2">No grants tracked yet</h3>
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

  const handleDragStart = (appId: string) => {
    setDraggedAppId(appId)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedAppId) {
      updateApplicationStatus(draggedAppId, columnId as ApplicationStatus)
      onRefresh()
    }
    setDraggedAppId(null)
    setDragOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedAppId(null)
    setDragOverColumn(null)
  }

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter((app) => app.status === col.id)
    return acc
  }, {} as Record<string, ApplicationWithGrant[]>)

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-200px)]">
      {COLUMNS.map((column) => {
        const isOver = dragOverColumn === column.id
        return (
          <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className={`font-mono text-sm font-bold uppercase tracking-wider ${column.color}`}>
                {column.label}
              </h2>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-zinc-700 font-mono text-[10px]">
                {grouped[column.id].length}
              </Badge>
            </div>

            <div
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragLeave={() => setDragOverColumn(null)}
              className={cn(
                'space-y-3 p-2 rounded-xl bg-zinc-900/50 min-h-[200px] border transition-colors',
                isOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-transparent hover:border-zinc-800'
              )}
            >
              {grouped[column.id].map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onRefresh={onRefresh}
                  onDragStart={() => handleDragStart(app.id)}
                  onDragEnd={handleDragEnd}
                />
              ))}
              
              {grouped[column.id].length === 0 && (
                <div className={cn(
                  'h-24 flex items-center justify-center border border-dashed rounded-lg transition-colors',
                  isOver ? 'border-cyan-400 text-cyan-400' : 'border-zinc-800'
                )}>
                  <span className="text-[10px] text-zinc-700 uppercase font-mono tracking-widest">
                    Drop here
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
