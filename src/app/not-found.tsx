import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="inline-flex p-4 rounded-2xl bg-zinc-900 mb-6 border border-zinc-800 shadow-2xl">
          <FileQuestion className="h-12 w-12 text-cyan-400" />
        </div>
        
        <h1 className="text-7xl font-bold text-zinc-800 font-mono mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-zinc-50 mb-3">Lost in the ecosystem?</h2>
        <p className="text-zinc-400 max-w-md mb-10 mx-auto leading-relaxed">
          The page you are looking for does not exist. Let&apos;s get you back to tracking grants.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 px-8 h-12 gap-2">
            <Link href="/dashboard/grants">
              <Search className="h-4 w-4" />
              Browse Grants
            </Link>
          </Button>
          <Button asChild className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold px-8 h-12 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
