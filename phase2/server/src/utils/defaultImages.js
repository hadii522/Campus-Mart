const q = 'auto=format&fit=crop&w=800&q=82'

const categoryDefaultImages = {
  BOOKS: `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?${q}`,
  NOTES: `https://images.unsplash.com/photo-1517842645767-c639b880efb6?${q}`,
  GADGETS: `https://images.unsplash.com/photo-1498049794561-7780e7231661?${q}`,
  HOSTEL: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?${q}`,
  OTHER: `https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?${q}`,
}

export function defaultImageForCategory(category) {
  return categoryDefaultImages[String(category).toUpperCase()] || categoryDefaultImages.OTHER
}
