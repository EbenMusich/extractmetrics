alter table public.runs
  add column if not exists cost_per_lb numeric;
