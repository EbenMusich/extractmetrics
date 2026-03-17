import type { ReactNode } from 'react'
import { EmptyState, tableClass, tableHeadClass, tableRowClass, tableWrapperClass } from './dashboard-ui'

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type ResponsiveDashboardTableColumn = {
  header: ReactNode
  className?: string
}

type ResponsiveDashboardTableCell = {
  content: ReactNode
  className?: string
}

type ResponsiveDashboardTableField = {
  label: string
  value: ReactNode
  valueClassName?: string
}

export type ResponsiveDashboardTableRow = {
  key: string
  primaryLabel: ReactNode
  primaryMeta?: ReactNode
  desktopCells: ResponsiveDashboardTableCell[]
  mobileFields: ResponsiveDashboardTableField[]
}

type ResponsiveDashboardTableProps = {
  columns: ResponsiveDashboardTableColumn[]
  rows: ResponsiveDashboardTableRow[]
  emptyStateTitle: string
  emptyMessage: ReactNode
}

export function ResponsiveDashboardTable({
  columns,
  rows,
  emptyStateTitle,
  emptyMessage,
}: ResponsiveDashboardTableProps) {
  return (
    <div className={tableWrapperClass}>
      {rows.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState compact title={emptyStateTitle} description={emptyMessage} />
        </div>
      ) : (
        <>
          <div className="space-y-3 p-4 md:hidden">
            {rows.map((row) => (
              <article
                key={row.key}
                className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
              >
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-gray-950">{row.primaryLabel}</p>
                  {row.primaryMeta ? <p className="text-xs text-gray-500">{row.primaryMeta}</p> : null}
                </div>
                <dl className="mt-4 space-y-2.5">
                  {row.mobileFields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-start justify-between gap-4 border-t border-gray-100 pt-2.5 first:border-t-0 first:pt-0"
                    >
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
                        {field.label}
                      </dt>
                      <dd
                        className={joinClasses(
                          'text-right text-sm font-medium text-gray-700',
                          field.valueClassName
                        )}
                      >
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={tableHeadClass}>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className={column.className}>
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {rows.map((row) => (
                    <tr key={row.key} className={tableRowClass}>
                      {row.desktopCells.map((cell, index) => (
                        <td key={index} className={cell.className}>
                          {cell.content}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
