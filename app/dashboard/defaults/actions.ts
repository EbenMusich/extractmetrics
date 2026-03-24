'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/require-user'
import {
  normalizeSavedDefaultsInput,
  type SavedDefaults,
  type SavedDefaultsInput,
} from '@/lib/user-defaults'

export type SavedDefaultsActionState = {
  error: string | null
  success: string | null
}

const defaultSavedDefaultsActionState: SavedDefaultsActionState = {
  error: null,
  success: null,
}

function buildUserDefaultsPayload(userId: string, defaults: SavedDefaults) {
  return {
    user_id: userId,
    default_operator_name: defaults.operatorName,
    default_solvent_type: defaults.solventType,
    default_input_material_type: defaults.inputMaterialType,
    default_output_type: defaults.outputType,
    default_labor_rate: defaults.laborRate,
  }
}

export async function saveCurrentUserDefaultsAction(
  input: SavedDefaultsInput
): Promise<SavedDefaultsActionState> {
  const user = await requireUser()
  const supabase = await createClient()

  try {
    const normalizedDefaults = normalizeSavedDefaultsInput(input)
    const { error } = await supabase
      .from('user_defaults')
      .upsert(buildUserDefaultsPayload(user.id, normalizedDefaults), {
        onConflict: 'user_id',
      })

    if (error) {
      return {
        error: error.message,
        success: null,
      }
    }

    return {
      error: null,
      success: 'Saved defaults updated successfully.',
    }
  } catch (error) {
    return {
      ...defaultSavedDefaultsActionState,
      error: error instanceof Error ? error.message : 'Unable to save defaults.',
    }
  }
}

export async function clearCurrentUserDefaultsAction(): Promise<SavedDefaultsActionState> {
  const user = await requireUser()
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('user_defaults').delete().eq('user_id', user.id)

    if (error) {
      return {
        error: error.message,
        success: null,
      }
    }

    return {
      error: null,
      success: 'Saved defaults cleared successfully.',
    }
  } catch (error) {
    return {
      ...defaultSavedDefaultsActionState,
      error: error instanceof Error ? error.message : 'Unable to clear defaults.',
    }
  }
}
