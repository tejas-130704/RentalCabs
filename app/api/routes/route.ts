import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('API endpoint removed. Routes are now static.', { status: 410 })
}
