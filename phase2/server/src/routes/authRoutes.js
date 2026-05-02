import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'
import { isFastLahoreEmail } from '../utils/email.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, department, password } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }
    if (!isFastLahoreEmail(email)) {
      return res.status(400).json({ error: 'Email must end with @lhr.nu.edu.pk' })
    }
    const exists = await User.findOne({ email: email.trim().toLowerCase() })
    if (exists) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(String(password), 10)
    const user = await User.create({
      name: String(name).trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone || '').trim(),
      department: String(department || '').trim(),
      passwordHash,
      role: 'user',
    })

    const token = signToken(user._id.toString(), user.role)
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    const user = await User.findOne({ email: String(email).trim().toLowerCase() })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    const token = signToken(user._id.toString(), user.role)
    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

router.delete('/account', authRequired, async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default
    const Message = (await import('../models/Message.js')).default
    await Message.deleteMany({ $or: [{ from: req.userId }, { to: req.userId }] })
    await Product.deleteMany({ seller: req.userId })
    await User.findByIdAndDelete(req.userId)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not delete account' })
  }
})

export default router
