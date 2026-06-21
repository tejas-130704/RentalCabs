import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'node:path'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Resolve the SQLite file path
  // DATABASE_URL format: "file:./prisma/dev.db" or just a path
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  
  let dbPath: string
  if (rawUrl.startsWith('file:')) {
    // Strip the "file:" prefix and resolve relative to project root
    const relativePath = rawUrl.slice('file:'.length)
    dbPath = path.resolve(process.cwd(), relativePath)
  } else {
    dbPath = path.resolve(process.cwd(), rawUrl)
  }

  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`
  })

  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // Try to enable WAL mode for better concurrency
  client.$executeRawUnsafe('PRAGMA journal_mode = WAL;').catch((err) => {
    console.error('Failed to set WAL mode:', err)
  })

  return client
}

export const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

