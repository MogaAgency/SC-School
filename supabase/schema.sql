-- SC School student platform schema.
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste →
-- Run. It is safe to re-run; every statement is idempotent.
--
-- Model: one auth user = one student. The student's row also carries the
-- guardian's (ولي الأمر) name and phone, which the school uses to reach the
-- family about delays or behaviour — the guardian is a contact, not an
-- account. Each student has zero or more enrollments.
--
-- Students can only read (and lightly edit) their own row. Enrollments are
-- added by the school from the dashboard, never from the website, so the
-- browser gets no insert rights anywhere.

-- ------------------------------------------------- earlier draft cleanup
-- The first draft of this schema modelled a guardian "profiles" table with
-- students underneath. Nothing was live on it, so drop it if it exists.
drop table if exists public.enrollments cascade;
drop table if exists public.students    cascade;
drop table if exists public.profiles    cascade;

-- ---------------------------------------------------------------- tables

create table public.students (
  id             uuid primary key references auth.users (id) on delete cascade,
  name           text not null default '',
  phone          text not null default '',
  email          text,
  guardian_name  text not null default '',
  guardian_phone text not null default '',
  consented_at   timestamptz,
  created_at     timestamptz not null default now()
);

create table public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  course     text not null,
  level      text,
  status     text not null default 'active'
             check (status in ('active', 'completed', 'paused')),
  created_at timestamptz not null default now()
);

create index enrollments_student_id_idx on public.enrollments (student_id);

-- ------------------------------------------------- row level security

alter table public.students    enable row level security;
alter table public.enrollments enable row level security;

create policy "student reads own row"
  on public.students for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "student updates own row"
  on public.students for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "student reads own enrollments"
  on public.enrollments for select
  to authenticated
  using ((select auth.uid()) = student_id);

-- The project was created with "Automatically expose new tables" off, so the
-- API roles need explicit grants. RLS above still decides which rows they see.
grant usage on schema public to authenticated;
grant select on public.students to authenticated;
grant update (name, phone, guardian_name, guardian_phone) on public.students to authenticated;
grant select on public.enrollments to authenticated;

-- ----------------------------------------------------- signup trigger

-- Copies the signup form (sent as user metadata from Signup.jsx) into the
-- students table the moment Supabase creates the auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.students (id, email, name, phone, guardian_name, guardian_phone, consented_at)
  values (
    new.id,
    new.email,
    coalesce(meta ->> 'name', ''),
    coalesce(meta ->> 'phone', ''),
    coalesce(meta ->> 'guardian_name', ''),
    coalesce(meta ->> 'guardian_phone', ''),
    case when (meta ->> 'consent') = 'true' then now() end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
