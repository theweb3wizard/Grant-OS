'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { getProfile } from '@/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const profile = getProfile()

  useEffect(() => {
    if (!profile) {
      router.replace('/onboarding')
    }
  }, [profile, router])

  if (!profile) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Sidebar projectName={profile.projectName} />
      <MobileNav projectName={profile.projectName} />
      <main className="lg:pl-60 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
