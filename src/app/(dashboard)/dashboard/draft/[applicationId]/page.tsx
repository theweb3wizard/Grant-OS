'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DraftGenerator } from '@/components/draft/draft-generator'
import { getApplicationsWithGrants, getProfile } from '@/lib/store'
import { GRANTS } from '@/lib/grants-data'
import type { ApplicationWithGrant } from '@/lib/store'

export default function DraftPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = use(params)
  const router = useRouter()
  const apps: ApplicationWithGrant[] = getApplicationsWithGrants()
  const app = apps.find((a) => a.id === applicationId)
  const profile = getProfile()

  useEffect(() => {
    if (!app || !profile) {
      router.replace('/dashboard/tracker')
    }
  }, [app, profile, router])

  if (!app || !profile) return null

  const grant = GRANTS.find(g => g.id === app.grantId)

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <DashboardHeader 
        title="AI Draft Generator"
        description={`Generating draft for ${grant?.name || 'Grant'}`}
        showBack={true}
        backHref="/dashboard/tracker"
      />
      <DraftGenerator
        applicationId={app.id}
        grantName={grant?.name || 'Grant'}
        profile={profile}
      />
    </div>
  )
}
