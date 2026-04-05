const KEY = 'campusMart.v2'

const LEGACY_DEMO_EMAIL = 'demo.student@university.edu'
const CURRENT_DEMO_EMAIL = 'demo.student@lhr.nu.edu.pk'

/** Fix demo account email when upgrading from older builds (persisted Redux state). */
function migratePersistedState(state) {
  if (!state || typeof state !== 'object') return state
  const usersByID = state.user?.usersByID
  if (!usersByID || typeof usersByID !== 'object') return state

  for (const id of Object.keys(usersByID)) {
    const u = usersByID[id]
    if (!u || typeof u.email !== 'string') continue
    const e = u.email.trim().toLowerCase()
    if (e === LEGACY_DEMO_EMAIL) u.email = CURRENT_DEMO_EMAIL
  }
  return state
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    return migratePersistedState(parsed)
  } catch {
    return undefined
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore quota / privacy mode errors
  }
}

