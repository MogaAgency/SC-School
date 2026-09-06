import { createContext, useContext } from 'react'

/**
 * Filled by <AuthProvider>. Shape:
 *   { session, user, loading, signOut }
 * `loading` is true until the first session check has finished, so route
 * guards can wait instead of bouncing a logged-in user to /login on refresh.
 */
export const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export default function useAuth() {
  return useContext(AuthContext)
}
