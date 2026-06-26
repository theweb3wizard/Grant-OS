'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from '@/components/tracker/kanban-board'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { getApplicationsWithGrants } from '@/lib/store'

export default function TrackerPage() {
  const [applications, setApplications] = useState<ReturnType<typeof getApplicationsWithGrants>>([])

  useEffect(() => {
    setApplications(getApplicationsWithGrants())
  }, [])

  return (
    <div className="flex flex-col gap-4 max-w-full overflow-hidden">
      <DashboardHeader 
        title="Application Tracker"
        description="Manage your grant applications and track your progress through the stages."
      />
      <KanbanBoard applications={applications} onRefresh={() => setApplications(getApplicationsWithGrants())} />
    </div>
  )
}
