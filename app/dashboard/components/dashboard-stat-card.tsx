import { dashboardSurfaceClass } from './dashboard-ui'

type DashboardStatCardProps = {
  label: string
  value: string
  unit?: string
}

export function DashboardStatCard({ label, value, unit }: DashboardStatCardProps) {
  return (
    <article className={`${dashboardSurfaceClass} flex min-h-32 flex-col justify-between p-4 sm:p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-[2rem]">{value}</p>
        {unit ? (
          <span className="pb-1 text-sm font-medium tracking-[0.08em] text-gray-400">
            {unit}
          </span>
        ) : null}
      </div>
    </article>
  )
}
