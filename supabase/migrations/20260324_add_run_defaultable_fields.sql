alter table public.runs
  add column if not exists operator_name text,
  add column if not exists solvent_type text,
  add column if not exists input_material_type text;
