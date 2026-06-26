'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { saveProfile } from '@/lib/store'

const CATEGORIES = ['DeFi', 'Infra', 'DevTools', 'PublicGoods', 'Other']
const CHAINS = ['Ethereum', 'Solana', 'Arbitrum', 'Optimism', 'Base', 'Other']

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [oneLiner, setOneLiner] = useState('')
  const [description, setDescription] = useState('')
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [projectName, setProjectName] = useState('')
  const [category, setCategory] = useState('')
  const [activeWallets, setActiveWallets] = useState('')
  const [tvlRevenue, setTvlRevenue] = useState('')
  const [githubStars, setGithubStars] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChainChange = (chain: string, checked: boolean) => {
    if (checked) {
      setSelectedChains([...selectedChains, chain])
    } else {
      setSelectedChains(selectedChains.filter(c => c !== chain))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!projectName || !oneLiner || !category || selectedChains.length === 0 || description.length < 100) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    saveProfile({
      projectName,
      oneLiner,
      category,
      chains: selectedChains,
      description,
      metrics: {
        activeWallets,
        tvlRevenue,
        githubStars,
      },
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-3xl text-zinc-50 font-mono text-cyan-400">Welcome to GrantOS</CardTitle>
          <CardDescription className="text-zinc-400">
            Tell us about your project to start applying for grants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project_name" className="text-zinc-300">Project Name *</Label>
                <Input
                  id="project_name"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="GrantOS"
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
                  placeholder="The operating system for Web3 grants."
                  value={oneLiner}
                  onChange={e => setOneLiner(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-zinc-300">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
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
                          onCheckedChange={(checked) => handleChainChange(chain, checked as boolean)}
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
                  placeholder="Detailed description of your project and its mission..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[120px] bg-zinc-800 border-zinc-700 text-zinc-50 focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Metrics (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="active_wallets" className="text-xs text-zinc-500">Active Wallets</Label>
                    <Input id="active_wallets" value={activeWallets} onChange={e => setActiveWallets(e.target.value)} placeholder="1,000+" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tvl_revenue" className="text-xs text-zinc-500">TVL/Revenue</Label>
                    <Input id="tvl_revenue" value={tvlRevenue} onChange={e => setTvlRevenue(e.target.value)} placeholder="$500k" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="github_stars" className="text-xs text-zinc-500">GitHub Stars</Label>
                    <Input id="github_stars" value={githubStars} onChange={e => setGithubStars(e.target.value)} placeholder="250" className="bg-zinc-800 border-zinc-700 text-zinc-50" />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded border border-red-400/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold h-11"
              disabled={loading || description.length < 100}
            >
              {loading ? 'Saving...' : 'Start Using GrantOS'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
