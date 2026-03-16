import { DashboardAnalytics } from './components/dashboard-analytics'
import { SkeletonBlock } from './components/dashboard-ui'

export default function DashboardLoading() {
  return (
    <div className="space-y-10 lg:space-y-12">
      <section className="space-y-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <SkeletonBlock className="h-3 w-28 rounded-lg" />
            <div className="space-y-2.5">
              <SkeletonBlock className="h-10 w-56 rounded-xl" />
              <SkeletonBlock className="h-5 w-full max-w-2xl rounded-lg" />
              <SkeletonBlock className="h-5 w-3/4 max-w-xl rounded-lg" />
            </div>
          </div>
          <SkeletonBlock className="h-11 w-32 rounded-xl" />
        </div>
      </section>

      <div className="space-y-10 lg:space-y-12">
        <DashboardAnalytics runs={[]} isLoading />
      </div>
    </div>
  )
}
