import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  registerUser,
  clearAuthError,
  selectAuthError,
  selectUserProfile,
} from '../store/usersSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authError = useSelector(selectAuthError)
  const profile = useSelector(selectUserProfile)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (profile) navigate('/dashboard', { replace: true })
  }, [profile, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(
      registerUser({
        name,
        email,
        phone,
        department,
        password,
      })
    )
  }

  return (
    <div className="narrow">
      <h1 className="pageTitle">Create your account</h1>
      <p className="pageSubtitle">
        FAST University Lahore (NUCES) only: your email must end with{' '}
        <code>@lhr.nu.edu.pk</code>. Phase 1 checks this in the browser only;
        later in phase 2 it can verify with the backend.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="cardInner">
          {authError ? <div className="error">{authError}</div> : null}

          <label className="label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="label" htmlFor="reg-email">
            FAST Lahore email (@lhr.nu.edu.pk)
          </label>
          <input
            id="reg-email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label className="label" htmlFor="department">
            Department / program
          </label>
          <input
            id="department"
            className="input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <label className="label" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn btnPrimary" type="submit">
              Register
            </button>
            <Link className="btn" to="/login">
              Already have an account?
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
