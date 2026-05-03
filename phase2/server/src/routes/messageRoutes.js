import { Router } from 'express'
import Message from '../models/Message.js'
import Product from '../models/Product.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

/** Inbox: messages where current user is recipient or sender, grouped by product */
router.get('/', authRequired, async (req, res) => {
  try {
    const uid = req.userId
    const msgs = await Message.find({ $or: [{ from: uid }, { to: uid }] })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()

    res.json(
      msgs.map((m) => ({
        id: m._id.toString(),
        body: m.body,
        read: m.read,
        createdAt: m.createdAt,
        productId: m.product?._id?.toString(),
        productTitle: m.product?.title,
        from: m.from ? { id: m.from._id.toString(), name: m.from.name, email: m.from.email } : null,
        to: m.to ? { id: m.to._id.toString(), name: m.to.name, email: m.to.email } : null,
      }))
    )
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load messages' })
  }
})

router.post('/', authRequired, async (req, res) => {
  try {
    const { productId, body } = req.body || {}
    if (!productId || !body || !String(body).trim()) {
      return res.status(400).json({ error: 'productId and body are required' })
    }
    const product = await Product.findById(productId).populate('seller')
    if (!product) return res.status(404).json({ error: 'Product not found' })
    const sellerId = product.seller._id.toString()
    if (sellerId === req.userId) {
      return res.status(400).json({ error: 'Cannot message yourself' })
    }

    const msg = await Message.create({
      from: req.userId,
      to: sellerId,
      product: productId,
      body: String(body).trim().slice(0, 2000),
    })
    const populated = await Message.findById(msg._id)
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('product', 'title')

    res.status(201).json({
      id: populated._id.toString(),
      body: populated.body,
      createdAt: populated.createdAt,
      productId: populated.product._id.toString(),
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
