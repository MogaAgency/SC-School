-- SC School platform — phase 1: admins, courses, lessons, enrollment.
--
-- Run AFTER schema.sql, once, in the Supabase SQL Editor. Safe to re-run.
-- Registered students are untouched. The old free-text `enrollments` table
-- is rebuilt to point at real courses, so any test enrollment rows are lost.
--
-- Access model
--   admins    : anyone whose user id is in public.admins. is_admin() is the
--               single check every policy below relies on.
--   students  : read only, and only the published courses/lessons/files of
--               the courses they are enrolled in.

-- ------------------------------------------------------------- admins

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- security definer so it can read public.admins without tripping over the
-- table's own RLS (which would recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins read admins"   on public.admins;
drop policy if exists "admins add admins"    on public.admins;
drop policy if exists "admins remove admins" on public.admins;

create policy "admins read admins"
  on public.admins for select to authenticated
  using (public.is_admin());

create policy "admins add admins"
  on public.admins for insert to authenticated
  with check (public.is_admin());

-- an admin can remove other admins but never themselves (no lock-out)
create policy "admins remove admins"
  on public.admins for delete to authenticated
  using (public.is_admin() and user_id <> (select auth.uid()));

grant select, insert, delete on public.admins to authenticated;

-- ------------------------------------------------------------ courses

create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  level        text not null default '',
  description  text not null default '',
  is_published boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

-- -------------------------------------------------------- enrollments
-- Rebuilt: `course text` becomes a real reference to courses. This has to
-- happen before any policy below mentions enrollments.course_id, because
-- Postgres validates policy expressions against the table as it exists.

drop table if exists public.enrollments cascade;

create table public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  course_id  uuid not null references public.courses (id) on delete cascade,
  schedule   text,
  status     text not null default 'active'
             check (status in ('active', 'completed', 'paused')),
  starts_on  date,
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create index enrollments_student_id_idx on public.enrollments (student_id);
create index enrollments_course_id_idx  on public.enrollments (course_id);

alter table public.enrollments enable row level security;

create policy "student reads own enrollments"
  on public.enrollments for select to authenticated
  using ((select auth.uid()) = student_id);

create policy "admins manage enrollments"
  on public.enrollments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.enrollments to authenticated;

-- ------------------------------------------------------ course policies

alter table public.courses enable row level security;

drop policy if exists "admins manage courses"                on public.courses;
drop policy if exists "students read enrolled published courses" on public.courses;

create policy "admins manage courses"
  on public.courses for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "students read enrolled published courses"
  on public.courses for select to authenticated
  using (
    is_published
    and exists (
      select 1 from public.enrollments e
      where e.course_id = courses.id
        and e.student_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.courses to authenticated;

-- ------------------------------------------------------------ lessons

create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses (id) on delete cascade,
  title        text not null,
  youtube_url  text not null default '',
  content      text not null default '',
  is_published boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);

alter table public.lessons enable row level security;

drop policy if exists "admins manage lessons"                 on public.lessons;
drop policy if exists "students read enrolled published lessons" on public.lessons;

create policy "admins manage lessons"
  on public.lessons for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "students read enrolled published lessons"
  on public.lessons for select to authenticated
  using (
    is_published
    and exists (
      select 1
      from public.enrollments e
      join public.courses c on c.id = e.course_id
      where e.course_id = lessons.course_id
        and c.is_published
        and e.student_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.lessons to authenticated;

-- ------------------------------------------------------- lesson files
-- Metadata for attachments (PDFs, images…). The bytes live in the
-- `lesson-files` storage bucket at `<course_id>/<lesson_id>/<file>`.

create table if not exists public.lesson_files (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references public.lessons (id) on delete cascade,
  name       text not null,
  path       text not null unique,
  size       bigint,
  created_at timestamptz not null default now()
);

create index if not exists lesson_files_lesson_id_idx on public.lesson_files (lesson_id);

alter table public.lesson_files enable row level security;

drop policy if exists "admins manage lesson files"          on public.lesson_files;
drop policy if exists "students read files of enrolled lessons" on public.lesson_files;

create policy "admins manage lesson files"
  on public.lesson_files for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "students read files of enrolled lessons"
  on public.lesson_files for select to authenticated
  using (
    exists (
      select 1
      from public.lessons l
      join public.courses c on c.id = l.course_id
      join public.enrollments e on e.course_id = c.id
      where l.id = lesson_files.lesson_id
        and l.is_published
        and c.is_published
        and e.student_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.lesson_files to authenticated;

-- ----------------------------------------------- students, seen by admins

drop policy if exists "admins read all students" on public.students;
create policy "admins read all students"
  on public.students for select to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------ storage

insert into storage.buckets (id, name, public, file_size_limit)
values ('lesson-files', 'lesson-files', false, 26214400)  -- 25 MB per file
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

drop policy if exists "admins manage lesson files bucket"       on storage.objects;
drop policy if exists "students read files of enrolled lessons" on storage.objects;

create policy "admins manage lesson files bucket"
  on storage.objects for all to authenticated
  using (bucket_id = 'lesson-files' and public.is_admin())
  with check (bucket_id = 'lesson-files' and public.is_admin());

-- object name is `<course_id>/<lesson_id>/<file>`; the second segment is
-- the lesson, and the lesson must be published and in an enrolled course.
create policy "students read files of enrolled lessons"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'lesson-files'
    and exists (
      select 1
      from public.lessons l
      join public.courses c on c.id = l.course_id
      join public.enrollments e on e.course_id = c.id
      where l.id::text = split_part(storage.objects.name, '/', 2)
        and l.is_published
        and c.is_published
        and e.student_id = (select auth.uid())
    )
  );

-- -------------------------------------------------------- first admin
-- Nobody is an admin yet. Replace the email with the account you signed up
-- with on the website, remove the leading `--` from the three lines, and run
-- them once. After that, more admins can be added from the dashboard UI.
--
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict (user_id) do nothing;
