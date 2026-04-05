import { createSlice, nanoid } from '@reduxjs/toolkit'
import {
  listingImages,
  defaultImageForCategory,
} from '../data/listingImages.js'

export const CATEGORIES = [
  { value: 'BOOKS', label: 'Books' },
  { value: 'NOTES', label: 'Notes & materials' },
  { value: 'GADGETS', label: 'Gadgets' },
  { value: 'HOSTEL', label: 'Hostel & accessories' },
  { value: 'OTHER', label: 'Other' },
]

const demoSeller = 'user_demo'

function seedItems() {
  const now = Date.now()
  const rows = [
    {
      title: 'Data Structures & Algorithms (3rd ed.)',
      description: 'Light wear on corners; no highlights. Pickup at library steps.',
      price: 2800,
      category: 'BOOKS',
      imageUrl: listingImages.dataStructuresBook,
    },
    {
      title: 'Calculus lecture notes (full semester)',
      description: 'Neatly scanned summaries + past paper solutions.',
      price: 450,
      category: 'NOTES',
      imageUrl: listingImages.calculusNotes,
    },
    {
      title: 'Wireless mouse + pad',
      description: 'Logitech-style; battery included. Great for labs.',
      price: 1200,
      category: 'GADGETS',
      imageUrl: listingImages.wirelessMouse,
    },
    {
      title: 'Desk lamp (LED, warm white)',
      description: 'Clamp mount; perfect for hostel desk.',
      price: 950,
      category: 'HOSTEL',
      imageUrl: listingImages.deskLamp,
    },
    {
      title: 'Graphing calculator',
      description: 'Allowed in exams for our dept; includes cover.',
      price: 5200,
      category: 'GADGETS',
      imageUrl: listingImages.graphingCalculator,
    },
    {
      title: 'Organic Chemistry textbook',
      description: 'Latest edition; some pencil marks on exercises.',
      price: 3100,
      category: 'BOOKS',
      imageUrl: listingImages.organicChemistryBook,
    },
  ]

  const itemsByID = {}
  const itemIds = []
  rows.forEach((r, i) => {
    const id = `item_seed_${i}_${now}`
    itemIds.push(id)
    itemsByID[id] = {
      id,
      sellerId: demoSeller,
      title: r.title,
      description: r.description,
      price: r.price,
      category: r.category,
      imageUrl: r.imageUrl,
      createdAt: new Date(now - i * 3600_000).toISOString(),
    }
  })
  return { itemsByID, itemIds }
}

const seeded = seedItems()

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsByID: seeded.itemsByID,
    itemIds: seeded.itemIds,
  },
  reducers: {
    addItem(state, action) {
      const {
        sellerId,
        title,
        description,
        price,
        category,
        imageUrl,
      } = action.payload || {}
      if (!sellerId || !title || !price || !category) return
      const id = nanoid()
      state.itemsByID[id] = {
        id,
        sellerId,
        title: String(title).trim(),
        description: String(description || '').trim(),
        price: Math.max(0, Math.floor(Number(price) || 0)),
        category,
        imageUrl: imageUrl || defaultImageForCategory(category),
        createdAt: new Date().toISOString(),
      }
      state.itemIds.unshift(id)
    },
    updateItem(state, action) {
      const { id, title, description, price, category, imageUrl } =
        action.payload || {}
      const item = state.itemsByID[id]
      if (!item) return
      if (title != null) item.title = String(title).trim()
      if (description != null) item.description = String(description).trim()
      if (price != null) item.price = Math.max(0, Math.floor(Number(price) || 0))
      if (category != null) item.category = category
      if (imageUrl != null) item.imageUrl = String(imageUrl)
    },
    deleteItem(state, action) {
      const id = action.payload
      if (!state.itemsByID[id]) return
      delete state.itemsByID[id]
      state.itemIds = state.itemIds.filter((x) => x !== id)
    },
    removeItemsBySeller(state, action) {
      const sellerId = action.payload
      if (!sellerId) return
      const toRemove = state.itemIds.filter(
        (id) => state.itemsByID[id]?.sellerId === sellerId
      )
      for (const id of toRemove) {
        delete state.itemsByID[id]
      }
      state.itemIds = state.itemIds.filter((id) => !toRemove.includes(id))
    },
  },
})

export const { addItem, updateItem, deleteItem, removeItemsBySeller } =
  itemsSlice.actions

export function selectAllItems(state) {
  return state.item.itemIds.map((id) => state.item.itemsByID[id])
}

export function selectItemsForSeller(state, sellerId) {
  if (!sellerId) return []
  return state.item.itemIds
    .map((id) => state.item.itemsByID[id])
    .filter((i) => i.sellerId === sellerId)
}

export default itemsSlice.reducer
