'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CreateRunFormState = {
  error: string | null
  success: string | null
  resetKey: number
}

const defaultState: CreateRunFormState = {
  error: null,
  success: null,
  resetKey: 0,
}

function readText(formData: FormData, field: string) {
  return formData.get(field)?.toString().trim() ?? ''
}

function readPositiveNumber(formData: FormData, field: string, label: string) {
  const value = Number(formData.get(field))

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than 0.`)
  }

  return value
}

function readNonNegativeNumber(formData: FormData, field: string, label: string) {
  const value = Number(formData.get(field))

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be 0 or greater.`)
  }

  return value
}

export async function createRunAction(
  previousState: CreateRunFormState = defaultState,
  formData: FormData
): Promise<CreateRunFormState> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      error: authError?.message ?? 'You must be logged in to create a run.',
      success: null,
      resetKey: previousState.resetKey,
    }
  }

  try {
    const runDate = readText(formData, 'run_date')
    const strainName = readText(formData, 'strain_name')
    const growerName = readText(formData, 'grower_name')
    const outputType = readText(formData, 'output_type')
    const notes = readText(formData, 'notes')

    if (!runDate || !strainName || !growerName || !outputType) {
      return {
        error: 'Run date, strain, grower, and output type are required.',
        success: null,
        resetKey: previousState.resetKey,
      }
    }

    const biomassInputG = readPositiveNumber(formData, 'biomass_input_g', 'Biomass input')
    const outputWeightG = readPositiveNumber(formData, 'output_weight_g', 'Output weight')
    const materialCost = readNonNegativeNumber(formData, 'material_cost', 'Material cost')
    const utilityCost = readNonNegativeNumber(formData, 'utility_cost', 'Utility cost')
    const otherCost = readNonNegativeNumber(formData, 'other_cost', 'Other cost')

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
      }
    }

    revalidatePath('/dashboard')

    return {
      error: null,
      success: 'Run saved successfully.',
      resetKey: previousState.resetKey + 1,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to save run.',
      success: null,
      resetKey: previousState.resetKey,
    }
  }
}
