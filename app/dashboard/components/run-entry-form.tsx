'use client'

import { useActionState, useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createRunAction, type CreateRunFormState } from '@/app/dashboard/actions'

const initialState: CreateRunFormState = {
  error: null,
  success: null,
  resetKey: 0,
  fieldErrors: {},
}

type RunFormValues = {
  run_date: string
  output_type: string
  strain_name: string
  grower_name: string
  biomass_input_g: string
  output_weight_g: string
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
    material_cost: '',
    utility_cost: '',
    other_cost: '',
    notes: '',
  }
}

function validateForm(values: RunFormValues): RunFormFieldErrors {
  const errors: RunFormFieldErrors = {}
  const biomassInput = Number(values.biomass_input_g)
  const outputWeight = Number(values.output_weight_g)
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

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="text-sm text-red-600">{message}</p>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save run'}
    </button>
  )
}

export function RunEntryForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createRunAction, initialState)
  const [values, setValues] = useState<RunFormValues>(() => createInitialValues())
  const [fieldErrors, setFieldErrors] = useState<RunFormFieldErrors>({})
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const outputWeightWarning = getOutputWeightWarning(values)

  useEffect(() => {
    if (state.success) {
      setValues(createInitialValues())
      setFieldErrors({})
      setShowValidationSummary(false)
      router.refresh()
    }
  }, [router, state.resetKey, state.success])

  useEffect(() => {
    if (Object.keys(state.fieldErrors).length > 0) {
      setFieldErrors(state.fieldErrors)
      setShowValidationSummary(true)
    }
  }, [state.fieldErrors])

  function handleChange(field: keyof RunFormValues, value: string) {
    setValues((currentValues) => {
      const nextValues = { ...currentValues, [field]: value }

      if (showValidationSummary || Object.keys(fieldErrors).length > 0) {
        setFieldErrors(validateForm(nextValues))
      }

      return nextValues
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validateForm(values)

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
      setFieldErrors(nextErrors)
      setShowValidationSummary(true)
      return
    }

    setFieldErrors({})
    setShowValidationSummary(false)
  }

  const validationMessages = Array.from(new Set(Object.values(fieldErrors)))

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-xl border bg-white p-6"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">New run</h2>
        <p className="text-sm text-gray-600">Enter the basics for this extraction run.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Run date</span>
          <input
            name="run_date"
            type="date"
            value={values.run_date}
            onChange={(event) => handleChange('run_date', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.run_date)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.run_date} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Output type</span>
          <input
            name="output_type"
            type="text"
            value={values.output_type}
            onChange={(event) => handleChange('output_type', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.output_type)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.output_type} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Strain</span>
          <input
            name="strain_name"
            type="text"
            value={values.strain_name}
            onChange={(event) => handleChange('strain_name', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.strain_name)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.strain_name} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Grower</span>
          <input
            name="grower_name"
            type="text"
            value={values.grower_name}
            onChange={(event) => handleChange('grower_name', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.grower_name)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.grower_name} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Biomass input (g)</span>
          <input
            name="biomass_input_g"
            type="number"
            step="0.01"
            min="0.01"
            value={values.biomass_input_g}
            onChange={(event) => handleChange('biomass_input_g', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.biomass_input_g)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.biomass_input_g} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Output (g)</span>
          <input
            name="output_weight_g"
            type="number"
            step="0.01"
            min="0.01"
            value={values.output_weight_g}
            onChange={(event) => handleChange('output_weight_g', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.output_weight_g)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.output_weight_g} />
          {outputWeightWarning ? <p className="text-sm text-amber-700">{outputWeightWarning}</p> : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Material cost</span>
          <input
            name="material_cost"
            type="number"
            step="0.01"
            min="0"
            value={values.material_cost}
            onChange={(event) => handleChange('material_cost', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.material_cost)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.material_cost} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Utility cost</span>
          <input
            name="utility_cost"
            type="number"
            step="0.01"
            min="0"
            value={values.utility_cost}
            onChange={(event) => handleChange('utility_cost', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.utility_cost)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.utility_cost} />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm font-medium">Other cost</span>
          <input
            name="other_cost"
            type="number"
            step="0.01"
            min="0"
            value={values.other_cost}
            onChange={(event) => handleChange('other_cost', event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.other_cost)}
            className="rounded border p-2"
          />
          <FieldError message={fieldErrors.other_cost} />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          name="notes"
          rows={4}
          value={values.notes}
          onChange={(event) => handleChange('notes', event.target.value)}
          className="rounded border p-2"
        />
      </label>

      {showValidationSummary && validationMessages.length > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">Please correct the highlighted fields.</p>
          <ul className="mt-2 list-disc pl-5">
            {validationMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm">
          {state.error && Object.keys(state.fieldErrors).length === 0 ? (
            <p className="text-red-600">{state.error}</p>
          ) : null}
          {state.success ? <p className="text-green-700">{state.success}</p> : null}
        </div>
        <SubmitButton />
      </div>
    </form>
  )
}
