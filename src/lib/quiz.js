/** Helpers shared by the admin quiz pages and the student quiz. */

/** PostgREST returns a one-to-one relation as an object, but be tolerant. */
export const one = (rel) => (Array.isArray(rel) ? (rel[0] ?? null) : (rel ?? null))

/** Best score per quiz from a list of attempts: { [quizId]: { best, total, attempts, last } } */
export function summarizeAttempts(attempts) {
  const out = {}
  for (const a of attempts ?? []) {
    const cur = out[a.quiz_id]
    if (!cur) {
      out[a.quiz_id] = { best: a.score, total: a.total, attempts: 1, last: a.created_at }
      continue
    }
    cur.attempts += 1
    if (a.score > cur.best || (a.score === cur.best && a.total > cur.total)) {
      cur.best = a.score
      cur.total = a.total
    }
    if (a.created_at > cur.last) cur.last = a.created_at
  }
  return out
}

export const percent = (score, total) => (total ? Math.round((score / total) * 100) : 0)

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('ar-EG') : '')
