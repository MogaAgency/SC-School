import { createContext, useContext } from 'react'

/**
 * Filled by <AuthProvider>. Shape:
 *   { session, user, loading, isAdmin, adminLoading, signOut }
 * `loading` is true until the first session check has finished, so route
 * guards can wait instead of bouncing a logged-in user to /login on refresh.
 * `adminLoading` is true while the is_admin() lookup for the current user
 * is still in flight.
 */
export const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  signOut: async () => {},
})

export default function useAuth() {
  return useContext(AuthContext)
}
