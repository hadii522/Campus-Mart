import { Router } from 'express'
import Product from '../models/Product.js'
import { authRequired } from '../middleware/auth.js'
import { uploadImage } from '../middleware/upload.js'
import { defaultImageForCategory } from '../utils/defaultImages.js'

const router = Router()

const publicBase =
  process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`

function absImageUrl(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/uploads')) return `${publicBase}${url}`
  return url
}

function mapProduct(doc) {
  const p = doc && doc.toObject ? doc.toObject() : { ...doc }
  const seller = p.seller && typeof p.seller === 'object' && p.seller._id ? p.seller : null
  const rawId = p._id ?? p.id
  return {
    id: rawId?.toString?.() || String(rawId),
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    imageUrl: absImageUrl(p.imageUrl),
    sellerId: seller ? seller._id.toString() : p.seller?.toString?.() || String(p.seller),
    seller: seller
      ? {
          id: seller._id.toString(),
          name: seller.name,
          email: seller.email,
          department: seller.department,
        }
      : undefined,
    createdAt: p.createdAt,
  }
}

/** GET /api/products?q=&category=&minPrice=&maxPrice= */
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query
    const filter = {}
    if (category) filter.category = String(category).toUpperCase()
    if (minPrice !== undefined && minPrice !== '') {
      filter.price = { ...filter.price, $gte: Math.max(0, Number(minPrice)) || 0 }
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Math.max(0, Number(maxPrice)) || 0
      filter.price = { ...filter.price, $lte: max }
    }
    if (q && String(q).trim()) {
      const esc = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const rx = new RegExp(esc, 'i')
      filter.$or = [{ title: rx }, { description: rx }]
    }

    const items = await Product.find(filter)
      .populate('seller', 'name email department')
      .sort({ createdAt: -1 })
      .lean()
    const mapped = items.map((p) =>
      mapProduct({
        ...p,
        seller: p.seller,
        _id: p._id,
      })
    )
    res.json(mapped)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to list products' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('seller', 'name email department')
    if (!p) return res.status(404).json({ error: 'Not found' })
    res.json(mapProduct(p))
  } catch {
    res.status(400).json({ error: 'Invalid id' })
  }
})

router.post('/', authRequired, uploadImage.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body
    if (!title || price == null || !category) {
      return res.status(400).json({ error: 'title, price, and category are required' })
    }
    let img = imageUrl ? String(imageUrl).trim() : ''
    if (req.file) {
      img = `/uploads/${req.file.filename}`
    }
    if (!img) img = defaultImageForCategory(category)

    const p = await Product.create({
      title: String(title).trim(),
      description: String(description || '').trim(),
      price: Math.max(0, Math.floor(Number(price)) || 0),
      category: String(category).toUpperCase(),
      imageUrl: img,
      seller: req.userId,
    })
    const full = await Product.findById(p._id).populate('seller', 'name email department')
    res.status(201).json(mapProduct(full))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not create listing' })
  }
})

router.patch('/:id', authRequired, uploadImage.single('image'), async (req, res) => {
  try {
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ error: 'Not found' })
    if (p.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not your listing' })
    }
    const { title, description, price, category, imageUrl } = req.body
    if (title != null) p.title = String(title).trim()
    if (description != null) p.description = String(description).trim()
    if (price != null) p.price = Math.max(0, Math.floor(Number(price)) || 0)
    if (category != null) p.category = String(category).toUpperCase()
    if (req.file) p.imageUrl = `/uploads/${req.file.filename}`
    else if (imageUrl != null && String(imageUrl).trim()) p.imageUrl = String(imageUrl).trim()

    await p.save()
    const full = await Product.findById(p._id).populate('seller', 'name email department')
    res.json(mapProduct(full))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not update listing' })
  }
})

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ error: 'Not found' })
    if (p.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not your listing' })
    }
    await p.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(400).json({ error: 'Invalid id' })
  }
})

export default router
