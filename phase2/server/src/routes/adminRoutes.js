import { Router } from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { authRequired, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(authRequired, adminOnly)

router.get('/stats', async (_req, res) => {
  try {
    const [users, products] = await Promise.all([User.countDocuments(), Product.countDocuments()])
    res.json({ users, products })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load stats' })
  }
})

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean()
    res.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        department: u.department,
        role: u.role,
        createdAt: u.createdAt,
      }))
    )
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to list users' })
  }
})

router.get('/products', async (_req, res) => {
  try {
    const items = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    res.json(
      items.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        price: p.price,
        category: p.category,
        sellerEmail: p.seller?.email,
        createdAt: p.createdAt,
      }))
    )
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to list products' })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' })
    }
    await Product.deleteMany({ seller: req.params.id })
    await User.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
