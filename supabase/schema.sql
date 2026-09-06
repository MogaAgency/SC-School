-- SC School platform schema.
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste →
-- Run. It is safe to re-run; every statement is idempotent.
--
-- Model: one auth user = one guardian (ولي الأمر). A guardian has a profile,
-- one or more students, and each student has zero or more enrollments.
-- Families can only read their own rows (Row Level Security below). Students
-- and enrollments are added by the school from the dashboard, never from the
-- website, so there are no insert policies for the browser.

-- ---------------------------------------------------------------- tables

create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  email          text,
  guardian_name  text not null default '',
  guardian_phone text not null default '',
  consented_at   timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists public.students (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name       text not null,
  phone      text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  course     text not null,
  level      text,
  schedule   text,
  status     text not null default 'active'
             check (status in ('active', 'completed', 'paused')),
  starts_on  date,
  created_at timestamptz not null default now()
);

create index if not exists students_profile_id_idx   on public.students (profile_id);
create index if not exists enrollments_student_id_idx on public.enrollments (student_id);

-- ------------------------------------------------- row level security

alter table public.profiles    enable row level security;
alter table public.students    enable row level security;
alter table public.enrollments enable row level security;

drop policy if exists "guardian reads own profile"   on public.profiles;
drop policy if exists "guardian updates own profile" on public.profiles;
create policy "guardian reads own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);
create policy "guardian updates own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "guardian reads own students" on public.students;
create policy "guardian reads own students"
  on public.students for select
  to authenticated
  using ((select auth.uid()) = profile_id);

drop policy if exists "guardian reads own enrollments" on public.enrollments;
create policy "guardian reads own enrollments"
  on public.enrollments for select
  to authenticated
  using (
    exists (
      select 1 from public.students s
      where s.id = enrollments.student_id
        and s.profile_id = (select auth.uid())
    )
  );

-- The project was created with "Automatically expose new tables" off, so the
-- API roles need explicit grants. RLS above still decides which rows they see.
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant update (guardian_name, guardian_phone) on public.profiles to authenticated;
grant select on public.students    to authenticated;
grant select on public.enrollments to authenticated;

-- ----------------------------------------------------- signup trigger

-- Copies the signup form (sent as user metadata from Signup.jsx) into
-- profiles + students the moment Supabase creates the auth user, so the
-- browser never needs insert rights on either table.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta         jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  student_name text  := nullif(trim(coalesce(meta ->> 'student_name', '')), '');
begin
  insert into public.profiles (id, email, guardian_name, guardian_phone, consented_at)
  values (
    new.id,
    new.email,
    coalesce(meta ->> 'guardian_name', ''),
    coalesce(meta ->> 'guardian_phone', ''),
    case when (meta ->> 'consent') = 'true' then now() end
  )
  on conflict (id) do nothing;

  if student_name is not null then
    insert into public.students (profile_id, name, phone)
    values (new.id, student_name, coalesce(meta ->> 'student_phone', ''));
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
