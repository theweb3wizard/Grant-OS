import { KanbanSkeleton } from "@/components/layout/skeletons"

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-full overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-64 bg-zinc-800 animate-pulse rounded" />
        <div className="h-4 w-96 bg-zinc-800 animate-pulse rounded mt-2" />
      </div>
      <KanbanSkeleton />
    </div>
  )
}
