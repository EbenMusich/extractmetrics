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

type RecentRun = RunTableRun

type RecentRunsTableProps = {
  runs: RecentRun[]
  emptyMessage?: string
}

const MAX_VISIBLE_RUNS = 15

function RecentRunsRow({ run }: { run: RecentRun }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80">
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
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">Recent runs</h2>
        <p className="text-sm text-gray-600">Your latest saved extraction runs.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
              <tr>
                <th className={textCellClass}>Run Date</th>
                <th className={textCellClass}>Strain</th>
                <th className={textCellClass}>Output Type</th>
                <th className={numericCellClass}>Biomass In</th>
                <th className={numericCellClass}>Output</th>
                <th className={numericCellClass}>Yield %</th>
                <th className={numericCellClass}>Cost / g</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={7}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => <RecentRunsRow key={run.id} run={run} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Link
          href="/dashboard/runs"
          className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
        >
          View all runs →
        </Link>
      </div>
    </section>
  )
}
