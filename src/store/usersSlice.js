import { createSlice } from '@reduxjs/toolkit'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

/** FAST University Lahore campus — Nuces student email */
export function isUniversityEmail(email) {
  const e = normalizeEmail(email)
  if (!e.includes('@')) return false
  return e.endsWith('@lhr.nu.edu.pk')
}

function pickProfile(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    department: u.department,
    createdAt: u.createdAt,
  }
}

export const DEMO_USER_ID = 'user_demo'
const demoId = DEMO_USER_ID
const demoCreated = new Date('2025-01-15').toISOString()

const initialState = {
  usersByID: {
    [demoId]: {
      id: demoId,
      name: 'Demo Student',
      email: 'demo.student@lhr.nu.edu.pk',
      phone: '+1 555 0100',
      department: 'Computer Science',
      password: 'demo123',
      createdAt: demoCreated,
    },
  },
  userIds: [demoId],
  currentUserId: null,
  authError: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null
    },
    registerUser(state, action) {
      const { name, email, phone, department, password } = action.payload || {}

      if (!name || !email || !phone || !department || !password) {
        state.authError = 'Please fill in all fields'
        return
      }
      if (!isUniversityEmail(email)) {
        state.authError =
          'Use your FAST Lahore student email (must end with @lhr.nu.edu.pk)'
        return
      }

      const normalized = normalizeEmail(email)
      const exists = state.userIds.some(
        (id) => state.usersByID[id].email === normalized
      )
      if (exists) {
        state.authError = 'An account with this email already exists'
        return
      }

      const id = `user_${Math.random().toString(16).slice(2)}`
      state.usersByID[id] = {
        id,
        name: String(name).trim(),
        email: normalized,
        phone: String(phone).trim(),
        department: String(department).trim(),
        password: String(password),
        createdAt: new Date().toISOString(),
      }
      state.userIds.unshift(id)
      state.currentUserId = id
      state.authError = null
    },
    loginUser(state, action) {
      const { email, password } = action.payload || {}
      const normalized = normalizeEmail(email)
      const user = state.userIds
        .map((id) => state.usersByID[id])
        .find((u) => u.email === normalized)
      if (!user || user.password !== String(password || '')) {
        state.authError = 'Invalid email or password'
        return
      }
      state.currentUserId = user.id
      state.authError = null
    },
    logoutUser(state) {
      state.currentUserId = null
      state.authError = null
    },
    deleteCurrentUser(state) {
      const id = state.currentUserId
      if (!id) return
      delete state.usersByID[id]
      state.userIds = state.userIds.filter((uid) => uid !== id)
      state.currentUserId = null
      state.authError = null
    },
  },
})

export const {
  registerUser,
  loginUser,
  logoutUser,
  clearAuthError,
  deleteCurrentUser,
} = usersSlice.actions

export function selectUserProfile(state) {
  const id = state.user.currentUserId
  return id ? pickProfile(state.user.usersByID[id]) : null
}

export function selectAuthError(state) {
  return state.user.authError
}

export default usersSlice.reducer
