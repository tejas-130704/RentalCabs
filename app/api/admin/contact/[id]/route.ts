import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { updateContactMessage, deleteContactMessage } from '@/lib/contact-db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const { name, whatsapp, message } = await request.json()

    if (!name || !whatsapp || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const updated = await updateContactMessage(id, name, whatsapp, message)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('Admin update message error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    await deleteContactMessage(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin delete message error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
