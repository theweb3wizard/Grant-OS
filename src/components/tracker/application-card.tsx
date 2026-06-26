'use client'

import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, ArrowRight, Edit, Trash, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { updateApplicationStatus, updateApplicationNotes, deleteApplication } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { MilestoneManager } from './milestone-manager'
import Link from 'next/link'

interface ApplicationCardProps {
  application: any
  onRefresh: () => void
}

const ECOSYSTEM_COLORS: Record<string, string> = {
  Optimism: 'bg-red-900/30 text-red-400 border-red-900/50',
  Arbitrum: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
  Base: 'bg-indigo-900/30 text-indigo-400 border-indigo-900/50',
  Solana: 'bg-purple-900/30 text-purple-400 border-purple-900/50',
  Ethereum: 'bg-zinc-800 text-zinc-300 border-zinc-700',
}

const NEXT_STATUS: Record<string, string | null> = {
  interested: 'drafting',
  drafting: 'submitted',
  submitted: 'review',
  review: 'won',
  won: null,
  lost: null,
}

export function ApplicationCard({ application, onRefresh }: ApplicationCardProps) {
  const { toast } = useToast()
  const nextStatus = NEXT_STATUS[application.status]
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [notes, setNotes] = useState(application.notes || '')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  const handleStatusUpdate = (status: string) => {
    updateApplicationStatus(application.id, status as any)
    toast({ title: 'Success', description: `Moved to ${status}` })
    onRefresh()
  }

  const handleDelete = () => {
    deleteApplication(application.id)
    toast({ title: 'Deleted', description: 'Application removed successfully.' })
    onRefresh()
  }

  const handleSaveNotes = () => {
    setIsSavingNotes(true)
    updateApplicationNotes(application.id, notes)
    toast({ title: 'Saved', description: 'Notes updated.' })
    setIsNotesOpen(false)
    setIsSavingNotes(false)
  }

  return (
    <div className="group relative bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-sm hover:border-zinc-600 transition-all">
      <div className="flex justify-between items-start mb-3">
        <Badge className={ECOSYSTEM_COLORS[application.grants?.ecosystem] || 'bg-zinc-900 text-zinc-400 border-zinc-800'}>
          {application.grants?.ecosystem || 'Unknown'}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-50">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-50">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            
            {nextStatus && (
              <DropdownMenuItem onClick={() => handleStatusUpdate(nextStatus)} className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="gap-2" onClick={() => setIsNotesOpen(true)}>
              <Edit className="h-4 w-4" />
              Edit Notes
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/dashboard/draft/${application.id}`} className="gap-2 flex items-center">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Generate AI Draft
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-800" />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()} 
                  className="gap-2 text-red-400 focus:text-red-400 focus:bg-red-400/10"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    This will permanently delete your application for {application.grants?.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white border-0">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-semibold text-zinc-100 mb-1 line-clamp-1">{application.grants?.name || 'Unknown Grant'}</h3>
      
      {application.amountRequested && (
        <p className="text-sm text-cyan-400 font-mono mb-2">
          ${application.amountRequested.toLocaleString()}
        </p>
      )}

      {application.status === 'won' && (
        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          <MilestoneManager applicationId={application.id} milestones={application.milestones || []} onRefresh={onRefresh} />
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-zinc-700/50 flex justify-between items-center text-[10px] text-zinc-500">
        <span>Updated {formatDistanceToNow(new Date(application.updatedAt))} ago</span>
      </div>

      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
          <DialogHeader>
            <DialogTitle>Application Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this application..."
                className="min-h-[150px] bg-zinc-900 border-zinc-800 text-zinc-50 focus:border-cyan-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesOpen(false)} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={handleSaveNotes} disabled={isSavingNotes} className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300">
              {isSavingNotes ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
