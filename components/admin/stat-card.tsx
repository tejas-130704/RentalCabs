import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  highlight?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ icon: Icon, label, value, highlight, trend }: StatCardProps) {
  return (
    <div className={`rounded-xl p-6 flex flex-col ${highlight ? 'bg-accent/20 border-2 border-accent' : 'bg-white border border-border'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-full ${highlight ? 'bg-accent' : 'bg-primary/10'}`}>
          <Icon className={`w-6 h-6 ${highlight ? 'text-primary' : 'text-primary'}`} />
        </div>
      </div>

      <p className="text-text-muted text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>

      {trend && (
        <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last period
        </p>
      )}
    </div>
  )
}
