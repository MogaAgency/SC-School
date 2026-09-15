-- SC School platform — phase 3: quizzes and scores.
--
-- Run AFTER 002_admin_courses_lessons.sql, once, in the SQL Editor. Safe to
-- re-run. Nothing existing is dropped.
--
-- Design
--   quizzes         one optional quiz per lesson
--   quiz_questions  prompt + 2..4 options. NO correct answer in here, so a
--                   student can read questions without seeing the answers.
--   quiz_answers    the correct option per question. Admin-only via RLS.
--   quiz_attempts   one row per submission; written only by submit_quiz(),
--                   which grades inside the database.

-- ------------------------------------------------------------ quizzes

create table if not exists public.quizzes (
  id           uuid primary key default gen_random_uuid(),
  lesson_id    uuid not null unique references public.lessons (id) on delete cascade,
  title        text not null default 'اختبار الدرس',
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.quizzes enable row level security;

drop policy if exists "admins manage quizzes"        on public.quizzes;
drop policy if exists "students read available quizzes" on public.quizzes;

create policy "admins manage quizzes"
  on public.quizzes for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "students read available quizzes"
  on public.quizzes for select to authenticated
  using (
    is_published
    and exists (
      select 1
      from public.lessons l
      join public.courses c on c.id = l.course_id
      join public.enrollments e on e.course_id = c.id
      where l.id = quizzes.lesson_id
        and l.is_published
        and c.is_published
        and e.student_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.quizzes to authenticated;

-- ------------------------------------------------------ quiz questions

create table if not exists public.quiz_questions (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.quizzes (id) on delete cascade,
  prompt     text not null,
  options    text[] not null
             check (array_length(options, 1) between 2 and 4),
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists quiz_questions_quiz_id_idx on public.quiz_questions (quiz_id);

alter table public.quiz_questions enable row level security;

drop policy if exists "admins manage quiz questions"        on public.quiz_questions;
drop policy if exists "students read available quiz questions" on public.quiz_questions;

create policy "admins manage quiz questions"
  on public.quiz_questions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- reuse the quizzes policy: if the student can see the quiz, they can see
-- its questions.
create policy "students read available quiz questions"
  on public.quiz_questions for select to authenticated
  using (exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id));

grant select, insert, update, delete on public.quiz_questions to authenticated;

-- -------------------------------------------------------- quiz answers

create table if not exists public.quiz_answers (
  question_id   uuid primary key references public.quiz_questions (id) on delete cascade,
  correct_index smallint not null check (correct_index between 0 and 3)
);

alter table public.quiz_answers enable row level security;

drop policy if exists "admins manage quiz answers" on public.quiz_answers;

create policy "admins manage quiz answers"
  on public.quiz_answers for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.quiz_answers to authenticated;

-- ------------------------------------------------------- quiz attempts

create table if not exists public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.quizzes (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  answers    smallint[] not null,
  score      integer not null,
  total      integer not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_quiz_id_idx    on public.quiz_attempts (quiz_id);
create index if not exists quiz_attempts_student_id_idx on public.quiz_attempts (student_id);

alter table public.quiz_attempts enable row level security;

drop policy if exists "admins read quiz attempts"    on public.quiz_attempts;
drop policy if exists "students read own attempts"   on public.quiz_attempts;

create policy "admins read quiz attempts"
  on public.quiz_attempts for select to authenticated
  using (public.is_admin());

create policy "students read own attempts"
  on public.quiz_attempts for select to authenticated
  using ((select auth.uid()) = student_id);

-- select only: rows are inserted by submit_quiz() below, never directly.
grant select on public.quiz_attempts to authenticated;

-- ------------------------------------------------------------ grading

-- Grades a submission and records it. Answers are compared in question
-- order (position, created_at), the same order the app shows them. Returns
-- the score and the correct indexes so the page can show the corrections.
create or replace function public.submit_quiz(p_quiz_id uuid, p_answers smallint[])
returns table (score integer, total integer, correct smallint[])
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student uuid := (select auth.uid());
  v_correct smallint[];
  v_total   integer;
  v_score   integer;
begin
  if v_student is null then
    raise exception 'not signed in';
  end if;

  if not exists (
    select 1
    from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.courses c on c.id = l.course_id
    join public.enrollments e on e.course_id = c.id
    where q.id = p_quiz_id
      and q.is_published and l.is_published and c.is_published
      and e.student_id = v_student
  ) then
    raise exception 'quiz not available';
  end if;

  -- a question with no stored answer can never be marked correct (-1)
  select array_agg(coalesce(a.correct_index, (-1)::smallint) order by qq.position, qq.created_at),
         count(*)
    into v_correct, v_total
  from public.quiz_questions qq
  left join public.quiz_answers a on a.question_id = qq.id
  where qq.quiz_id = p_quiz_id;

  if coalesce(v_total, 0) = 0 then
    raise exception 'quiz has no questions';
  end if;
  if coalesce(array_length(p_answers, 1), 0) <> v_total then
    raise exception 'answer count mismatch';
  end if;

  select count(*) into v_score
  from generate_subscripts(v_correct, 1) i
  where v_correct[i] = p_answers[i];

  insert into public.quiz_attempts (quiz_id, student_id, answers, score, total)
  values (p_quiz_id, v_student, p_answers, v_score, v_total);

  return query select v_score, v_total, v_correct;
end;
$$;

revoke all on function public.submit_quiz(uuid, smallint[]) from public;
grant execute on function public.submit_quiz(uuid, smallint[]) to authenticated;
