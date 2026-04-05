import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './itemsSlice'
import usersReducer from './usersSlice'
import { loadState, saveState } from './storage'

function buildInitialState() {
  const persisted = loadState()
  if (persisted && typeof persisted === 'object') return persisted
  return undefined
}

export const store = configureStore({
  reducer: { user: usersReducer, item: itemsReducer },
  preloadedState: buildInitialState(),
})

let saveTimer = null
store.subscribe(() => {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    saveState(store.getState())
  }, 250)
})

