import { db } from './db'
import { contactMessage } from './db/schema'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function createContactMessage(name: string, whatsapp: string, message: string) {
  const id = nanoid()
  const [msg] = await db
    .insert(contactMessage)
    .values({ id, name, whatsapp, message })
    .returning()
  return msg
}

export async function getContactMessages() {
  return db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt))
}

export async function updateContactMessage(
  id: string,
  name: string,
  whatsapp: string,
  message: string
) {
  const [updated] = await db
    .update(contactMessage)
    .set({ name, whatsapp, message, updatedAt: new Date() })
    .where(eq(contactMessage.id, id))
    .returning()
  return updated
}

export async function deleteContactMessage(id: string) {
  await db.delete(contactMessage).where(eq(contactMessage.id, id))
}
