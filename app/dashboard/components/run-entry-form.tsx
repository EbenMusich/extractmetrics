'use client'

import {
  useActionState,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useFormStatus } from 'react-dom'
import {
  createRunAction,
  updateRunAction,
  type CreateRunFormState,
} from '@/app/dashboard/actions'
import {
  dashboardInsetSurfaceClass,
  dashboardSurfaceClass,
  helperTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  StatusBanner,
  errorTextClass,
} from './dashboard-ui'
import { coerceFiniteNumber, roundNumber, toSafeNumber } from './safe-number'

const initialState: CreateRunFormState = {
  error: null,
  success: null,
  resetKey: 0,
  fieldErrors: {},
}

export type RunFormValues = {
  run_date: string
  output_type: string
  strain_name: string
  grower_name: string
  biomass_input_g: string
  output_weight_g: string
  solvent_used_g: string
  labor_minutes: string
  labor_rate: string
  material_cost: string
  utility_cost: string
  other_cost: string
  notes: string
}

type RunFormFieldErrors = CreateRunFormState['fieldErrors']

const outputTypeSuggestions = [
  'Live resin',
  'Rosin',
  'Distillate',
  'Wax',
  'Shatter',
  'Badder',
  'Crude oil',
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function getTodayDateValue() {
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  return today.toISOString().split('T')[0]
}

function createInitialValues(): RunFormValues {
  return {
    run_date: getTodayDateValue(),
    output_type: '',
    strain_name: '',
    grower_name: '',
    biomass_input_g: '',
    output_weight_g: '',
    solvent_used_g: '',
    labor_minutes: '',
    labor_rate: '',
    material_cost: '',
    utility_cost: '',
    other_cost: '',
    notes: '',
  }
}

function mergeInitialValues(initialValues?: Partial<RunFormValues>): RunFormValues {
  const defaults = createInitialValues()

  return {
    run_date: initialValues?.run_date ?? defaults.run_date,
    output_type: initialValues?.output_type ?? defaults.output_type,
    strain_name: initialValues?.strain_name ?? defaults.strain_name,
    grower_name: initialValues?.grower_name ?? defaults.grower_name,
    biomass_input_g: initialValues?.biomass_input_g ?? defaults.biomass_input_g,
    output_weight_g: initialValues?.output_weight_g ?? defaults.output_weight_g,
    solvent_used_g: initialValues?.solvent_used_g ?? defaults.solvent_used_g,
    labor_minutes: initialValues?.labor_minutes ?? defaults.labor_minutes,
    labor_rate: initialValues?.labor_rate ?? defaults.labor_rate,
    material_cost: initialValues?.material_cost ?? defaults.material_cost,
    utility_cost: initialValues?.utility_cost ?? defaults.utility_cost,
    other_cost: initialValues?.other_cost ?? defaults.other_cost,
    notes: initialValues?.notes ?? defaults.notes,
  }
}

function validateForm(values: RunFormValues): RunFormFieldErrors {
  const errors: RunFormFieldErrors = {}
  const biomassInput = coerceFiniteNumber(values.biomass_input_g)
  const outputWeight = coerceFiniteNumber(values.output_weight_g)
  const solventUsed = coerceFiniteNumber(values.solvent_used_g)
  const laborMinutes = coerceFiniteNumber(values.labor_minutes)
  const laborRate = coerceFiniteNumber(values.labor_rate)
  const materialCost = coerceFiniteNumber(values.material_cost)
  const utilityCost = coerceFiniteNumber(values.utility_cost)
  const otherCost = coerceFiniteNumber(values.other_cost)

  if (!values.run_date) {
    errors.run_date = 'Run date is required.'
  }
  if (!values.output_type.trim()) {
    errors.output_type = 'Output type is required.'
  }
  if (!values.strain_name.trim()) {
    errors.strain_name = 'Strain name is required.'
  }
  if (!values.grower_name.trim()) {
    errors.grower_name = 'Grower name is required.'
  }

  if (!values.biomass_input_g.trim()) {
    errors.biomass_input_g = 'Biomass input is required.'
  } else if (biomassInput === null || biomassInput <= 0) {
    errors.biomass_input_g = 'Biomass input must be greater than 0.'
  }

  if (!values.output_weight_g.trim()) {
    errors.output_weight_g = 'Output weight is required.'
  } else if (outputWeight === null || outputWeight < 0) {
    errors.output_weight_g = 'Output weight must be 0 or greater.'
  }

  if (values.solvent_used_g.trim() && (solventUsed === null || solventUsed < 0)) {
    errors.solvent_used_g = 'Solvent used must be 0 or greater.'
  }

  if (values.labor_minutes.trim() && (laborMinutes === null || laborMinutes < 0)) {
    errors.labor_minutes = 'Labor minutes must be 0 or greater.'
  }

  if (values.labor_rate.trim() && (laborRate === null || laborRate < 0)) {
    errors.labor_rate = 'Labor rate must be 0 or greater.'
  }

  if (values.material_cost.trim() && (materialCost === null || materialCost < 0)) {
    errors.material_cost = 'Material cost must be 0 or greater.'
  }

  if (values.utility_cost.trim() && (utilityCost === null || utilityCost < 0)) {
    errors.utility_cost = 'Utility cost must be 0 or greater.'
  }

  if (values.other_cost.trim() && (otherCost === null || otherCost < 0)) {
    errors.other_cost = 'Other cost must be 0 or greater.'
  }

  return errors
}

function getOutputWeightWarning(values: RunFormValues) {
  const biomassInput = coerceFiniteNumber(values.biomass_input_g)
  const outputWeight = coerceFiniteNumber(values.output_weight_g)

  if (
    values.biomass_input_g.trim() &&
    values.output_weight_g.trim() &&
    biomassInput !== null &&
    outputWeight !== null &&
    biomassInput > 0 &&
    outputWeight > biomassInput
  ) {
    return 'Output weight is higher than biomass input. Please double-check those values.'
  }

  return null
}

function readNumericValue(value: string) {
  return coerceFiniteNumber(value)
}

function getOutputWeightHelper(values: RunFormValues) {
  const outputWeightWarning = getOutputWeightWarning(values)
  if (outputWeightWarning) {
    return outputWeightWarning
  }

  const biomassInput = readNumericValue(values.biomass_input_g)
  const outputWeight = readNumericValue(values.output_weight_g)

  if (biomassInput === null || outputWeight === null || biomassInput <= 0 || outputWeight < 0) {
    return 'Recorded output weight in grams.'
  }

  return `${percentFormatter.format(roundNumber((outputWeight / biomassInput) * 100, 1))}% current estimated yield.`
}

function getLaborCostPreview(values: RunFormValues) {
  const laborMinutes = readNumericValue(values.labor_minutes)
  const laborRate = readNumericValue(values.labor_rate)

  if (laborMinutes === null || laborRate === null || laborMinutes < 0 || laborRate < 0) {
    return 'Hourly rate in USD. Labor cost is calculated automatically.'
  }

  const laborCost = toSafeNumber((laborMinutes / 60) * laborRate)
  return `${currencyFormatter.format(laborCost)} calculated labor cost from ${laborMinutes} min at ${currencyFormatter.format(laborRate)}/hr.`
}

function getTotalTrackedCostHelper(values: RunFormValues) {
  const laborMinutes = readNumericValue(values.labor_minutes) ?? 0
  const laborRate = readNumericValue(values.labor_rate) ?? 0
  const materialCost = readNumericValue(values.material_cost) ?? 0
  const utilityCost = readNumericValue(values.utility_cost) ?? 0
  const otherCost = readNumericValue(values.other_cost) ?? 0
  const totalTrackedCost = toSafeNumber(
    materialCost + utilityCost + otherCost + (laborMinutes / 60) * laborRate
  )

  return `${currencyFormatter.format(totalTrackedCost)} total tracked cost so far across labor, materials, utilities, and other costs.`
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className={errorTextClass}>{message}</p>
}

type RunEntryFormProps = {
  mode?: 'create' | 'edit'
  title?: string
  description?: string
  submitLabel?: string
  successRedirectTo?: string
  initialValues?: Partial<RunFormValues>
  runId?: string
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className={`${dashboardInsetSurfaceClass} space-y-4 p-5 sm:p-6`}>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-gray-950">{title}</h3>
        <p className="text-sm leading-6 text-gray-600">{description}</p>
      </div>
      {children}
    </section>
  )
}

function FieldShell({
  label,
  error,
  helper,
  required = false,
  className,
  children,
}: {
  label: string
  error?: string
  helper?: ReactNode
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <label className={joinClasses('flex flex-col gap-2', className)}>
      <span className={labelClass}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
      {helper ? <p className={helperTextClass}>{helper}</p> : null}
      <FieldError message={error} />
    </label>
  )
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className={`${primaryButtonClass} min-w-32 px-5`}>
      {pending ? 'Saving...' : label}
    </button>
  )
}

type RunEntryFormBodyProps = {
  title: string
  description: string
  values: RunFormValues
  fieldErrors: RunFormFieldErrors
  shouldShowValidationSummary: boolean
  validationMessages: string[]
  state: CreateRunFormState
  submitLabel: string
  onChange: (field: keyof RunFormValues, value: string) => void
}

function RunEntryFormBody({
  title,
  description,
  values,
  fieldErrors,
  shouldShowValidationSummary,
  validationMessages,
  state,
  submitLabel,
  onChange,
}: RunEntryFormBodyProps) {
  const { pending } = useFormStatus()

  return (
    <fieldset disabled={pending} className="space-y-6 disabled:cursor-wait disabled:opacity-80">
      <div className="space-y-2.5">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[1.75rem]">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
      </div>

      <StatusBanner tone="info">
        Required fields are marked with <span className="font-semibold">*</span>. Weights are entered in
        grams and monetary values are entered in USD.
      </StatusBanner>

      <FormSection
        title="Run details"
        description="Capture the identifying details for this extraction run."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell
            label="Run date"
            error={fieldErrors.run_date}
            helper="Use the production date for this run."
            required
          >
            <input
              name="run_date"
              type="date"
              value={values.run_date}
              onChange={(event) => onChange('run_date', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.run_date)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Output type"
            error={fieldErrors.output_type}
            helper="Use a consistent label for analytics. Choose a common type or enter your own."
            required
          >
            <input
              name="output_type"
              type="text"
              value={values.output_type}
              onChange={(event) => onChange('output_type', event.target.value)}
              placeholder="e.g. Live resin"
              list="output-type-suggestions"
              autoComplete="off"
              required
              aria-invalid={Boolean(fieldErrors.output_type)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Strain"
            error={fieldErrors.strain_name}
            helper="Use the strain name you want to report on in analytics."
            required
          >
            <input
              name="strain_name"
              type="text"
              value={values.strain_name}
              onChange={(event) => onChange('strain_name', event.target.value)}
              placeholder="e.g. Blue Dream"
              required
              aria-invalid={Boolean(fieldErrors.strain_name)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Grower"
            error={fieldErrors.grower_name}
            helper="Use a consistent grower or supplier name for filtering."
            required
          >
            <input
              name="grower_name"
              type="text"
              value={values.grower_name}
              onChange={(event) => onChange('grower_name', event.target.value)}
              placeholder="e.g. North Farm"
              required
              aria-invalid={Boolean(fieldErrors.grower_name)}
              className={inputClass}
            />
          </FieldShell>
        </div>
      </FormSection>

      <FormSection
        title="Measurements and costs"
        description="Enter the recorded output and cost values for this run."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell
            label="Biomass input (g)"
            error={fieldErrors.biomass_input_g}
            helper="Starting material weight in grams."
            required
          >
            <input
              name="biomass_input_g"
              type="number"
              step="0.01"
              min="0.01"
              value={values.biomass_input_g}
              onChange={(event) => onChange('biomass_input_g', event.target.value)}
              placeholder="0.00"
              required
              aria-invalid={Boolean(fieldErrors.biomass_input_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Output weight (g)"
            error={fieldErrors.output_weight_g}
            helper={getOutputWeightHelper(values)}
            required
          >
            <input
              name="output_weight_g"
              type="number"
              step="0.01"
              min="0"
              value={values.output_weight_g}
              onChange={(event) => onChange('output_weight_g', event.target.value)}
              placeholder="0.00"
              required
              aria-invalid={Boolean(fieldErrors.output_weight_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Solvent used (g)"
            error={fieldErrors.solvent_used_g}
            helper="Optional. Leave blank if this run did not track solvent use."
          >
            <input
              name="solvent_used_g"
              type="number"
              step="0.01"
              min="0"
              value={values.solvent_used_g}
              onChange={(event) => onChange('solvent_used_g', event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(fieldErrors.solvent_used_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Material cost"
            error={fieldErrors.material_cost}
            helper="Enter the material spend in USD. Use 0 if none."
          >
            <input
              name="material_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.material_cost}
              onChange={(event) => onChange('material_cost', event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(fieldErrors.material_cost)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Labor minutes"
            error={fieldErrors.labor_minutes}
            helper="Optional. Total hands-on time spent on this run. Leave blank to save 0."
          >
            <input
              name="labor_minutes"
              type="number"
              step="1"
              min="0"
              value={values.labor_minutes}
              onChange={(event) => onChange('labor_minutes', event.target.value)}
              placeholder="0"
              aria-invalid={Boolean(fieldErrors.labor_minutes)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Labor rate ($/hr)"
            error={fieldErrors.labor_rate}
            helper={getLaborCostPreview(values)}
          >
            <input
              name="labor_rate"
              type="number"
              step="0.01"
              min="0"
              value={values.labor_rate}
              onChange={(event) => onChange('labor_rate', event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(fieldErrors.labor_rate)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Utility cost"
            error={fieldErrors.utility_cost}
            helper="Enter the utility spend in USD. Use 0 if none."
          >
            <input
              name="utility_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.utility_cost}
              onChange={(event) => onChange('utility_cost', event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(fieldErrors.utility_cost)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Other cost"
            error={fieldErrors.other_cost}
            helper={`Equipment, overhead, or miscellaneous costs not captured above. ${getTotalTrackedCostHelper(values)}`}
            className="md:col-span-2"
          >
            <input
              name="other_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.other_cost}
              onChange={(event) => onChange('other_cost', event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(fieldErrors.other_cost)}
              className={inputClass}
            />
          </FieldShell>
        </div>
      </FormSection>

      <FormSection
        title="Notes"
        description="Optional operator notes, observations, or context for this run."
      >
        <FieldShell label="Notes" helper="Use this for batch details, anomalies, or follow-up context.">
          <textarea
            name="notes"
            rows={5}
            value={values.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            placeholder="Add any useful context for this run."
            className={`${inputClass} resize-y`}
          />
        </FieldShell>
      </FormSection>

      {shouldShowValidationSummary && validationMessages.length > 0 ? (
        <StatusBanner tone="error">
          <p className="font-medium">Please correct the highlighted fields.</p>
          <ul className="mt-2 list-disc pl-5">
            {validationMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </StatusBanner>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="w-full text-sm sm:max-w-xl">
          {state.error && Object.keys(state.fieldErrors).length === 0 ? (
            <StatusBanner tone="error">{state.error}</StatusBanner>
          ) : null}
          {state.success ? <StatusBanner tone="success">{state.success}</StatusBanner> : null}
        </div>

        <div className="flex justify-end">
          <SubmitButton label={submitLabel} />
        </div>
      </div>
    </fieldset>
  )
}

export function RunEntryForm({
  mode = 'create',
  title = 'New run',
  description = 'Enter the basics for this extraction run.',
  submitLabel = 'Save run',
  successRedirectTo,
  initialValues,
  runId,
}: RunEntryFormProps = {}) {
  const action = mode === 'edit' ? updateRunAction : createRunAction
  const [state, formAction] = useActionState(action, initialState)
  const [values, setValues] = useState<RunFormValues>(() => mergeInitialValues(initialValues))
  const [clientFieldErrors, setClientFieldErrors] = useState<RunFormFieldErrors>({})
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const hasServerFieldErrors = Object.keys(state.fieldErrors).length > 0
  const fieldErrors = showValidationSummary ? clientFieldErrors : state.fieldErrors
  const shouldShowValidationSummary = showValidationSummary || hasServerFieldErrors

  function handleChange(field: keyof RunFormValues, value: string) {
    setValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value }

      if (shouldShowValidationSummary) {
        setShowValidationSummary(true)
        setClientFieldErrors(validateForm(nextValues))
      }

      return nextValues
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validateForm(values)

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
      setClientFieldErrors(nextErrors)
      setShowValidationSummary(true)
      return
    }

    setClientFieldErrors({})
    setShowValidationSummary(false)
  }

  const validationMessages = Array.from(new Set(Object.values(fieldErrors)))

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={`${dashboardSurfaceClass} flex w-full flex-col gap-6 p-6 sm:p-8`}
    >
      {mode === 'edit' && runId ? <input type="hidden" name="run_id" value={runId} /> : null}
      {successRedirectTo ? <input type="hidden" name="success_redirect_to" value={successRedirectTo} /> : null}
      <datalist id="output-type-suggestions">
        {outputTypeSuggestions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <RunEntryFormBody
        title={title}
        description={description}
        values={values}
        fieldErrors={fieldErrors}
        shouldShowValidationSummary={shouldShowValidationSummary}
        validationMessages={validationMessages}
        state={state}
        submitLabel={submitLabel}
        onChange={handleChange}
      />
    </form>
  )
}
