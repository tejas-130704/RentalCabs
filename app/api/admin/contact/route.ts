import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getContactMessages, createContactMessage } from '@/lib/contact-db'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const messages = await getContactMessages()
    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Admin fetch messages error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, whatsapp, message } = await request.json()
    if (!name || !whatsapp || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const newMessage = await createContactMessage(name, whatsapp, message)
    return NextResponse.json({ success: true, data: newMessage })
  } catch (error: any) {
    console.error('Admin create message error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
