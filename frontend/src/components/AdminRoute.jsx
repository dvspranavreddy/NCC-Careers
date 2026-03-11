import { Navigate } from 'react-router-dom'

/**
 * Wrap admin pages with this component to enforce authentication.
 * It simply looks for a stored token and redirects to the login page
 * when none is present (or when it has expired and the backend
 * returns 401, which is also handled inside the pages themselves).
 */
export default function AdminRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/admin/login" replace />
}
