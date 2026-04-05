import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUser,
  clearAuthError,
  selectAuthError,
  selectUserProfile,
} from '../store/usersSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const authError = useSelector(selectAuthError)
  const profile = useSelector(selectUserProfile)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from || '/dashboard'

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (profile) navigate(from, { replace: true })
  }, [profile, navigate, from])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="narrow">
      <h1 className="pageTitle">Log in</h1>
      <p className="pageSubtitle">
        Use your <code>@lhr.nu.edu.pk</code> email. Demo:{' '}
        <code>demo.student@lhr.nu.edu.pk</code> / <code>demo123</code>
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="cardInner">
          {authError ? <div className="error">{authError}</div> : null}

          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn btnPrimary" type="submit">
              Log in
            </button>
            <Link className="btn" to="/register">
              Need an account?
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
