/**
 * 월별 기록 API 엔드포인트
 * GET /api/monthly-records
 * 1시간 캐시 적용 (Notion API 요청 횟수 최소화)
 */

import { NextResponse } from "next/server"
import { getMonthlyRecords } from "@/lib/notion"

export async function GET() {
  try {
    const records = await getMonthlyRecords()

    return NextResponse.json({
      success: true,
      data: records,
    })
  } catch (error) {
    console.error("[API /monthly-records] 월별 기록 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "월별 기록을 불러오는 데 실패했습니다." },
      { status: 500 }
    )
  }
}
