"use client"

/**
 * 월별 총자산 추이 라인 차트 컴포넌트
 * Recharts 기반, 클라이언트 컴포넌트
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatKRW, formatMonth } from "@/lib/utils"
import type { MonthlyRecord } from "@/types/notion"

interface AssetTrendChartProps {
  records: MonthlyRecord[]
}

/** Recharts 커스텀 툴팁 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <p className="font-medium mb-1">{label}</p>
      <p className="text-primary">{formatKRW(payload[0].value)}</p>
    </div>
  )
}

export function AssetTrendChart({ records }: AssetTrendChartProps) {
  // Recharts에 전달할 데이터 변환
  const chartData = records.map((record) => ({
    month: formatMonth(record.month),
    totalAssets: record.totalAssets,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        월별 기록 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card">
      <h2 className="text-lg font-semibold">월별 총자산 추이</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => formatKRW(value)}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalAssets"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
