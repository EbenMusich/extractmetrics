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
import { SectionHeader, secondaryButtonClass } from './dashboard-ui'
import { ResponsiveDashboardTable } from './responsive-dashboard-table'

type RecentRun = RunTableRun

type RecentRunsTableProps = {
  runs: RecentRun[]
  emptyMessage?: string
}

const MAX_VISIBLE_RUNS = 15

function getRecentRunsRow(run: RecentRun) {
  return {
    key: run.id,
    primaryLabel: formatDate(run.run_date),
    desktopCells: [
      { content: formatDate(run.run_date), className: textCellClass },
      { content: formatText(run.strain_name), className: textCellClass },
      { content: formatText(run.output_type), className: textCellClass },
      { content: formatGrams(run.biomass_input_g), className: numericCellClass },
      { content: formatGrams(run.output_weight_g), className: numericCellClass },
      { content: getFormattedYieldPercent(run), className: numericCellClass },
      { content: getFormattedCostPerGram(run), className: numericCellClass },
    ],
    mobileFields: [
      { label: 'Strain', value: formatText(run.strain_name) },
      { label: 'Output Type', value: formatText(run.output_type) },
      {
        label: 'Biomass Input',
        value: formatGrams(run.biomass_input_g),
        valueClassName: 'tabular-nums',
      },
      {
        label: 'Output Weight',
        value: formatGrams(run.output_weight_g),
        valueClassName: 'tabular-nums',
      },
      { label: 'Yield', value: getFormattedYieldPercent(run), valueClassName: 'tabular-nums' },
      {
        label: 'Cost per g Output',
        value: getFormattedCostPerGram(run),
        valueClassName: 'tabular-nums',
      },
    ],
  }
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

      <ResponsiveDashboardTable
        columns={[
          { header: 'Run Date', className: textCellClass },
          { header: 'Strain', className: textCellClass },
          { header: 'Output Type', className: textCellClass },
          { header: 'Biomass Input', className: numericCellClass },
          { header: 'Output Weight', className: numericCellClass },
          { header: 'Yield', className: numericCellClass },
          { header: 'Cost per g Output', className: numericCellClass },
        ]}
        rows={visibleRuns.map(getRecentRunsRow)}
        emptyStateTitle="No recent runs"
        emptyMessage={emptyMessage}
      />
    </section>
  )
}
