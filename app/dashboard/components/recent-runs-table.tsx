import Link from 'next/link'
import {
  formatDate,
  formatGrams,
  formatText,
  getFormattedCostPerGram,
  getFormattedYieldPercent,
  numericCellClass,
  textCellClass,
  type RunTableRun,
} from './run-table-formatters'
import {
  EmptyState,
  SectionHeader,
  secondaryButtonClass,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableWrapperClass,
} from './dashboard-ui'

type RecentRun = RunTableRun

type RecentRunsTableProps = {
  runs: RecentRun[]
  emptyMessage?: string
}

const MAX_VISIBLE_RUNS = 15

function RecentRunsRow({ run }: { run: RecentRun }) {
  return (
    <tr className={tableRowClass}>
      <td className={textCellClass}>{formatDate(run.run_date)}</td>
      <td className={textCellClass}>{formatText(run.strain_name)}</td>
      <td className={textCellClass}>{formatText(run.output_type)}</td>
      <td className={numericCellClass}>{formatGrams(run.biomass_input_g)}</td>
      <td className={numericCellClass}>{formatGrams(run.output_weight_g)}</td>
      <td className={numericCellClass}>{getFormattedYieldPercent(run)}</td>
      <td className={numericCellClass}>{getFormattedCostPerGram(run)}</td>
    </tr>
  )
}

export function RecentRunsTable({
  runs,
  emptyMessage = 'No runs recorded yet.',
}: RecentRunsTableProps) {
  const visibleRuns = runs.slice(0, MAX_VISIBLE_RUNS)

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Recent runs"
        description="Your latest saved extraction runs."
        action={
          <Link href="/dashboard/runs" className={secondaryButtonClass}>
            View all runs
          </Link>
        }
      />

      <div className={tableWrapperClass}>
        <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500 sm:hidden">
          Scroll horizontally to view all recent run columns.
        </div>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={textCellClass}>Run Date</th>
                <th className={textCellClass}>Strain</th>
                <th className={textCellClass}>Output Type</th>
                <th className={numericCellClass}>Biomass Input</th>
                <th className={numericCellClass}>Output Weight</th>
                <th className={numericCellClass}>Yield</th>
                <th className={numericCellClass}>Cost per g Output</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={7}>
                    <EmptyState compact title="No recent runs" description={emptyMessage} />
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => <RecentRunsRow key={run.id} run={run} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
