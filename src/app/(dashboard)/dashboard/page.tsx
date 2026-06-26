'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Clock, 
  ArrowRight, 
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { getApplicationsWithGrants, getProfile, type ProjectProfile } from '@/lib/store'
import { GRANTS } from '@/lib/grants-data'

export default function DashboardOverview() {
  const [profile, setProfile] = useState<ProjectProfile | null>(null)
  const [applications, setApplications] = useState<ReturnType<typeof getApplicationsWithGrants>>([])

  useEffect(() => {
    setProfile(getProfile())
    setApplications(getApplicationsWithGrants())
  }, [])

  const activeAppsCount = applications.filter(a => !['won', 'lost'].includes(a.status)).length
  const wonAppsCount = applications.filter(a => a.status === 'won').length
  const recentApps = applications.slice(0, 3)
  const upcomingGrants = GRANTS.filter(g => g.deadline && new Date(g.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-10">
      <DashboardHeader 
        title={`Welcome back${profile?.projectName ? `, ${profile.projectName}` : ''}`}
        description="Here's an overview of your grant activity and upcoming opportunities."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Applications</CardTitle>
            <Clock className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-100">{activeAppsCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Ongoing discussions and drafting</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Won</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{wonAppsCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Successfully secured grants</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-50 font-mono">Recent Applications</h2>
            <Button variant="link" asChild className="text-cyan-400 p-0 h-auto">
              <Link href="/dashboard/tracker" className="flex items-center gap-1">
                View Tracker <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentApps.length > 0 ? recentApps.map((app: any) => (
              <Card key={app.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-100">{app.grants?.name || 'Unknown Grant'}</p>
                    <p className="text-xs text-zinc-500">{app.grants?.ecosystem}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="capitalize bg-zinc-800 text-zinc-400 border-zinc-700">
                      {app.status}
                    </Badge>
                    <p className="text-[10px] text-zinc-600">
                      Updated {formatDistanceToNow(new Date(app.updatedAt))} ago
                    </p>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg text-zinc-600 text-sm">
                No applications yet. Start tracking from the calendar.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-50 font-mono">Upcoming Deadlines</h2>
          </div>
          <div className="space-y-3">
            {upcomingGrants.length > 0 ? upcomingGrants.map((grant) => (
              <div key={grant.id} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="p-2.5 rounded-lg bg-zinc-800">
                  <CalendarIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-200">{grant.name}</p>
                  <p className="text-xs text-red-400 font-mono">Due {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg text-zinc-600 text-sm">
                No upcoming deadlines found.
              </div>
            )}
            <Button variant="outline" asChild className="w-full border-zinc-800 text-zinc-400 hover:bg-zinc-900">
              <Link href="/dashboard/grants">Browse All Grants</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
