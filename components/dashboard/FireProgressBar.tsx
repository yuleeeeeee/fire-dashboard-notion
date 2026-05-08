/**
 * FIRE 달성률 프로그레스바 컴포넌트
 * 총자산 / 목표금액 비율을 시각적으로 표시합니다.
 */

import { formatKRW, formatPercent } from "@/lib/utils"
import type { FireCalculation } from "@/types/notion"

interface FireProgressBarProps {
  data: FireCalculation
}

export function FireProgressBar({ data }: FireProgressBarProps) {
  const { achievementRate, totalAssets, targetAmount, remainingAmount } = data
  // 진행바 너비는 최대 100%로 제한
  const barWidth = Math.min(100, Math.max(0, achievementRate))

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">FIRE 달성률</h2>
        <span className="text-3xl font-bold text-primary">
          {formatPercent(achievementRate)}
        </span>
      </div>

      {/* 프로그레스바 */}
      <div className="relative h-6 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${barWidth}%` }}
          role="progressbar"
          aria-valuenow={achievementRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`FIRE 달성률 ${formatPercent(achievementRate)}`}
        />
      </div>

      {/* 금액 정보 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>현재: {formatKRW(totalAssets)}</span>
        <span>목표: {formatKRW(targetAmount)}</span>
      </div>

      {/* 남은 금액 */}
      {remainingAmount > 0 && (
        <p className="text-sm text-muted-foreground">
          목표까지{" "}
          <span className="font-medium text-foreground">
            {formatKRW(remainingAmount)}
          </span>{" "}
          남았습니다.
        </p>
      )}
      {remainingAmount === 0 && (
        <p className="text-sm font-medium text-primary">
          FIRE 목표를 달성했습니다!
        </p>
      )}
    </div>
  )
}
