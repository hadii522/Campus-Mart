import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from './models/User.js'
import Product from './models/Product.js'
import { connectDb } from './config/db.js'
import { listingImages } from './seedImages.js'

const demoEmail = 'demo.student@lhr.nu.edu.pk'
const adminEmail = 'admin@lhr.nu.edu.pk'

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Set MONGODB_URI in .env')
    process.exit(1)
  }
  await connectDb(uri)

  await Product.deleteMany({})
  await User.deleteMany({})

  const demoHash = await bcrypt.hash('demo123', 10)
  const adminHash = await bcrypt.hash('Admin123!', 10)

  const demo = await User.create({
    name: 'Demo Student',
    email: demoEmail,
    phone: '+92 300 0000000',
    department: 'Computer Science',
    passwordHash: demoHash,
    role: 'user',
  })

  await User.create({
    name: 'Campus Admin',
    email: adminEmail,
    phone: '',
    department: 'Administration',
    passwordHash: adminHash,
    role: 'admin',
  })

  const rows = [
    {
      title: 'Data Structures & Algorithms (3rd ed.)',
      description: 'Light wear on corners; no highlights.',
      price: 2800,
      category: 'BOOKS',
      imageUrl: listingImages.dataStructuresBook,
    },
    {
      title: 'Calculus lecture notes (full semester)',
      description: 'Summaries + past paper solutions.',
      price: 450,
      category: 'NOTES',
      imageUrl: listingImages.calculusNotes,
    },
    {
      title: 'Wireless mouse + pad',
      description: 'Battery included.',
      price: 1200,
      category: 'GADGETS',
      imageUrl: listingImages.wirelessMouse,
    },
  ]

  for (const r of rows) {
    await Product.create({ ...r, seller: demo._id })
  }

  console.log('Seed OK')
  console.log('  Demo:', demoEmail, '/ demo123')
  console.log('  Admin:', adminEmail, '/ Admin123!')
  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
