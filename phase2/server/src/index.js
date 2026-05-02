import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

const uploadsDir = path.join(__dirname, '../uploads')
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'CampusMart API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/messages', messageRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  const msg = err.message === 'Only image files allowed' ? err.message : 'Server error'
  res.status(err.status || 500).json({ error: msg })
})

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Missing MONGODB_URI in .env')
    process.exit(1)
  }
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET in .env')
    process.exit(1)
  }
  await connectDb(uri)
  app.listen(PORT, () => {
    console.log(`CampusMart API http://localhost:${PORT}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
