"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
    defaultChecked?: boolean
  }
>(({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
  const isChecked = checked !== undefined ? checked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setInternalChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  return (
    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
      <input
        type="checkbox"
        ref={ref}
        checked={isChecked}
        onChange={handleChange}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-zinc-700 bg-zinc-900 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors",
          isChecked && "bg-cyan-400 border-cyan-400",
          className
        )}
        {...props}
      />
      {isChecked && (
        <Check className="absolute h-3 w-3 text-zinc-950 pointer-events-none" strokeWidth={4} />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
