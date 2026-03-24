import { requireUser } from '@/lib/auth/require-user'
import { createClient } from '@/lib/supabase/server'

type UserDefaultsRow = {
  id: string
  user_id: string
  default_operator_name: string | null
  default_solvent_type: string | null
  default_input_material_type: string | null
  default_output_type: string | null
  default_labor_rate: number | null
  created_at: string
  updated_at: string
}

export type SavedDefaults = {
  operatorName: string | null
  solventType: string | null
  inputMaterialType: string | null
  outputType: string | null
  laborRate: number | null
}

export type SavedDefaultsInput = SavedDefaults

const savedDefaultsSelect =
  'id, user_id, default_operator_name, default_solvent_type, default_input_material_type, default_output_type, default_labor_rate, created_at, updated_at'

function normalizeOptionalText(value: string | null) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : null
}

function normalizeLaborRate(value: number | null) {
  if (value === null) {
    return null
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Default labor rate must be 0 or greater.')
  }

  return value
}

function mapRowToSavedDefaults(row: UserDefaultsRow): SavedDefaults {
  return {
    operatorName: row.default_operator_name,
    solventType: row.default_solvent_type,
    inputMaterialType: row.default_input_material_type,
    outputType: row.default_output_type,
    laborRate: row.default_labor_rate,
  }
}

export function normalizeSavedDefaultsInput(input: SavedDefaultsInput): SavedDefaults {
  return {
    operatorName: normalizeOptionalText(input.operatorName),
    solventType: normalizeOptionalText(input.solventType),
    inputMaterialType: normalizeOptionalText(input.inputMaterialType),
    outputType: normalizeOptionalText(input.outputType),
    laborRate: normalizeLaborRate(input.laborRate),
  }
}

export async function getCurrentUserDefaults(): Promise<SavedDefaults | null> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_defaults')
    .select(savedDefaultsSelect)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load saved defaults: ${error.message}`)
  }

  return data ? mapRowToSavedDefaults(data as UserDefaultsRow) : null
}
