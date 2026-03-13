alter table public.runs
  add column if not exists labor_minutes numeric,
  add column if not exists labor_rate numeric;
