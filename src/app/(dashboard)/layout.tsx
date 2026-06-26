'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { getProfile } from '@/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [projectName, setProjectName] = useState<string | undefined>()

  useEffect(() => {
    const profile = getProfile()
    if (!profile) {
      router.replace('/onboarding')
    } else {
      setProjectName(profile.projectName)
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Sidebar projectName={projectName} />
      <MobileNav projectName={projectName} />
      <main className="lg:pl-60 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
