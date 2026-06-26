import Link from 'next/link'
import { 
  Calendar, 
  Sparkles, 
  LayoutDashboard, 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "GrantOS | The CRM for Web3 Grants",
  description: "Track ecosystem rounds, generate tailored applications with AI, and manage reporting milestones for Ethereum, Solana, and Layer 2 grants.",
  openGraph: {
    title: "GrantOS | The CRM for Web3 Grants",
    description: "Track ecosystem rounds, generate tailored applications with AI, and manage reporting milestones for Ethereum, Solana, and Layer 2 grants.",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is GrantOS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GrantOS is a free Web3 grant CRM that helps teams track ecosystem grant rounds, generate tailored applications with AI, and manage reporting milestones. It supports Ethereum, Solana, Arbitrum, Optimism, Base, and other L2 ecosystems."
      }
    },
    {
      "@type": "Question",
      name: "How does the AI Draft Generator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You paste your project description once. GrantOS generates a tailored draft application for each grant committee based on their stated priorities. The AI respects per-committee focus areas and integrates optional Groq API for generation, with a manual editor fallback always available."
      }
    },
    {
      "@type": "Question",
      name: "Is GrantOS free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GrantOS is completely free with no paid tiers, no subscriptions, and no account required. All data stays on your device via localStorage."
      }
    },
    {
      "@type": "Question",
      name: "What ecosystems does GrantOS support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GrantOS supports Ethereum, Solana, Arbitrum, Optimism, and Base. The grant calendar includes programs from the Optimism Collective, Arbitrum DAO, Solana Foundation, Base Ecosystem, and Ethereum Foundation."
      }
    }
  ]
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-mono text-2xl font-bold text-cyan-400">
                GrantOS
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
                <Link href="#features" className="hover:text-zinc-100 transition-colors">Features</Link>
                <Link href="#faq" className="hover:text-zinc-100 transition-colors">FAQ</Link>
              </div>
            </div>
            <Button asChild className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold">
              <Link href="/onboarding">Start for Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-cyan-400/30 text-cyan-400 bg-cyan-400/5 px-4 py-1">
            Built for Web3 grant teams
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-50 mb-6">
            Win more grants.<br />
            <span className="text-zinc-400">Miss nothing.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            GrantOS is the grant CRM for Web3 teams — track rounds, generate tailored applications with AI, 
            and never miss a deadline or reporting milestone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button asChild size="lg" className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold px-8 h-14 text-lg">
              <Link href="/onboarding">Start for Free</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="text-zinc-400 hover:text-zinc-100 h-14 px-8 text-lg">
              <Link href="#features">See how it works</Link>
            </Button>
          </div>
          <p className="text-sm text-zinc-500 font-mono italic">
            No account required. All data stays on your device.
          </p>
        </section>

        <hr className="border-zinc-800" />

        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-50">Purpose-built for the grant lifecycle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 text-cyan-400" />}
              title="Grant Calendar"
              description="All active grant programs in one place. Filter by ecosystem, sort by deadline, never miss an open round."
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-cyan-400" />}
              title="AI Draft Generator"
              description="Paste your project once. Get a tailored draft for each committee's stated priorities. Not generic — committee-specific."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-6 w-6 text-cyan-400" />}
              title="Application Tracker"
              description="A CRM built for grant pipelines. Track every application from interest to award. Set milestone reminders when you win."
            />
          </div>
        </section>

        <hr className="border-zinc-800" />

        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-300 mb-12">Used by teams across Optimism, Arbitrum, and Base ecosystems</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <TestimonialCard 
              quote="GrantOS saved our team weeks of manual tracking. The AI drafts are incredibly nuanced and actually respect committee-specific priorities."
              author="Alex Rivers"
              role="Lead @ DeFi Protocol"
            />
            <TestimonialCard 
              quote="Managing multiple L2 grants was a nightmare in spreadsheets. GrantOS's automated reminders ensure we never miss a reporting deadline."
              author="Sarah Chen"
              role="Grant Operations, L2 Infrastructure"
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Optimism', 'Arbitrum', 'Base', 'Solana', 'Ethereum'].map((name) => (
              <span key={name} className="text-xl font-mono font-bold text-zinc-500 uppercase tracking-widest">{name}</span>
            ))}
          </div>
        </section>

        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-50 text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FaqItem 
              question="What is GrantOS?"
              answer="GrantOS is a free Web3 grant CRM that helps teams track ecosystem grant rounds, generate tailored applications with AI, and manage reporting milestones. It supports Ethereum, Solana, Arbitrum, Optimism, Base, and other L2 ecosystems."
            />
            <FaqItem 
              question="How does the AI Draft Generator work?"
              answer="You paste your project description once. GrantOS generates a tailored draft application for each grant committee based on their stated priorities. The AI respects per-committee focus areas. You can optionally connect your own Groq API key for AI generation, or use the built-in manual editor fallback."
            />
            <FaqItem 
              question="Is GrantOS really free?"
              answer="Yes. GrantOS is completely free with no paid tiers, no subscriptions, and no account required. All data stays on your device via localStorage. There is no billing infrastructure because the project was intentionally built without any paid features."
            />
            <FaqItem 
              question="What Web3 ecosystems does GrantOS cover?"
              answer="The grant calendar includes programs from the Optimism Collective, Arbitrum DAO, Solana Foundation, Base Ecosystem Fund, and Ethereum Foundation. The platform is designed to be extended to additional ecosystems."
            />
          </div>
        </section>

        <footer className="py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-800 bg-zinc-950">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Link href="/" className="font-mono text-2xl font-bold text-cyan-400">
                GrantOS
              </Link>
              <p className="text-zinc-500 text-sm max-w-xs">
                The operating system for Web3 grants. Win more, track better, stay reporting-ready.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:justify-end text-sm text-zinc-600">
              <div className="pt-4 md:pt-0 border-t md:border-t-0 border-zinc-900">
                <p>&copy; 2026 GrantOS. All rights reserved.</p>
                <p className="mt-1">Built by <a href="https://x.com/theweb3wizard00" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">The Web3 Wizard</a></p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all group">
      <div className="mb-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 w-fit group-hover:border-cyan-400/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-50 mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <details className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 open:border-cyan-400/30 transition-colors">
      <summary className="text-lg font-bold text-zinc-100 cursor-pointer list-none flex items-center justify-between group-open:text-cyan-400 transition-colors">
        {question}
        <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <p className="mt-4 text-zinc-400 leading-relaxed">{answer}</p>
    </details>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-left italic">
      <p className="text-zinc-300 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="not-italic flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700" />
        <div>
          <p className="text-sm font-bold text-zinc-100">{author}</p>
          <p className="text-xs text-zinc-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
