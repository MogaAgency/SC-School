import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Wraps the /admin routes. Anonymous visitors go to /login, signed-in
 * non-admins go to their platform page. The database enforces the same
 * rule on every query, this just keeps the UI honest.
 */
export default function RequireAdmin() {
  const { user, loading, isAdmin, adminLoading } = useAuth()
  const location = useLocation()

  if (loading || adminLoading) {
    return (
      <div className="scs-page">
        <div className="scs-bgfx" />
        <div className="scs-content flex items-center justify-center py-32">
          <p className="scs-auth-loading">// جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isAdmin) return <Navigate to="/platform" replace />

  return <Outlet />
}
