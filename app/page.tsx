import type { Metadata } from "next"
import { TrendingUp, Target, Percent, BarChart2 } from "lucide-react"
import {
  getAssets,
  getGoal,
  getMonthlyRecords,
  calculateFireProgress,
} from "@/lib/notion"
import { formatKRW, formatPercent } from "@/lib/utils"
import { FireProgressBar } from "@/components/dashboard/FireProgressBar"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { AssetTrendChart } from "@/components/dashboard/AssetTrendChart"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "대시보드",
}

export default async function DashboardPage() {
  const [assets, goal, monthlyRecords] = await Promise.all([
    getAssets(),
    getGoal(),
    getMonthlyRecords(),
  ])

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0)

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <p className="text-muted-foreground text-center">
          Notion goals DB에 목표 데이터를 추가해주세요.
        </p>
      </div>
    )
  }

  const fireCalc = calculateFireProgress(
    totalAssets,
    goal.targetAmount,
    goal.monthlyExpense
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">FIRE 달성 현황</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Notion에서 최신 데이터를 가져와 표시합니다.
          </p>
        </div>

        <FireProgressBar data={fireCalc} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="총자산"
            value={formatKRW(totalAssets)}
            icon={TrendingUp}
            highlight
          />
          <MetricCard
            title="목표금액"
            value={formatKRW(goal.targetAmount)}
            icon={Target}
          />
          <MetricCard
            title="달성률"
            value={formatPercent(fireCalc.achievementRate)}
            description="목표 대비 현재 자산 비율"
            icon={Percent}
          />
          <MetricCard
            title="FIRE 배수"
            value={`${fireCalc.fireMultiple.toFixed(1)}배`}
            description="총자산 / 연간생활비"
            icon={BarChart2}
          />
        </div>

        <AssetTrendChart records={monthlyRecords} />
      </div>
    </div>
  )
}
