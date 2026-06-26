'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Copy, Save, ArrowLeft, Loader2, PenLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { updateApplicationDraft } from '@/lib/store'
import { getProfile } from '@/lib/store'
import { GRANTS } from '@/lib/grants-data'

interface DraftGeneratorProps {
  applicationId: string
  grantName: string
  profile: any
}

export function DraftGenerator({ applicationId, grantName, profile }: DraftGeneratorProps) {
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAiAvailable, setIsAiAvailable] = useState(true)
  const [useManualEditor, setUseManualEditor] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setIsAiAvailable(true)
    setUseManualEditor(false)

    try {
      const grant = GRANTS.find(g => g.name === grantName)
      const response = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: profile.projectName,
          grantName,
          grantEcosystem: grant?.ecosystem || '',
          description: profile.description,
          oneLiner: profile.oneLiner,
          metrics: profile.metrics,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        toast({
          title: 'AI Unavailable',
          description: data.error || 'Falling back to manual editor.',
          variant: 'destructive',
        })
        setUseManualEditor(true)
        setIsAiAvailable(false)
        setIsGenerating(false)
        return
      }

      if (!response.body) {
        setUseManualEditor(true)
        setIsAiAvailable(false)
        setIsGenerating(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setContent(text)
      }

      updateApplicationDraft(applicationId, text)
      toast({ title: 'Draft Generated', description: 'Your draft has been saved.' })
    } catch {
      toast({
        title: 'AI Unavailable',
        description: 'Falling back to manual editor.',
        variant: 'destructive',
      })
      setUseManualEditor(true)
      setIsAiAvailable(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    updateApplicationDraft(applicationId, content)
    setSaved(true)
    toast({ title: 'Saved', description: 'Draft saved successfully.' })
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({ title: 'Copied', description: 'Draft copied to clipboard.' })
  }

  const metricsArray = profile.metrics ? Object.entries(profile.metrics).filter(([_, v]: any) => v) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4 space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <div>
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Project Name</span>
              <p className="text-zinc-100 font-medium">{profile.projectName || 'N/A'}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">One Liner</span>
              <p className="text-zinc-300 text-sm">{profile.oneLiner || 'N/A'}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Metrics</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {metricsArray.length > 0 ? metricsArray.map(([k, v]: any) => (
                  <Badge key={k} variant="secondary" className="bg-zinc-800 border-zinc-700 text-zinc-400">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>: {String(v)}
                  </Badge>
                )) : <p className="text-zinc-600 text-xs italic">No metrics provided</p>}
              </div>
            </div>
            <div>
              <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Description</span>
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-6">{profile.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-zinc-50">Grant Application Draft</h2>
          </div>
          {!content && !isGenerating && !useManualEditor && (
            <Button onClick={handleGenerate} className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold gap-2">
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
          )}
          {!content && !isGenerating && (
            <Button onClick={() => setUseManualEditor(true)} variant="outline" className="border-zinc-800 text-zinc-400 gap-2 ml-2">
              <PenLine className="h-4 w-4" />
              Write Manually
            </Button>
          )}
        </div>

        <Card className="bg-zinc-900 border-zinc-800 min-h-[500px] flex flex-col relative overflow-hidden">
          <CardContent className="flex-1 p-6">
            {!content && !isGenerating && !useManualEditor && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 space-y-4">
                <div className="p-4 rounded-full bg-zinc-800/50">
                  <Sparkles className="h-12 w-12" />
                </div>
                <p className="max-w-[280px] text-center text-sm">
                  Generate an AI draft tailored to {grantName}, or write manually.
                </p>
              </div>
            )}

            {useManualEditor && !isGenerating ? (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Write your grant application for ${grantName} here...`}
                className="min-h-[400px] bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400 font-serif text-lg leading-relaxed resize-none"
              />
            ) : (
              <div className="font-serif text-zinc-200 text-lg leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 text-zinc-500 text-sm mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is writing...
              </div>
            )}
          </CardContent>

          {content && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                {useManualEditor && (
                  <Button variant="outline" size="sm" onClick={handleSave} className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 gap-2">
                    <Save className="h-4 w-4" />
                    {saved ? 'Saved!' : 'Save'}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/tracker')} className="border-zinc-800 hover:bg-zinc-800 text-zinc-400 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tracker
                </Button>
              </div>
              {!useManualEditor && saved && (
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <Save className="h-4 w-4" />
                  Auto-saved
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
