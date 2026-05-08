/**
 * 분석 페이지 (/analysis)
 * - 자산 구성 비율 파이 차트
 * - 저축액 vs 투자수익 월별 비교 바 차트
 *
 * PRD MVP 이후 범위 (Phase 3 이후 구현)
 * 현재는 Coming Soon 플레이스홀더를 표시합니다.
 */

import type { Metadata } from "next"
import { BarChart2 } from "lucide-react"

export const metadata: Metadata = {
  title: "분석",
}

export default function AnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        {/* 페이지 제목 */}
        <div>
          <h1 className="text-2xl font-bold">분석</h1>
          <p className="text-muted-foreground text-sm mt-1">
            자산 구성 비율 및 월별 저축/투자 현황을 분석합니다.
          </p>
        </div>

        {/* Coming Soon 플레이스홀더 */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-16 text-center">
          <BarChart2 className="size-12 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">준비 중</h2>
            <p className="text-sm text-muted-foreground">
              파이 차트 및 저축/투자 비교 바 차트가 곧 추가됩니다.
            </p>
          </div>
          <ul className="text-sm text-muted-foreground text-left list-disc list-inside">
            <li>자산 구성 비율 파이 차트</li>
            <li>저축액 vs 투자수익 월별 비교 바 차트</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
