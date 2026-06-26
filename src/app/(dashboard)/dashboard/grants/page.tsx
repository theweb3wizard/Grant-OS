import { GrantCalendar } from '@/components/grants/grant-calendar'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { GRANTS } from '@/lib/grants-data'

export default function GrantsPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader 
        title="Grant Calendar"
        description="Browse and track active Web3 grants across the ecosystem."
      />
      <GrantCalendar initialGrants={GRANTS} />
    </div>
  )
}
