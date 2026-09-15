export const GENERIC_ERROR = 'حصلت مشكلة. جرّب تاني، ولو استمرت افتح الـ Console.'

/** Logs a Supabase error with context and returns the Arabic message to show. */
export function fail(context, error) {
  console.error(`${context}:`, error)
  return GENERIC_ERROR
}
