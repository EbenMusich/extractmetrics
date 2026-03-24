'use client'

import { useMemo, useState, useTransition, type FormEvent } from 'react'
import {
  clearCurrentUserDefaultsAction,
  saveCurrentUserDefaultsAction,
} from '@/app/dashboard/defaults/actions'
import {
  dashboardSurfaceClass,
  destructiveButtonClass,
  helperTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  StatusBanner,
} from './dashboard-ui'
import { coerceFiniteNumber } from './safe-number'
import type { SavedDefaultsInput } from '@/lib/user-defaults'

type SavedDefaultsFormProps = {
  initialDefaults: SavedDefaultsInput | null
  loadError?: string | null
}

type SavedDefaultsFormValues = {
  operatorName: string
  solventType: string
  inputMaterialType: string
  outputType: string
  laborRate: string
}

function createInitialValues(initialDefaults: SavedDefaultsInput | null): SavedDefaultsFormValues {
  return {
    operatorName: initialDefaults?.operatorName ?? '',
    solventType: initialDefaults?.solventType ?? '',
    inputMaterialType: initialDefaults?.inputMaterialType ?? '',
    outputType: initialDefaults?.outputType ?? '',
    laborRate: initialDefaults?.laborRate?.toString() ?? '',
  }
}

function hasAnyValue(values: SavedDefaultsFormValues) {
  return Object.values(values).some((value) => value.trim().length > 0)
}

function parseSavedDefaults(values: SavedDefaultsFormValues): SavedDefaultsInput {
  const laborRate = values.laborRate.trim()
  const parsedLaborRate = coerceFiniteNumber(laborRate)

  if (laborRate && (parsedLaborRate === null || parsedLaborRate < 0)) {
    throw new Error('Default labor rate must be 0 or greater.')
  }

  return {
    operatorName: values.operatorName || null,
    solventType: values.solventType || null,
    inputMaterialType: values.inputMaterialType || null,
    outputType: values.outputType || null,
    laborRate: laborRate ? parsedLaborRate : null,
  }
}

export function SavedDefaultsForm({ initialDefaults, loadError = null }: SavedDefaultsFormProps) {
  const [values, setValues] = useState(() => createInitialValues(initialDefaults))
  const [feedback, setFeedback] = useState<{
    error: string | null
    success: string | null
  }>({
    error: loadError,
    success: null,
  })
  const [isPending, startTransition] = useTransition()
  const [hasPersistedDefaults, setHasPersistedDefaults] = useState(Boolean(initialDefaults))
  const isEmpty = useMemo(() => !hasAnyValue(values), [values])

  function handleChange(field: keyof SavedDefaultsFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))

    if (feedback.error || feedback.success) {
      setFeedback({
        error: null,
        success: null,
      })
    }
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let nextDefaults: SavedDefaultsInput

    try {
      nextDefaults = parseSavedDefaults(values)
    } catch (error) {
      setFeedback({
        error: error instanceof Error ? error.message : 'Unable to save defaults.',
        success: null,
      })
      return
    }

    startTransition(async () => {
      const result = isEmpty
        ? await clearCurrentUserDefaultsAction()
        : await saveCurrentUserDefaultsAction(nextDefaults)

      setFeedback(result)

      if (!result.error) {
        setHasPersistedDefaults(!isEmpty)
      }
    })
  }

  function handleClear() {
    startTransition(async () => {
      const result = await clearCurrentUserDefaultsAction()

      setFeedback(result)

      if (!result.error) {
        setValues(createInitialValues(null))
        setHasPersistedDefaults(false)
      }
    })
  }

  return (
    <form onSubmit={handleSave} className={`${dashboardSurfaceClass} max-w-4xl space-y-5 p-5 sm:p-6`}>
      <div className="space-y-1.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-gray-950">Saved defaults</h2>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            {hasPersistedDefaults ? 'Saved for this account' : 'No defaults saved'}
          </p>
        </div>
        <p className="text-sm leading-6 text-gray-600">
          Save a few values you reuse often. This is only for managing defaults right now and does not
          auto-fill the run form yet.
        </p>
      </div>

      {!hasPersistedDefaults && isEmpty && !feedback.error ? (
        <p className="text-sm text-gray-600">
          No saved defaults yet. Add any values you use repeatedly and save when ready.
        </p>
      ) : null}

      <fieldset disabled={isPending} className="space-y-5 disabled:cursor-wait disabled:opacity-80">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Default Operator Name</span>
            <input
              type="text"
              value={values.operatorName}
              onChange={(event) => handleChange('operatorName', event.target.value)}
              placeholder="e.g. Alex"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>Default Solvent Type</span>
            <input
              type="text"
              value={values.solventType}
              onChange={(event) => handleChange('solventType', event.target.value)}
              placeholder="e.g. Butane"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>Default Input Material Type</span>
            <input
              type="text"
              value={values.inputMaterialType}
              onChange={(event) => handleChange('inputMaterialType', event.target.value)}
              placeholder="e.g. Fresh frozen"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>Default Output Type</span>
            <input
              type="text"
              value={values.outputType}
              onChange={(event) => handleChange('outputType', event.target.value)}
              placeholder="e.g. Live resin"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2 md:max-w-xs">
            <span className={labelClass}>Default Labor Rate</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.laborRate}
              onChange={(event) => handleChange('laborRate', event.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
            <span className={helperTextClass}>Hourly rate in USD.</span>
          </label>
        </div>

        <div aria-live="polite" className="space-y-3">
          {feedback.error ? <StatusBanner tone="error">{feedback.error}</StatusBanner> : null}
          {feedback.success ? <StatusBanner tone="success">{feedback.success}</StatusBanner> : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Leave any field blank if you do not want a saved value for it.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleClear}
              disabled={isPending || (!hasPersistedDefaults && isEmpty)}
              className={destructiveButtonClass}
            >
              {isPending ? 'Working...' : 'Clear defaults'}
            </button>
            <button type="submit" disabled={isPending} className={primaryButtonClass}>
              {isPending ? 'Saving...' : 'Save defaults'}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
