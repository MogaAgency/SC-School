import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../hooks/useAuth'

/** Keeps the Supabase session in React state and exposes it via useAuth(). */
export default function AuthProvider({ children }) {
  // undefined = still checking, null = signed out, object = signed in
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      session: session ?? null,
      user: session?.user ?? null,
      loading: session === undefined,
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
