'use client'

import { useState, useEffect } from 'react'
import { SettingsForm } from '@/components/profile/settings-form'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/store'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const p = getProfile()
    if (!p) {
      router.replace('/onboarding')
    } else {
      setProfile(p)
    }
  }, [router])

  if (!profile) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-50 font-mono text-cyan-400">Settings</h1>
        <p className="text-zinc-400">Manage your project profile and application context.</p>
      </div>
      <div className="max-w-4xl">
        <SettingsForm profile={profile} onSaved={() => {}} />
      </div>
    </div>
  )
}
