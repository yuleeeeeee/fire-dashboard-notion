/**
 * 목표 설정 및 FIRE 계산 API 엔드포인트
 * GET /api/goals
 * 총자산, 목표 금액, FIRE 달성률을 함께 반환합니다.
 * 1시간 캐시 적용 (Notion API 요청 횟수 최소화)
 */

import { NextResponse } from "next/server"
import { getGoal, getAssets, calculateFireProgress } from "@/lib/notion"

export async function GET() {
  try {
    // 목표와 자산 데이터를 병렬로 조회하여 성능 최적화
    const [goal, assets] = await Promise.all([getGoal(), getAssets()])

    if (!goal) {
      return NextResponse.json(
        { success: false, error: "목표 데이터가 설정되지 않았습니다." },
        { status: 404 }
      )
    }

    const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0)
    const fireCalculation = calculateFireProgress(
      totalAssets,
      goal.targetAmount,
      goal.monthlyExpense
    )

    return NextResponse.json({
      success: true,
      data: { goal, fireCalculation },
    })
  } catch (error) {
    console.error("[API /goals] 목표 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "목표 데이터를 불러오는 데 실패했습니다." },
      { status: 500 }
    )
  }
}
