'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DraftGenerator } from '@/components/draft/draft-generator'
import { getApplicationsWithGrants, getProfile } from '@/lib/store'
import { GRANTS } from '@/lib/grants-data'

export default function DraftPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = use(params)
  const [data, setData] = useState<{ application: any; profile: any } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const apps = getApplicationsWithGrants()
    const app = apps.find((a: any) => a.id === applicationId)
    if (!app) {
      router.replace('/dashboard/tracker')
      return
    }
    const profile = getProfile()
    setData({ application: app, profile })
  }, [applicationId, router])

  if (!data) return null

  const { application, profile } = data
  const grant = GRANTS.find(g => g.id === application.grantId)

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <DashboardHeader 
        title="AI Draft Generator"
        description={`Generating draft for ${grant?.name || 'Grant'}`}
        showBack={true}
        backHref="/dashboard/tracker"
      />
      <DraftGenerator
        applicationId={application.id}
        grantName={grant?.name || 'Grant'}
        profile={profile}
      />
    </div>
  )
}
