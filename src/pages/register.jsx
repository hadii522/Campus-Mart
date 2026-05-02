import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  registerUser,
  clearAuthError,
  selectAuthError,
  selectUserProfile,
  selectAuthLoading,
  isUniversityEmail,
} from '../store/usersSlice'
import { fetchProducts } from '../store/itemsSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authError = useSelector(selectAuthError)
  const profile = useSelector(selectUserProfile)
  const authLoading = useSelector(selectAuthLoading)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (profile) navigate('/dashboard', { replace: true })
  }, [profile, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    if (!isUniversityEmail(email)) {
      setLocalError('Use your FAST Lahore email (@lhr.nu.edu.pk)')
      return
    }
    try {
      await dispatch(
        registerUser({
          name,
          email,
          phone,
          department,
          password,
        })
      ).unwrap()
      dispatch(fetchProducts({}))
    } catch {
      /* authError in slice */
    }
  }

  return (
    <div className="narrow">
      <h1 className="pageTitle">Create your account</h1>
      <p className="pageSubtitle">
        FAST University Lahore (NUCES) only: your email must end with{' '}
        <code>@lhr.nu.edu.pk</code>. The server enforces the same rule.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="cardInner">
          {localError || authError ? (
            <div className="error">{localError || authError}</div>
          ) : null}

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
            <button
              className="btn btnPrimary"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? 'Please wait…' : 'Register'}
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
