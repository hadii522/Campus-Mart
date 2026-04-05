import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../store/usersSlice'

export default function ProtectedRoute({ children }) {
  const profile = useSelector(selectUserProfile)
  const location = useLocation()

  if (!profile) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }

  return children
}
