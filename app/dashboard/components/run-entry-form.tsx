'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createRunAction, type CreateRunFormState } from '@/app/dashboard/actions'

const initialState: CreateRunFormState = {
  error: null,
  success: null,
  resetKey: 0,
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
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [router, state.resetKey, state.success])

  return (
    <form
      key={state.resetKey}
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-4 rounded-xl border bg-white p-6"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">New run</h2>
        <p className="text-sm text-gray-600">Enter the basics for this extraction run.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Run date</span>
          <input name="run_date" type="date" required className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Output type</span>
          <input name="output_type" type="text" required className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Strain</span>
          <input name="strain_name" type="text" required className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Grower</span>
          <input name="grower_name" type="text" required className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Biomass input (g)</span>
          <input
            name="biomass_input_g"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Output (g)</span>
          <input
            name="output_weight_g"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Material cost</span>
          <input
            name="material_cost"
            type="number"
            step="0.01"
            min="0"
            required
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Utility cost</span>
          <input
            name="utility_cost"
            type="number"
            step="0.01"
            min="0"
            required
            className="rounded border p-2"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm font-medium">Other cost</span>
          <input
            name="other_cost"
            type="number"
            step="0.01"
            min="0"
            required
            className="rounded border p-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Notes</span>
        <textarea name="notes" rows={4} className="rounded border p-2" />
      </label>

      <div className="flex items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm">
          {state.error ? <p className="text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-green-700">{state.success}</p> : null}
        </div>
        <SubmitButton />
      </div>
    </form>
  )
}
