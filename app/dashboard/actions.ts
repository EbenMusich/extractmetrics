'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

function readText(formData: FormData, field: string) {
  return formData.get(field)?.toString().trim() ?? ''
}

function readNumber(formData: FormData, field: string) {
  const rawValue = readText(formData, field)

  if (!rawValue) {
    return null
  }

  const value = Number(rawValue)
  return Number.isFinite(value) ? value : Number.NaN
}

function readRedirectTarget(formData: FormData) {
  const redirectTo = readText(formData, 'success_redirect_to')
  return redirectTo || null
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
    return {
      error: authError?.message ?? 'You must be logged in to create a run.',
      success: null,
      resetKey: previousState.resetKey,
      fieldErrors: {},
    }
  }

  try {
    const runDate = readText(formData, 'run_date')
    const strainName = readText(formData, 'strain_name')
    const growerName = readText(formData, 'grower_name')
    const outputType = readText(formData, 'output_type')
    const notes = readText(formData, 'notes')
    const fieldErrors: CreateRunFormState['fieldErrors'] = {}

    if (!runDate) {
      fieldErrors.run_date = 'Run date is required.'
    }
    if (!outputType) {
      fieldErrors.output_type = 'Output type is required.'
    }
    if (!strainName) {
      fieldErrors.strain_name = 'Strain name is required.'
    }
    if (!growerName) {
      fieldErrors.grower_name = 'Grower name is required.'
    }

    const biomassInputG = readNumber(formData, 'biomass_input_g')
    const outputWeightG = readNumber(formData, 'output_weight_g')
    const materialCost = readNumber(formData, 'material_cost')
    const utilityCost = readNumber(formData, 'utility_cost')
    const otherCost = readNumber(formData, 'other_cost')

    if (biomassInputG === null) {
      fieldErrors.biomass_input_g = 'Biomass input is required.'
    } else if (!Number.isFinite(biomassInputG) || biomassInputG <= 0) {
      fieldErrors.biomass_input_g = 'Biomass input must be greater than 0.'
    }

    if (outputWeightG === null) {
      fieldErrors.output_weight_g = 'Output weight is required.'
    } else if (!Number.isFinite(outputWeightG) || outputWeightG <= 0) {
      fieldErrors.output_weight_g = 'Output weight must be greater than 0.'
    }

    if (materialCost === null) {
      fieldErrors.material_cost = 'Material cost is required.'
    } else if (!Number.isFinite(materialCost) || materialCost < 0) {
      fieldErrors.material_cost = 'Material cost must be 0 or greater.'
    }

    if (utilityCost === null) {
      fieldErrors.utility_cost = 'Utility cost is required.'
    } else if (!Number.isFinite(utilityCost) || utilityCost < 0) {
      fieldErrors.utility_cost = 'Utility cost must be 0 or greater.'
    }

    if (otherCost === null) {
      fieldErrors.other_cost = 'Other cost is required.'
    } else if (!Number.isFinite(otherCost) || otherCost < 0) {
      fieldErrors.other_cost = 'Other cost must be 0 or greater.'
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        error: 'Please correct the highlighted fields.',
        success: null,
        resetKey: previousState.resetKey,
        fieldErrors,
      }
    }

    const { error } = await supabase.from('runs').insert({
      user_id: user.id,
      run_date: runDate,
      strain_name: strainName,
      grower_name: growerName,
      biomass_input_g: biomassInputG,
      output_weight_g: outputWeightG,
      material_cost: materialCost,
      utility_cost: utilityCost,
      other_cost: otherCost,
      output_type: outputType,
      notes: notes || null,
    })

    if (error) {
      return {
        error: error.message,
        success: null,
        resetKey: previousState.resetKey,
        fieldErrors: {},
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/runs')

    if (successRedirectTo) {
      redirect(successRedirectTo)
    }

    return {
      error: null,
      success: 'Run saved successfully.',
      resetKey: previousState.resetKey + 1,
      fieldErrors: {},
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to save run.',
      success: null,
      resetKey: previousState.resetKey,
      fieldErrors: {},
    }
  }
}
