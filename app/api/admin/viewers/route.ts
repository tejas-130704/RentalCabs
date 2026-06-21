import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { visitorLog } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'
import { gte, countDistinct, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Default fallbacks in case the visitor_log table is not migrated yet
    let totalUnique = 0
    let todayUnique = 0
    let dailyStats: any[] = []
    let recentHits: any[] = []

    try {
      // 1. Total unique devices
      const [totalRow] = await db
        .select({ count: countDistinct(visitorLog.ipHash) })
        .from(visitorLog)
      totalUnique = totalRow?.count || 0

      // 2. Today's unique devices
      const [todayRow] = await db
        .select({ count: countDistinct(visitorLog.ipHash) })
        .from(visitorLog)
        .where(gte(visitorLog.visitedAt, todayStart))
      todayUnique = todayRow?.count || 0

      // 3. Daily unique devices for the last 30 days
      const thirtyDaysAgo = new Date(todayStart)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

      const recentLogs = await db
        .select({
          ipHash: visitorLog.ipHash,
          userAgent: visitorLog.userAgent,
          visitedAt: visitorLog.visitedAt,
        })
        .from(visitorLog)
        .where(gte(visitorLog.visitedAt, thirtyDaysAgo))
        .orderBy(desc(visitorLog.visitedAt))

      // Group by date (YYYY-MM-DD) and count unique ipHash values per day
      const dailyUniqueMap: Record<string, Set<string>> = {}
      
      // Initialize map for all 30 days so we have entries for zero-visitor days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(todayStart)
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD
        dailyUniqueMap[dateString] = new Set<string>()
      }

      for (const log of recentLogs) {
        const dateString = new Date(log.visitedAt).toISOString().split('T')[0]
        if (dailyUniqueMap[dateString]) {
          dailyUniqueMap[dateString].add(log.ipHash)
        }
      }

      dailyStats = Object.keys(dailyUniqueMap)
        .sort()
        .map((dateStr) => ({
          date: dateStr,
          formattedDate: new Date(dateStr).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          }),
          uniqueDevices: dailyUniqueMap[dateStr].size,
        }))

      // 4. Detailed recent hits (last 50 hits)
      recentHits = recentLogs.slice(0, 50).map((log, idx) => {
        const ua = log.userAgent || ''
        let device = 'Desktop'
        if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
          device = 'Mobile'
        } else if (/tablet|playbook|silk/i.test(ua)) {
          device = 'Tablet'
        }

        let browser = 'Other'
        if (/chrome|crios/i.test(ua)) {
          browser = 'Chrome'
        } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
          browser = 'Safari'
        } else if (/firefox|iceweasel/i.test(ua)) {
          browser = 'Firefox'
        } else if (/edge|edg/i.test(ua)) {
          browser = 'Edge'
        }

        return {
          id: `${log.visitedAt.getTime()}-${idx}`,
          device,
          browser,
          visitedAt: log.visitedAt,
          userAgent: log.userAgent,
        }
      })
    } catch (dbError: any) {
      console.warn('Database queries failed for viewers. Returning default zeros:', dbError.message || dbError)
      // Populate 30 days with zeros so the chart and cards render normally
      for (let i = 29; i >= 0; i--) {
        const date = new Date(todayStart)
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split('T')[0]
        dailyStats.push({
          date: dateString,
          formattedDate: date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          }),
          uniqueDevices: 0,
        })
      }
    }

    return NextResponse.json({
      totalUnique,
      todayUnique,
      dailyStats,
      recentHits,
    })
  } catch (error) {
    console.error('Failed to fetch viewers analytics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
