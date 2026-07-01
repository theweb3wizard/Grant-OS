'use client'

import { useRef, useEffect } from 'react'
import { SettingsForm } from '@/components/profile/settings-form'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { getProfile } from '@/lib/store'
import type { ProjectProfile } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

export default function SettingsPage() {
  const profile: ProjectProfile | null = getProfile()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!profile) {
      router.replace('/onboarding')
    }
  }, [profile, router])

  if (!profile) return null

  const handleExport = () => {
    const raw = localStorage.getItem('grantos-state')
    if (!raw) {
      toast({ title: 'No Data', description: 'No grant data to export.', variant: 'destructive' })
      return
    }
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grantos-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'Your data has been downloaded as JSON.' })
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        JSON.parse(content)
        localStorage.setItem('grantos-state', content)
        toast({ title: 'Imported', description: 'Data imported. Reloading page...' })
        setTimeout(() => window.location.reload(), 1000)
      } catch {
        toast({ title: 'Import Failed', description: 'Invalid JSON file.', variant: 'destructive' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-50 font-mono text-cyan-400">Settings</h1>
        <p className="text-zinc-400">Manage your project profile and application context.</p>
      </div>
      <div className="max-w-4xl space-y-8">
        <SettingsForm profile={profile} onSaved={() => {}} />

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-50 font-mono text-cyan-400">Data Management</CardTitle>
            <CardDescription className="text-zinc-400">
              Export your data as JSON for backup, or import a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                onClick={handleImport}
                variant="outline"
                className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
