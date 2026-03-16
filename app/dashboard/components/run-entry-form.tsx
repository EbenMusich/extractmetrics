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
  errorTextClass,
  helperTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from './dashboard-ui'

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
    labor_minutes: '0',
    labor_rate: '0',
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
  const biomassInput = Number(values.biomass_input_g)
  const outputWeight = Number(values.output_weight_g)
  const solventUsed = Number(values.solvent_used_g)
  const laborMinutes = Number(values.labor_minutes)
  const laborRate = Number(values.labor_rate)
  const materialCost = Number(values.material_cost)
  const utilityCost = Number(values.utility_cost)
  const otherCost = Number(values.other_cost)

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
  } else if (!Number.isFinite(biomassInput) || biomassInput <= 0) {
    errors.biomass_input_g = 'Biomass input must be greater than 0.'
  }

  if (!values.output_weight_g.trim()) {
    errors.output_weight_g = 'Output weight is required.'
  } else if (!Number.isFinite(outputWeight) || outputWeight <= 0) {
    errors.output_weight_g = 'Output weight must be greater than 0.'
  }

  if (values.solvent_used_g.trim() && (!Number.isFinite(solventUsed) || solventUsed < 0)) {
    errors.solvent_used_g = 'Solvent used must be 0 or greater.'
  }

  if (!values.labor_minutes.trim()) {
    errors.labor_minutes = 'Labor minutes is required.'
  } else if (!Number.isFinite(laborMinutes) || laborMinutes < 0) {
    errors.labor_minutes = 'Labor minutes must be 0 or greater.'
  }

  if (!values.labor_rate.trim()) {
    errors.labor_rate = 'Labor rate is required.'
  } else if (!Number.isFinite(laborRate) || laborRate < 0) {
    errors.labor_rate = 'Labor rate must be 0 or greater.'
  }

  if (!values.material_cost.trim()) {
    errors.material_cost = 'Material cost is required.'
  } else if (!Number.isFinite(materialCost) || materialCost < 0) {
    errors.material_cost = 'Material cost must be 0 or greater.'
  }

  if (!values.utility_cost.trim()) {
    errors.utility_cost = 'Utility cost is required.'
  } else if (!Number.isFinite(utilityCost) || utilityCost < 0) {
    errors.utility_cost = 'Utility cost must be 0 or greater.'
  }

  if (!values.other_cost.trim()) {
    errors.other_cost = 'Other cost is required.'
  } else if (!Number.isFinite(otherCost) || otherCost < 0) {
    errors.other_cost = 'Other cost must be 0 or greater.'
  }

  return errors
}

function getOutputWeightWarning(values: RunFormValues) {
  const biomassInput = Number(values.biomass_input_g)
  const outputWeight = Number(values.output_weight_g)

  if (
    values.biomass_input_g.trim() &&
    values.output_weight_g.trim() &&
    Number.isFinite(biomassInput) &&
    Number.isFinite(outputWeight) &&
    biomassInput > 0 &&
    outputWeight > biomassInput
  ) {
    return 'Output weight is higher than biomass input. Please double-check those values.'
  }

  return null
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
  className,
  children,
}: {
  label: string
  error?: string
  helper?: string | null
  className?: string
  children: ReactNode
}) {
  return (
    <label className={joinClasses('flex flex-col gap-2', className)}>
      <span className={labelClass}>{label}</span>
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
  const outputWeightWarning = getOutputWeightWarning(values)
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

      <div className="space-y-2.5">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[1.75rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
      </div>

      <FormSection
        title="Run details"
        description="Capture the identifying details for this extraction run."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell label="Run date" error={fieldErrors.run_date}>
            <input
              name="run_date"
              type="date"
              value={values.run_date}
              onChange={(event) => handleChange('run_date', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.run_date)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Output type" error={fieldErrors.output_type}>
            <input
              name="output_type"
              type="text"
              value={values.output_type}
              onChange={(event) => handleChange('output_type', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.output_type)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Strain" error={fieldErrors.strain_name}>
            <input
              name="strain_name"
              type="text"
              value={values.strain_name}
              onChange={(event) => handleChange('strain_name', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.strain_name)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Grower" error={fieldErrors.grower_name}>
            <input
              name="grower_name"
              type="text"
              value={values.grower_name}
              onChange={(event) => handleChange('grower_name', event.target.value)}
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
          <FieldShell label="Biomass input (g)" error={fieldErrors.biomass_input_g}>
            <input
              name="biomass_input_g"
              type="number"
              step="0.01"
              min="0.01"
              value={values.biomass_input_g}
              onChange={(event) => handleChange('biomass_input_g', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.biomass_input_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Output Weight (g)"
            error={fieldErrors.output_weight_g}
            helper={outputWeightWarning}
          >
            <input
              name="output_weight_g"
              type="number"
              step="0.01"
              min="0.01"
              value={values.output_weight_g}
              onChange={(event) => handleChange('output_weight_g', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.output_weight_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell
            label="Solvent Used (g)"
            error={fieldErrors.solvent_used_g}
            helper="Optional. Leave blank if this run did not track solvent use."
          >
            <input
              name="solvent_used_g"
              type="number"
              step="0.01"
              min="0"
              value={values.solvent_used_g}
              onChange={(event) => handleChange('solvent_used_g', event.target.value)}
              aria-invalid={Boolean(fieldErrors.solvent_used_g)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Material cost" error={fieldErrors.material_cost}>
            <input
              name="material_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.material_cost}
              onChange={(event) => handleChange('material_cost', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.material_cost)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Labor minutes" error={fieldErrors.labor_minutes}>
            <input
              name="labor_minutes"
              type="number"
              step="1"
              min="0"
              value={values.labor_minutes}
              onChange={(event) => handleChange('labor_minutes', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.labor_minutes)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Labor rate ($/hr)" error={fieldErrors.labor_rate}>
            <input
              name="labor_rate"
              type="number"
              step="0.01"
              min="0"
              value={values.labor_rate}
              onChange={(event) => handleChange('labor_rate', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.labor_rate)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Utility cost" error={fieldErrors.utility_cost}>
            <input
              name="utility_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.utility_cost}
              onChange={(event) => handleChange('utility_cost', event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.utility_cost)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell label="Other cost" error={fieldErrors.other_cost} className="md:col-span-2">
            <input
              name="other_cost"
              type="number"
              step="0.01"
              min="0"
              value={values.other_cost}
              onChange={(event) => handleChange('other_cost', event.target.value)}
              required
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
        <FieldShell label="Notes">
          <textarea
            name="notes"
            rows={5}
            value={values.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </FieldShell>
      </FormSection>

      {shouldShowValidationSummary && validationMessages.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Please correct the highlighted fields.</p>
          <ul className="mt-2 list-disc pl-5">
            {validationMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="text-sm">
          {state.error && Object.keys(state.fieldErrors).length === 0 ? (
            <p className="text-red-600">{state.error}</p>
          ) : null}
          {state.success ? <p className="text-green-700">{state.success}</p> : null}
        </div>

        <div className="flex justify-end">
          <SubmitButton label={submitLabel} />
        </div>
      </div>
    </form>
  )
}
