import { createClient } from '@supabase/supabase-js'

// Tolerate the quotes/whitespace that survive a copy-paste into a hosting
// dashboard, same as the Web3Forms key in Contact.jsx.
const clean = (value) => (value ?? '').trim().replace(/^['"]|['"]$/g, '')

const url = clean(import.meta.env.VITE_SUPABASE_URL)
const key = clean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

/**
 * The shared Supabase client, or `null` when the env vars are missing so the
 * auth pages can show a clear error instead of crashing at import time.
 */
export const supabase = url && key ? createClient(url, key) : null

if (!supabase) {
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set — the platform login cannot work.',
  )
}
