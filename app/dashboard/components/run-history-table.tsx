'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { deleteRunAction } from '@/app/dashboard/actions'
import { filterRunsBySearchTerm } from './run-history-filter'
import {
  EmptyState,
  SectionHeader,
  destructiveButtonClass,
  inputClass,
  secondaryButtonClass,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableWrapperClass,
} from './dashboard-ui'
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

type RunHistoryTableProps = {
  runs: RunTableRun[]
}

const RUNS_PER_PAGE = 25

function DeleteRunButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`${destructiveButtonClass} px-3 py-1.5 text-xs`}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

function DeleteRunForm({ runId }: { runId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  function handleDeleteClick() {
    if (!window.confirm('Delete this run? This cannot be undone.')) {
      return
    }

    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={deleteRunAction}>
      <input type="hidden" name="run_id" value={runId} />
      <DeleteRunButton onClick={handleDeleteClick} />
    </form>
  )
}

export function RunHistoryTable({ runs }: RunHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRuns = useMemo(() => filterRunsBySearchTerm(runs, searchTerm), [runs, searchTerm])
  const exportHref = useMemo(() => {
    const params = new URLSearchParams()
    const normalizedSearchTerm = searchTerm.trim()

    if (normalizedSearchTerm) {
      params.set('search', normalizedSearchTerm)
    }

    const queryString = params.toString()
    return queryString ? `/dashboard/runs/export?${queryString}` : '/dashboard/runs/export'
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / RUNS_PER_PAGE))
  const visiblePage = Math.min(currentPage, totalPages)
  const startIndex = (visiblePage - 1) * RUNS_PER_PAGE
  const visibleRuns = filteredRuns.slice(startIndex, startIndex + RUNS_PER_PAGE)
  const hasRuns = runs.length > 0

  return (
    <section className="space-y-5">
      <SectionHeader
        title="All runs"
        description="Browse your full extraction history with search, pagination, and filtered export."
        action={
          <a
            href={filteredRuns.length > 0 ? exportHref : undefined}
            className={`${secondaryButtonClass} aria-disabled:pointer-events-none aria-disabled:opacity-50`}
            aria-disabled={filteredRuns.length === 0}
          >
            Export CSV
          </a>
        }
      />

      <div className={tableWrapperClass}>
        <div className="border-b border-gray-200 px-4 py-4 sm:px-5">
          <label className="flex w-full flex-col gap-1 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Search runs</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search strain, grower, or output type"
              className={inputClass}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={textCellClass}>Run Date</th>
                <th className={textCellClass}>Strain</th>
                <th className={textCellClass}>Grower</th>
                <th className={textCellClass}>Output Type</th>
                <th className={numericCellClass}>Biomass In</th>
                <th className={numericCellClass}>Output</th>
                <th className={numericCellClass}>Yield %</th>
                <th className={numericCellClass}>Cost / g</th>
                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {!hasRuns ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={9}>
                    <EmptyState
                      compact
                      title="No runs recorded yet"
                      description="Create your first run to start building a searchable history."
                    />
                  </td>
                </tr>
              ) : visibleRuns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 sm:px-5" colSpan={9}>
                    <EmptyState
                      compact
                      title="No matching runs"
                      description="Try a different search term or clear the filter to see more results."
                    />
                  </td>
                </tr>
              ) : (
                visibleRuns.map((run) => (
                  <tr key={run.id} className={tableRowClass}>
                    <td className={textCellClass}>{formatDate(run.run_date)}</td>
                    <td className={textCellClass}>{formatText(run.strain_name)}</td>
                    <td className={textCellClass}>{formatText(run.grower_name)}</td>
                    <td className={textCellClass}>{formatText(run.output_type)}</td>
                    <td className={numericCellClass}>{formatGrams(run.biomass_input_g)}</td>
                    <td className={numericCellClass}>{formatGrams(run.output_weight_g)}</td>
                    <td className={numericCellClass}>{getFormattedYieldPercent(run)}</td>
                    <td className={numericCellClass}>{getFormattedCostPerGram(run)}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/runs/${run.id}/edit`}
                          className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}
                        >
                          Edit
                        </Link>
                        <DeleteRunForm runId={run.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasRuns ? (
        <div className={`${tableWrapperClass} flex flex-col gap-3 px-4 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-5`}>
          <p>
            Showing {filteredRuns.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + RUNS_PER_PAGE, filteredRuns.length)} of{' '}
            {filteredRuns.length} runs
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={visiblePage === 1 || filteredRuns.length === 0}
              className={secondaryButtonClass}
            >
              Previous
            </button>
            <span>
              Page {filteredRuns.length === 0 ? 0 : visiblePage} of {filteredRuns.length === 0 ? 0 : totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={visiblePage >= totalPages || filteredRuns.length === 0}
              className={secondaryButtonClass}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
