/**
 * 자산 목록 API 엔드포인트
 * GET /api/assets
 * 1시간 캐시 적용 (Notion API 요청 횟수 최소화)
 */

import { NextResponse } from "next/server"
import { getAssets, aggregateAssetsByType } from "@/lib/notion"

export async function GET() {
  try {
    const assets = await getAssets()
    const byType = aggregateAssetsByType(assets)
    const totalAmount = assets.reduce((sum, a) => sum + a.amount, 0)

    return NextResponse.json({
      success: true,
      data: { assets, byType, totalAmount },
    })
  } catch (error) {
    console.error("[API /assets] 자산 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "자산 데이터를 불러오는 데 실패했습니다." },
      { status: 500 }
    )
  }
}
