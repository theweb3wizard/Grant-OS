'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { addMilestone, toggleMilestone, deleteMilestoneEntry } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

interface MilestoneManagerProps {
  applicationId: string
  milestones: Milestone[]
  onRefresh: () => void
}

export function MilestoneManager({ applicationId, milestones, onRefresh }: MilestoneManagerProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return

    setLoading(true)
    addMilestone(applicationId, title, dueDate)
    setTitle('')
    setDueDate('')
    toast({ title: 'Success', description: 'Milestone added.' })
    setLoading(false)
    onRefresh()
  }

  const handleToggle = (id: string, completed: boolean) => {
    toggleMilestone(id, completed)
    onRefresh()
  }

  const handleDelete = (id: string) => {
    deleteMilestoneEntry(id)
    toast({ title: 'Success', description: 'Milestone removed.' })
    onRefresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        Milestones
      </div>

      <div className="space-y-2">
        {milestones.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic">No reporting milestones set.</p>
        ) : (
          milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className={`flex items-center justify-between p-2 rounded border ${
                milestone.completed ? 'bg-zinc-800/20 border-zinc-800' : 'bg-zinc-800/40 border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Checkbox 
                  checked={milestone.completed} 
                  onCheckedChange={(checked: boolean) => handleToggle(milestone.id, checked)}
                  className="border-zinc-600 shrink-0"
                />
                <div className="min-w-0">
                  <span className={`text-xs font-medium block truncate ${milestone.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                    {milestone.title}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                    <Clock className="h-2.5 w-2.5" />
                    {milestone.dueDate ? format(new Date(milestone.dueDate), 'MMM dd, yyyy') : 'No date'}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(milestone.id)}
                className="h-6 w-6 text-zinc-600 hover:text-red-400 shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input 
          placeholder="Milestone title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-xs flex-1 min-w-0"
        />
        <Input 
          type="date" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 w-[130px] text-xs"
        />
        <Button 
          type="submit" 
          disabled={loading || !title || !dueDate}
          className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
