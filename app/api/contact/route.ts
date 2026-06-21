import { NextRequest, NextResponse } from 'next/server'
import { createContactMessage } from '@/lib/contact-db'

export async function POST(request: NextRequest) {
  try {
    const { name, whatsapp, message } = await request.json()

    if (!name || !whatsapp || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const newMessage = await createContactMessage(name, whatsapp, message)

    return NextResponse.json({ success: true, data: newMessage })
  } catch (error: any) {
    console.error('Contact submit error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
