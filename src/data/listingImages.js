/**
 * Curated Unsplash images — each URL matches the listing theme (not random placeholders).
 * https://unsplash.com/license
 */
const q = 'auto=format&fit=crop&w=800&q=82'

export const listingImages = {
  /** Open textbook — fits CS / DSA course book */
  dataStructuresBook: `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?${q}`,
  /** Notebook & pen — lecture notes */
  calculusNotes: `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?${q}`,
  /** Wireless mouse on desk */
  wirelessMouse: `https://images.unsplash.com/photo-1527864550417-7fd75fc50dc0?${q}`,
  /** Desk / study lamp */
  deskLamp: `https://images.unsplash.com/photo-1507473885765-e6ed057f782c?${q}`,
  /** Scientific / graphing calculator */
  graphingCalculator: `https://images.unsplash.com/photo-1587145820266-a5951ee6a620?${q}`,
  /** Chemistry lab glassware — organic chemistry context */
  organicChemistryBook: `https://images.unsplash.com/photo-1532094349884-543bc11b234d?${q}`,
}

/** When a user adds a listing without an image URL */
export const categoryDefaultImages = {
  BOOKS: `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?${q}`,
  NOTES: `https://images.unsplash.com/photo-1517842645767-c639b880efb6?${q}`,
  GADGETS: `https://images.unsplash.com/photo-1498049794561-7780e7231661?${q}`,
  HOSTEL: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?${q}`,
  OTHER: `https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?${q}`,
}

export function defaultImageForCategory(category) {
  return categoryDefaultImages[category] || categoryDefaultImages.OTHER
}
