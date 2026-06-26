'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { saveProfile } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

const CATEGORIES = ['DeFi', 'Infra', 'DevTools', 'PublicGoods', 'Other']
const CHAINS = ['Ethereum', 'Solana', 'Arbitrum', 'Optimism', 'Base', 'Other']

export function SettingsForm({ profile, onSaved }: { profile: any; onSaved: () => void }) {
  const [loading, setLoading] = useState(false)
  const [oneLiner, setOneLiner] = useState(profile?.oneLiner || '')
  const [description, setDescription] = useState(profile?.description || '')
  const [projectName, setProjectName] = useState(profile?.projectName || '')
  const [category, setCategory] = useState(profile?.category || '')
  const [selectedChains, setSelectedChains] = useState<string[]>(profile?.chains || [])
  const [activeWallets, setActiveWallets] = useState(profile?.metrics?.activeWallets || '')
  const [tvlRevenue, setTvlRevenue] = useState(profile?.metrics?.tvlRevenue || '')
  const [githubStars, setGithubStars] = useState(profile?.metrics?.githubStars || '')
  const { toast } = useToast()

  const handleChainChange = (chain: string, checked: boolean) => {
    if (checked) {
      setSelectedChains([...selectedChains, chain])
    } else {
      setSelectedChains(selectedChains.filter(c => c !== chain))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    saveProfile({
      projectName,
      oneLiner,
      category,
      chains: selectedChains,
      description,
      metrics: { activeWallets, tvlRevenue, githubStars },
    })

    toast({ title: 'Profile Updated', description: 'Your changes have been saved.' })
    setLoading(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-50 font-mono text-cyan-400">Project Identity</CardTitle>
          <CardDescription className="text-zinc-400">
            These details are used by the AI to tailor your grant applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project_name" className="text-zinc-300">Project Name *</Label>
              <Input
                id="project_name"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="one_liner" className="text-zinc-300">One Liner *</Label>
                <span className="text-xs text-zinc-500">{oneLiner.length}/160</span>
              </div>
              <Input
                id="one_liner"
                required
                maxLength={160}
                value={oneLiner}
                onChange={e => setOneLiner(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-zinc-300">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Chains *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CHAINS.map(chain => (
                    <div key={chain} className="flex items-center space-x-2">
                      <Checkbox
                        id={`chain-${chain}`}
                        checked={selectedChains.includes(chain)}
                        onCheckedChange={(checked: boolean) => handleChainChange(chain, checked)}
                      />
                      <label htmlFor={`chain-${chain}`} className="text-sm text-zinc-400 cursor-pointer">
                        {chain}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description" className="text-zinc-300">Description *</Label>
                <span className="text-xs text-zinc-500">Min 100 chars: {description.length}</span>
              </div>
              <Textarea
                id="description"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="min-h-[150px] bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-xl text-zinc-50 font-mono text-cyan-400">Project Metrics</CardTitle>
          <CardDescription className="text-zinc-400">
            Hard data helps convince grant committees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label htmlFor="active_wallets" className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Active Wallets</Label>
              <Input id="active_wallets" value={activeWallets} onChange={e => setActiveWallets(e.target.value)} placeholder="1,000+" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tvl_revenue" className="text-xs text-zinc-500 uppercase font-bold tracking-wider">TVL / Revenue</Label>
              <Input id="tvl_revenue" value={tvlRevenue} onChange={e => setTvlRevenue(e.target.value)} placeholder="$500k" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="github_stars" className="text-xs text-zinc-500 uppercase font-bold tracking-wider">GitHub Stars</Label>
              <Input id="github_stars" value={githubStars} onChange={e => setGithubStars(e.target.value)} placeholder="250" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold px-8 h-12 gap-2" disabled={loading || description.length < 100}>
          {loading ? 'Saving...' : (
            <><Save className="h-4 w-4" /> Save Settings</>
          )}
        </Button>
      </div>
    </form>
  )
}
