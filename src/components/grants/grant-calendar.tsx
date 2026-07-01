'use client'

import { useState, useMemo } from 'react'
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns'
import { Search, SortAsc, SortDesc, ExternalLink, Info, Plus, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ECOSYSTEM_COLORS } from '@/lib/constants'
import { addApplication } from '@/lib/store'
import { useRouter } from 'next/navigation'
import type { Grant } from '@/lib/grants-data'

export function GrantCalendar({ initialGrants }: { initialGrants: Grant[] }) {
  const [search, setSearch] = useState('')
  const [ecosystem, setEcosystem] = useState('All')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const filteredGrants = useMemo(() => {
    let result = [...initialGrants]

    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(s) || g.ecosystem.toLowerCase().includes(s)
      )
    }

    if (ecosystem !== 'All') {
      result = result.filter((g) => g.ecosystem === ecosystem)
    }

    result.sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    })

    return result
  }, [initialGrants, search, ecosystem, sortOrder])

  const handleTrack = (grantId: string) => {
    setTrackingId(grantId)
    const result = addApplication(grantId)
    if (result) {
      toast({
        title: 'Success',
        description: 'Now tracking this grant in your applications.',
      })
      router.refresh()
    }
    setTrackingId(null)
  }

  const formatDeadline = (deadlineStr: string | null) => {
    if (!deadlineStr) return <span className="text-zinc-500">No deadline</span>
    const deadline = parseISO(deadlineStr)
    const now = new Date()
    const isPast = isBefore(deadline, now)
    const isSoon = isAfter(deadline, now) && isBefore(deadline, addDays(now, 7))

    return (
      <span
        className={cn(
          isPast ? 'line-through text-zinc-500' : isSoon ? 'text-amber-400 font-medium' : 'text-zinc-300'
        )}
      >
        {format(deadline, 'MMM dd, yyyy')}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search grants or ecosystems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-50 focus:border-cyan-400"
          />
        </div>
        <Select value={ecosystem} onValueChange={setEcosystem}>
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800 text-zinc-50">
            <SelectValue placeholder="Ecosystem" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
            <SelectItem value="All">All Ecosystems</SelectItem>
            <SelectItem value="Optimism">Optimism</SelectItem>
            <SelectItem value="Arbitrum">Arbitrum</SelectItem>
            <SelectItem value="Base">Base</SelectItem>
            <SelectItem value="Solana">Solana</SelectItem>
            <SelectItem value="Ethereum">Ethereum</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 gap-2"
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          Deadline
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400">Grant Program</TableHead>
              <TableHead className="text-zinc-400">Ecosystem</TableHead>
              <TableHead className="text-zinc-400">Funding Range</TableHead>
              <TableHead className="text-zinc-400">Deadline</TableHead>
              <TableHead className="text-zinc-400">Focus Areas</TableHead>
              <TableHead className="text-zinc-400 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrants.map((grant) => (
              <TableRow key={grant.id} className="border-zinc-800 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-50">{grant.name}</TableCell>
                <TableCell>
                  <Badge className={cn('font-normal border', ECOSYSTEM_COLORS[grant.ecosystem] || ECOSYSTEM_COLORS.Other)}>
                    {grant.ecosystem}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400">{grant.fundingRange || 'N/A'}</TableCell>
                <TableCell>{formatDeadline(grant.deadline)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {grant.focusAreas?.slice(0, 3).map((area) => (
                      <Badge key={area} variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">
                        {area}
                      </Badge>
                    ))}
                    {(grant.focusAreas?.length || 0) > 3 && (
                      <span className="text-[10px] text-zinc-500 ml-1">
                        +{(grant.focusAreas?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 h-8 w-8 p-0">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-[600px]">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={cn('border', ECOSYSTEM_COLORS[grant.ecosystem] || ECOSYSTEM_COLORS.Other)}>
                              {grant.ecosystem}
                            </Badge>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400 text-sm">{grant.fundingRange}</span>
                          </div>
                          <DialogTitle className="text-2xl font-bold font-mono text-cyan-400">{grant.name}</DialogTitle>
                          <DialogDescription className="text-zinc-500">
                            Deadline: {grant.deadline ? format(parseISO(grant.deadline), 'MMMM dd, yyyy') : 'No deadline'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-zinc-300">About this grant</h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">{grant.description}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-zinc-300">Focus Areas</h4>
                            <div className="flex flex-wrap gap-2">
                              {grant.focusAreas?.map((area) => (
                                <Badge key={area} variant="secondary" className="bg-zinc-900 border-zinc-800">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                            {grant.officialUrl && (
                              <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 gap-2" asChild>
                                <a href={grant.officialUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  Official Website
                                </a>
                              </Button>
                            )}
                            <Button 
                              onClick={() => handleTrack(grant.id)} 
                              disabled={trackingId === grant.id}
                              className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
                            >
                              Track this Grant
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={trackingId === grant.id}
                      onClick={() => handleTrack(grant.id)}
                      className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 h-8 px-3 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Track
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredGrants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-4 rounded-full bg-zinc-800/50 mb-2">
                      <Calendar className="h-8 w-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-300 font-medium">No grant programs found</p>
                    <p className="text-sm text-zinc-500">Check back soon — we update the calendar weekly.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
