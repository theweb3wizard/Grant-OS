'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="inline-flex p-4 rounded-2xl bg-zinc-900 mb-6 border border-zinc-800 shadow-2xl">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-50 font-mono mb-2">Something went wrong</h1>
        <p className="text-zinc-400 max-w-md mb-10 mx-auto leading-relaxed">
          An unexpected error occurred. Please try again or return home.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={reset}
            variant="outline" 
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 px-8 h-12 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300 font-bold px-8 h-12 gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
