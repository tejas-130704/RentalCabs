import { prisma } from './prisma'

export async function initContactDb() {
  // Check if the old 'email' column exists in ContactMessage table.
  // If so, drop the table to recreate it fresh with the correct schema.
  try {
    const columns = await prisma.$queryRawUnsafe<any[]>('PRAGMA table_info(ContactMessage)')
    if (columns && columns.length > 0) {
      const hasEmail = columns.some((col: any) => col.name === 'email')
      if (hasEmail) {
        console.log('Dropping old ContactMessage table containing "email" column...')
        await prisma.$executeRawUnsafe('DROP TABLE ContactMessage')
      }
    }
  } catch (e) {
    // Table doesn't exist yet or query failed, which is safe to ignore
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ContactMessage (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      whatsapp TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function createContactMessage(name: string, whatsapp: string, message: string) {
  await initContactDb()
  const id = 'msg_' + Math.random().toString(36).substr(2, 9)
  const createdAt = new Date().toISOString()
  
  await prisma.$executeRawUnsafe(
    'INSERT INTO ContactMessage (id, name, whatsapp, message, createdAt) VALUES (?, ?, ?, ?, ?)',
    id,
    name,
    whatsapp,
    message,
    createdAt
  )
  
  return { id, name, whatsapp, message, createdAt }
}

export async function getContactMessages() {
  await initContactDb()
  const messages = await prisma.$queryRawUnsafe<any[]>(
    'SELECT * FROM ContactMessage ORDER BY createdAt DESC'
  )
  return messages || []
}

export async function updateContactMessage(id: string, name: string, whatsapp: string, message: string) {
  await initContactDb()
  await prisma.$executeRawUnsafe(
    'UPDATE ContactMessage SET name = ?, whatsapp = ?, message = ? WHERE id = ?',
    name,
    whatsapp,
    message,
    id
  )
  return { id, name, whatsapp, message }
}

export async function deleteContactMessage(id: string) {
  await initContactDb()
  await prisma.$executeRawUnsafe('DELETE FROM ContactMessage WHERE id = ?', id)
}
