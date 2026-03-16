alter table public.runs
  add column if not exists solvent_used_g numeric;
