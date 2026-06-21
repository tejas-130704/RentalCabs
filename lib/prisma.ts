import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'node:path'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  // Strip the "file:" prefix that Prisma uses for SQLite URLs
  const relativePath = rawUrl.startsWith('file:') ? rawUrl.slice('file:'.length) : rawUrl
  const dbPath = path.resolve(process.cwd(), relativePath)

  const db = new Database(dbPath)
  const adapter = new PrismaBetterSqlite3(db)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
