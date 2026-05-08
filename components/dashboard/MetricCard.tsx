/**
 * 핵심 지표 카드 컴포넌트
 * 총자산, 목표금액, 달성률, FIRE 배수 등 단일 지표를 표시합니다.
 */

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  /** 지표 제목 */
  title: string
  /** 표시할 값 */
  value: string
  /** 부가 설명 (선택) */
  description?: string
  /** Lucide 아이콘 컴포넌트 (선택) */
  icon?: LucideIcon
  /** 값 색상 강조 여부 */
  highlight?: boolean
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  highlight = false,
}: MetricCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border bg-card">
      {/* 아이콘 + 제목 */}
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-4" />}
        <span className="text-sm font-medium">{title}</span>
      </div>

      {/* 수치 */}
      <p className={cn("text-2xl font-bold", highlight && "text-primary")}>
        {value}
      </p>

      {/* 부가 설명 */}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
