import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Wraps routes that need a signed-in user. Waits for the first session check
 * so a page refresh on /platform doesn't bounce to /login, then redirects
 * anonymous visitors and remembers where they were going.
 */
export default function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="scs-page">
        <div className="scs-bgfx" />
        <div className="scs-content flex items-center justify-center py-32">
          <p className="scs-auth-loading">// جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
