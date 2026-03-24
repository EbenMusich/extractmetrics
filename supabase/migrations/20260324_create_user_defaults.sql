create table public.user_defaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  default_operator_name text,
  default_solvent_type text,
  default_input_material_type text,
  default_output_type text,
  default_labor_rate numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_defaults_user_id_key unique (user_id),
  constraint user_defaults_default_labor_rate_check
    check (default_labor_rate is null or default_labor_rate >= 0)
);

create or replace function public.set_user_defaults_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_defaults_updated_at
before update on public.user_defaults
for each row
execute function public.set_user_defaults_updated_at();

alter table public.user_defaults enable row level security;

create policy "user_defaults_select_own"
on public.user_defaults
for select
to authenticated
using (auth.uid() = user_id);

create policy "user_defaults_insert_own"
on public.user_defaults
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_defaults_update_own"
on public.user_defaults
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_defaults_delete_own"
on public.user_defaults
for delete
to authenticated
using (auth.uid() = user_id);
