export interface Grant {
  id: string
  name: string
  ecosystem: string
  fundingRange: string | null
  deadline: string | null
  focusAreas: string[] | null
  description: string | null
  officialUrl: string | null
  promptTemplate: string | null
}

export const GRANTS: Grant[] = [
  {
    id: 'optimism-retropgf-5',
    name: 'Optimism RetroPGF Round 5',
    ecosystem: 'Optimism',
    fundingRange: '$10k - $500k',
    deadline: '2026-08-15',
    focusAreas: ['Public Goods', 'Infrastructure', 'Governance'],
    description: 'Retroactive Public Goods Funding for the Optimism Collective. The committee operates on the principle that "Impact = Profit".',
    officialUrl: 'https://app.optimism.io/retropgf',
    promptTemplate: 'You are an expert grant writer for the Optimism RetroPGF committee...',
  },
  {
    id: 'arbitrum-ltipp',
    name: 'Arbitrum LTIPP Pilot',
    ecosystem: 'Arbitrum',
    fundingRange: '$50k - $250k',
    deadline: '2026-07-30',
    focusAreas: ['DeFi', 'Gaming', 'Incentives'],
    description: 'Long-Term Incentives Pilot Program to drive ecosystem growth and user retention.',
    officialUrl: 'https://arbitrum.foundation',
    promptTemplate: 'You are a technical grant strategist for the Arbitrum LTIPP committee...',
  },
  {
    id: 'base-ecosystem-fund',
    name: 'Base Ecosystem Fund',
    ecosystem: 'Base',
    fundingRange: '$5k - $100k',
    deadline: '2026-09-01',
    focusAreas: ['Consumer Apps', 'Onramps', 'Social'],
    description: 'Supporting the next generation of consumer applications on Base.',
    officialUrl: 'https://base.mirror.xyz',
    promptTemplate: 'You are a product-focused grant writer for the Base Ecosystem Fund...',
  },
  {
    id: 'solana-foundation',
    name: 'Solana Foundation Grants',
    ecosystem: 'Solana',
    fundingRange: '$10k - $100k',
    deadline: '2026-08-01',
    focusAreas: ['DeFi', 'Infrastructure', 'DePIN'],
    description: 'Grants for high-performance projects building on the Solana network.',
    officialUrl: 'https://solana.org/grants',
    promptTemplate: 'You are a high-level systems engineer writing for the Solana Foundation...',
  },
  {
    id: 'ethereum-esp',
    name: 'Ethereum Foundation ESP',
    ecosystem: 'Ethereum',
    fundingRange: '$20k - $150k',
    deadline: '2026-10-15',
    focusAreas: ['Core Dev', 'Privacy', 'Education'],
    description: 'The Ecosystem Support Program for neutral, public-good projects.',
    officialUrl: 'https://esp.ethereum.foundation',
    promptTemplate: 'You are a research-focused grant writer for the Ethereum Foundation...',
  },
]

export function getGrantById(id: string): Grant | undefined {
  return GRANTS.find(g => g.id === id)
}
