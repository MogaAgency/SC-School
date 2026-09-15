import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../hooks/useAuth'

/** Keeps the Supabase session in React state and exposes it via useAuth(). */
export default function AuthProvider({ children }) {
  // undefined = still checking, null = signed out, object = signed in
  const [session, setSession] = useState(undefined)
  // undefined = not checked yet for this session
  const [isAdmin, setIsAdmin] = useState(undefined)

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

  // Ask the database whether this user is an admin (public.is_admin()).
  const userId = session?.user?.id ?? null
  const sessionChecked = session !== undefined
  useEffect(() => {
    if (!sessionChecked) return
    if (!userId || !supabase) {
      setIsAdmin(false)
      return
    }

    let cancelled = false
    setIsAdmin(undefined)
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (cancelled) return
      if (error) console.error('is_admin() failed:', error)
      setIsAdmin(Boolean(data) && !error)
    })
    return () => {
      cancelled = true
    }
  }, [sessionChecked, userId])

  const value = useMemo(
    () => ({
      session: session ?? null,
      user: session?.user ?? null,
      loading: session === undefined,
      isAdmin: isAdmin === true,
      adminLoading: session === undefined || (Boolean(userId) && isAdmin === undefined),
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
      },
    }),
    [session, userId, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
