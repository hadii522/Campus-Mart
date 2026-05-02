import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, setToken, getToken } from '../api/client.js'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

/** FAST University Lahore campus — Nuces student email */
export function isUniversityEmail(email) {
  const e = normalizeEmail(email)
  if (!e.includes('@')) return false
  return e.endsWith('@lhr.nu.edu.pk')
}

function mapUser(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    department: u.department || '',
    role: u.role || 'user',
    createdAt: u.createdAt,
  }
}

export const loadMe = createAsyncThunk('user/loadMe', async (_, { rejectWithValue }) => {
  try {
    if (!getToken()) return null
    return await api('/auth/me')
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      setToken(data.token)
      return mapUser(data.user)
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api('/auth/register', { method: 'POST', body: payload })
      setToken(data.token)
      return mapUser(data.user)
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const deleteCurrentUser = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await api('/auth/account', { method: 'DELETE' })
      setToken(null)
      return true
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

const initialState = {
  profile: null,
  authError: null,
  status: 'idle',
  hydrated: false,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null
    },
    logoutUser: (state) => {
      setToken(null)
      state.profile = null
      state.authError = null
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMe.pending, (state) => {
        state.status = 'loading'
        state.authError = null
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.status = 'idle'
        state.profile = action.payload ? mapUser(action.payload) : null
        state.hydrated = true
      })
      .addCase(loadMe.rejected, (state, action) => {
        setToken(null)
        state.profile = null
        state.status = 'idle'
        state.hydrated = true
        if (action.payload) state.authError = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.authError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.profile = action.payload
        state.authError = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'idle'
        state.authError = action.payload || 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.authError = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.profile = action.payload
        state.authError = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'idle'
        state.authError = action.payload || 'Registration failed'
      })
      .addCase(deleteCurrentUser.fulfilled, (state) => {
        state.profile = null
        state.status = 'idle'
      })
      .addCase(deleteCurrentUser.rejected, (state, action) => {
        state.authError = action.payload || 'Could not delete account'
      })
  },
})

export const { clearAuthError, logoutUser } = usersSlice.actions

export function selectUserProfile(state) {
  return state.user.profile
}

export function selectAuthError(state) {
  return state.user.authError
}

export function selectAuthLoading(state) {
  return state.user.status === 'loading'
}

export function selectAuthHydrated(state) {
  return state.user.hydrated
}

export function selectIsAdmin(state) {
  return state.user.profile?.role === 'admin'
}

/** @deprecated kept for rare legacy string checks */
export const DEMO_USER_ID = 'user_demo'

export default usersSlice.reducer
