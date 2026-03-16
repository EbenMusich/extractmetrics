'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { coerceFiniteNumber, toSafeNumber } from './components/safe-number'

export type CreateRunFormState = {
  error: string | null
  success: string | null
  resetKey: number
  fieldErrors: Partial<
    Record<
      | 'run_date'
      | 'output_type'
      | 'strain_name'
      | 'grower_name'
      | 'biomass_input_g'
      | 'output_weight_g'
      | 'solvent_used_g'
      | 'labor_minutes'
      | 'labor_rate'
      | 'material_cost'
      | 'utility_cost'
      | 'other_cost',
      string
    >
  >
}

const defaultState: CreateRunFormState = {
  error: null,
  success: null,
  resetKey: 0,
  fieldErrors: {},
}

type RunFormValues = {
  runDate: string
  outputType: string
  strainName: string
  growerName: string
  biomassInputG: number | null
  outputWeightG: number | null
  solventUsedG: number | null
  laborMinutes: number | null
  laborRate: number | null
  laborCost: number
  materialCost: number | null
  utilityCost: number | null
  otherCost: number | null
  notes: string
}

function readText(formData: FormData, field: string) {
  return formData.get(field)?.toString().trim() ?? ''
}

function readNumber(formData: FormData, field: string) {
  const rawValue = readText(formData, field)

  if (!rawValue) {
    return null
  }

  return coerceFiniteNumber(rawValue) ?? Number.NaN
}

function readRedirectTarget(formData: FormData) {
  const redirectTo = readText(formData, 'success_redirect_to')
  return redirectTo || null
}

function readRunId(formData: FormData) {
  const runId = readText(formData, 'run_id')
  return runId || null
}

function appendQueryFlag(path: string, key: string) {
  const [pathname, search = ''] = path.split('?')
  const params = new URLSearchParams(search)
  params.set(key, '1')
  const queryString = params.toString()

  return queryString ? `${pathname}?${queryString}` : pathname
}

function calculateLaborCost(laborMinutes: number, laborRate: number) {
  return toSafeNumber((laborMinutes / 60) * laborRate)
}

function createFieldErrorState(
  previousState: CreateRunFormState,
  fieldErrors: CreateRunFormState['fieldErrors']
): CreateRunFormState {
  return {
    error: 'Please correct the highlighted fields.',
    success: null,
    resetKey: previousState.resetKey,
    fieldErrors,
  }
}

function createErrorState(
  previousState: CreateRunFormState,
  error: string
): CreateRunFormState {
  return {
    error,
    success: null,
    resetKey: previousState.resetKey,
    fieldErrors: {},
  }
}

function validateRunForm(formData: FormData) {
  const values: RunFormValues = {
    runDate: readText(formData, 'run_date'),
    strainName: readText(formData, 'strain_name'),
    growerName: readText(formData, 'grower_name'),
    outputType: readText(formData, 'output_type'),
    notes: readText(formData, 'notes'),
    biomassInputG: readNumber(formData, 'biomass_input_g'),
    outputWeightG: readNumber(formData, 'output_weight_g'),
    solventUsedG: readNumber(formData, 'solvent_used_g'),
    laborMinutes: readNumber(formData, 'labor_minutes'),
    laborRate: readNumber(formData, 'labor_rate'),
    laborCost: 0,
    materialCost: readNumber(formData, 'material_cost'),
    utilityCost: readNumber(formData, 'utility_cost'),
    otherCost: readNumber(formData, 'other_cost'),
  }

  const fieldErrors: CreateRunFormState['fieldErrors'] = {}

  if (!values.runDate) {
    fieldErrors.run_date = 'Run date is required.'
  }
  if (!values.outputType) {
    fieldErrors.output_type = 'Output type is required.'
  }
  if (!values.strainName) {
    fieldErrors.strain_name = 'Strain name is required.'
  }
  if (!values.growerName) {
    fieldErrors.grower_name = 'Grower name is required.'
  }

  if (values.biomassInputG === null) {
    fieldErrors.biomass_input_g = 'Biomass input is required.'
  } else if (!Number.isFinite(values.biomassInputG) || values.biomassInputG <= 0) {
    fieldErrors.biomass_input_g = 'Biomass input must be greater than 0.'
  }

  if (values.outputWeightG === null) {
    fieldErrors.output_weight_g = 'Output weight is required.'
  } else if (!Number.isFinite(values.outputWeightG) || values.outputWeightG <= 0) {
    fieldErrors.output_weight_g = 'Output weight must be greater than 0.'
  }

  if (
    values.solventUsedG !== null &&
    (!Number.isFinite(values.solventUsedG) || values.solventUsedG < 0)
  ) {
    fieldErrors.solvent_used_g = 'Solvent used must be 0 or greater.'
  }

  if (values.laborMinutes === null) {
    fieldErrors.labor_minutes = 'Labor minutes is required.'
  } else if (!Number.isFinite(values.laborMinutes) || values.laborMinutes < 0) {
    fieldErrors.labor_minutes = 'Labor minutes must be 0 or greater.'
  }

  if (values.laborRate === null) {
    fieldErrors.labor_rate = 'Labor rate is required.'
  } else if (!Number.isFinite(values.laborRate) || values.laborRate < 0) {
    fieldErrors.labor_rate = 'Labor rate must be 0 or greater.'
  }

  if (values.materialCost === null) {
    fieldErrors.material_cost = 'Material cost is required.'
  } else if (!Number.isFinite(values.materialCost) || values.materialCost < 0) {
    fieldErrors.material_cost = 'Material cost must be 0 or greater.'
  }

  if (values.utilityCost === null) {
    fieldErrors.utility_cost = 'Utility cost is required.'
  } else if (!Number.isFinite(values.utilityCost) || values.utilityCost < 0) {
    fieldErrors.utility_cost = 'Utility cost must be 0 or greater.'
  }

  if (values.otherCost === null) {
    fieldErrors.other_cost = 'Other cost is required.'
  } else if (!Number.isFinite(values.otherCost) || values.otherCost < 0) {
    fieldErrors.other_cost = 'Other cost must be 0 or greater.'
  }

  if (
    Object.keys(fieldErrors).length === 0 &&
    values.laborMinutes !== null &&
    values.laborRate !== null
  ) {
    values.laborCost = calculateLaborCost(values.laborMinutes, values.laborRate)
  }

  return { values, fieldErrors }
}

function buildRunPayload(userId: string, values: RunFormValues) {
  return {
    user_id: userId,
    run_date: values.runDate,
    strain_name: values.strainName,
    grower_name: values.growerName,
    biomass_input_g: values.biomassInputG ?? 0,
    output_weight_g: values.outputWeightG ?? 0,
    solvent_used_g: values.solventUsedG ?? 0,
    labor_minutes: values.laborMinutes ?? 0,
    labor_rate: values.laborRate ?? 0,
    labor_cost: toSafeNumber(values.laborCost),
    material_cost: values.materialCost ?? 0,
    utility_cost: values.utilityCost ?? 0,
    other_cost: values.otherCost ?? 0,
    output_type: values.outputType,
    notes: values.notes || null,
  }
}

function revalidateRunPages() {
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/runs')
}

export async function createRunAction(
  previousState: CreateRunFormState = defaultState,
  formData: FormData
): Promise<CreateRunFormState> {
  const supabase = await createClient()
  const successRedirectTo = readRedirectTarget(formData)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return createErrorState(
      previousState,
      authError?.message ?? 'You must be logged in to create a run.'
    )
  }

  const { values, fieldErrors } = validateRunForm(formData)

  if (Object.keys(fieldErrors).length > 0) {
    return createFieldErrorState(previousState, fieldErrors)
  }

  try {
    const { error } = await supabase.from('runs').insert(buildRunPayload(user.id, values))

    if (error) {
      return createErrorState(previousState, error.message)
    }

    revalidateRunPages()
  } catch (error) {
    return createErrorState(
      previousState,
      error instanceof Error ? error.message : 'Unable to save run.'
    )
  }

  if (successRedirectTo) {
    redirect(appendQueryFlag(successRedirectTo, 'created'))
  }

  return {
    error: null,
    success: 'Run saved successfully.',
    resetKey: previousState.resetKey + 1,
    fieldErrors: {},
  }
}

export async function updateRunAction(
  previousState: CreateRunFormState = defaultState,
  formData: FormData
): Promise<CreateRunFormState> {
  const supabase = await createClient()
  const runId = readRunId(formData)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return createErrorState(
      previousState,
      authError?.message ?? 'You must be logged in to update a run.'
    )
  }

  if (!runId) {
    return createErrorState(previousState, 'Run not found.')
  }

  const { values, fieldErrors } = validateRunForm(formData)

  if (Object.keys(fieldErrors).length > 0) {
    return createFieldErrorState(previousState, fieldErrors)
  }

  try {
    const { data, error } = await supabase
      .from('runs')
      .update(buildRunPayload(user.id, values))
      .eq('id', runId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      return createErrorState(previousState, error.message)
    }

    if (!data) {
      return createErrorState(previousState, 'Run not found.')
    }

    revalidateRunPages()
  } catch (error) {
    return createErrorState(
      previousState,
      error instanceof Error ? error.message : 'Unable to update run.'
    )
  }

  redirect(appendQueryFlag('/dashboard/runs', 'updated'))
}

export async function deleteRunAction(formData: FormData) {
  const supabase = await createClient()
  const runId = readRunId(formData)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  if (!runId) {
    redirect('/dashboard/runs')
  }

  const { data: deletedRun, error } = await supabase
    .from('runs')
    .delete()
    .eq('id', runId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to delete run: ${error.message}`)
  }

  if (!deletedRun) {
    redirect('/dashboard/runs')
  }

  revalidateRunPages()
  redirect(appendQueryFlag('/dashboard/runs', 'deleted'))
}
