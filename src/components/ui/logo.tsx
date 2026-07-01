import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'full'
  className?: string
  markSize?: number
}

function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="7" fill="currentColor" />
      <path
        d="M10 10H19A3 3 0 0 1 22 13V21A3 3 0 0 1 19 24H12"
        stroke="#09090b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16H18"
        stroke="#09090b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({ variant = 'mark', className, markSize }: LogoProps) {
  if (variant === 'mark') {
    return (
      <LogoMark
        size={markSize ?? 32}
        className={cn('text-cyan-400', className)}
      />
    )
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <LogoMark size={markSize ?? 48} className="text-cyan-400" />
        <span className="font-mono text-2xl font-bold text-zinc-100">
          GrantOS
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark size={markSize ?? 28} className="text-cyan-400 shrink-0" />
      <span className="font-mono text-xl font-bold text-zinc-100">
        GrantOS
      </span>
    </div>
  )
}
