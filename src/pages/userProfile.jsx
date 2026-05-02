import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutUser,
  selectUserProfile,
  deleteCurrentUser,
} from '../store/usersSlice'
import { fetchProducts } from '../store/itemsSlice'
import { formatDateTime } from '../utils/format.js'

export default function UserProfile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const profile = useSelector(selectUserProfile)

  function handleLogout() {
    dispatch(logoutUser())
    navigate('/', { replace: true })
  }

  async function handleDeleteAccount() {
    if (!profile) return
    const line1 =
      'Delete your CampusMart account and every listing you posted? Your data will be removed from the database (MongoDB).'
    if (!window.confirm(line1)) return
    if (
      !window.confirm(
        'This cannot be undone. Remove your account and listings now?'
      )
    )
      return
    try {
      await dispatch(deleteCurrentUser()).unwrap()
      await dispatch(fetchProducts({})).unwrap()
      navigate('/', { replace: true })
    } catch (e) {
      window.alert(e?.message || 'Could not delete account')
    }
  }

  if (!profile) return null

  return (
    <div className="narrow">
      <h1 className="pageTitle">Profile</h1>
      <p className="pageSubtitle">
        Your CampusMart account (stored on the server — JWT in this browser).
      </p>

      <div className="card">
        <div className="cardInner">
          <table className="table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{profile.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{profile.email}</td>
              </tr>
              <tr>
                <th>Phone no.</th>
                <td>{profile.phone}</td>
              </tr>
              <tr>
                <th>Department</th>
                <td>{profile.department}</td>
              </tr>
              {profile.role === 'admin' ? (
                <tr>
                  <th>Role</th>
                  <td>Administrator</td>
                </tr>
              ) : null}
              <tr>
                <th>Member since</th>
                <td>{formatDateTime(profile.createdAt)}</td>
              </tr>
            </tbody>
          </table>

          <div className="row" style={{ marginTop: 14 }}>
            <button type="button" className="btn btnDanger" onClick={handleLogout}>
              Log out
            </button>
            <Link className="btn" to="/dashboard">
              Dashboard
            </Link>
          </div>

          <div className="dangerZone">
            <h2 className="dangerZoneTitle">Delete account</h2>
            <p className="dangerZoneText">
              Permanently remove your profile and all your listings from the
              database. You can register again with the same email if it is still
              available.
            </p>
            <button
              type="button"
              className="btn btnDanger"
              onClick={handleDeleteAccount}
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
