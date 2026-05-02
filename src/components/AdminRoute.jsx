import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAdmin, selectUserProfile } from '../store/usersSlice'

export default function AdminRoute({ children }) {
  const profile = useSelector(selectUserProfile)
  const isAdmin = useSelector(selectIsAdmin)
  const location = useLocation()

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}
