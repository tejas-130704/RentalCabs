import path from 'node:path'
import { defineConfig } from 'prisma/config'
import Database from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
      const relativePath = rawUrl.startsWith('file:') ? rawUrl.slice('file:'.length) : rawUrl
      const dbPath = path.resolve(process.cwd(), relativePath)
      const db = new Database(dbPath)
      return new PrismaBetterSqlite3(db)
    },
  },
})
