create table if not exists public.monthly_budgets (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    budget_month date not null,

    amount numeric(15,2) not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint monthly_budgets_month_first_day
        check (extract(day from budget_month) = 1),

    constraint monthly_budgets_amount_positive
        check (amount > 0),

    constraint monthly_budgets_user_month_unique
        unique (user_id, budget_month)
);

create or replace function public.set_monthly_budget_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger monthly_budgets_updated_at
before update on public.monthly_budgets
for each row
execute function public.set_monthly_budget_updated_at();

alter table public.monthly_budgets enable row level security;

create policy "Users can view own monthly budgets"
on public.monthly_budgets
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own monthly budgets"
on public.monthly_budgets
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own monthly budgets"
on public.monthly_budgets
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own monthly budgets"
on public.monthly_budgets
for delete
to authenticated
using ((select auth.uid()) = user_id);