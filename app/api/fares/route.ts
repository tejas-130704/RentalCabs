import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('API endpoint removed. Fares are now static.', { status: 410 })
}
