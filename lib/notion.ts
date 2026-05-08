/**
 * Notion API 클라이언트 초기화 및 데이터 조회 함수
 * 읽기 전용으로 사용하며, 서버 사이드에서만 호출됩니다.
 */

import { Client, isFullPage } from "@notionhq/client"
import type {
  PageObjectResponse,
  QueryDataSourceResponse,
} from "@notionhq/client"
import type { Asset, MonthlyRecord, Goal, AssetType } from "@/types/notion"

// Notion 클라이언트 싱글톤 인스턴스
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 환경 변수 검증 헬퍼
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`환경 변수 ${key}가 설정되지 않았습니다.`)
  }
  return value
}

// --- Notion 속성 추출 헬퍼 ---

/** Title 속성 추출 */
function extractTitle(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") ?? ""
  }
  return ""
}

/** Number 속성 추출 */
function extractNumber(page: PageObjectResponse, key: string): number {
  const prop = page.properties[key]
  if (prop?.type === "number") {
    return prop.number ?? 0
  }
  return 0
}

/** Select 속성 추출 */
function extractSelect(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (prop?.type === "select") {
    return prop.select?.name ?? ""
  }
  return ""
}

/** Date 속성 추출 */
function extractDate(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (prop?.type === "date") {
    return prop.date?.start ?? ""
  }
  return ""
}

// --- 데이터 조회 함수 ---

/**
 * 자산 목록 조회
 * Notion assets DB에서 모든 자산 데이터를 가져옵니다.
 */
export async function getAssets(): Promise<Asset[]> {
  const databaseId = getRequiredEnv("NOTION_ASSETS_DB_ID")

  const response: QueryDataSourceResponse = await notion.dataSources.query({
    data_source_id: databaseId,
    sorts: [{ property: "자산명", direction: "ascending" }],
  })

  return response.results
    .filter(isFullPage)
    .map((page: PageObjectResponse) => ({
      id: page.id,
      name: extractTitle(page, "자산명"),
      amount: extractNumber(page, "금액"),
      type: extractSelect(page, "자산유형") as AssetType,
      returnRate: extractNumber(page, "수익률"),
    }))
}

/**
 * 월별 기록 조회
 * Notion monthly_records DB에서 월별 자산 기록을 가져옵니다.
 * 최신순으로 정렬하여 반환합니다.
 */
export async function getMonthlyRecords(): Promise<MonthlyRecord[]> {
  const databaseId = getRequiredEnv("NOTION_MONTHLY_RECORDS_DB_ID")

  const response: QueryDataSourceResponse = await notion.dataSources.query({
    data_source_id: databaseId,
    sorts: [{ property: "월", direction: "ascending" }],
  })

  return response.results
    .filter(isFullPage)
    .map((page: PageObjectResponse) => ({
      id: page.id,
      month: extractDate(page, "월"),
      totalAssets: extractNumber(page, "총자산"),
      savings: extractNumber(page, "저축액"),
      investmentReturn: extractNumber(page, "투자수익"),
    }))
}

/**
 * 목표 설정 조회
 * Notion goals DB에서 FIRE 목표 데이터를 가져옵니다.
 * 첫 번째 레코드를 사용합니다.
 */
export async function getGoal(): Promise<Goal | null> {
  const databaseId = getRequiredEnv("NOTION_GOALS_DB_ID")

  const response: QueryDataSourceResponse = await notion.dataSources.query({
    data_source_id: databaseId,
    page_size: 1,
  })

  const pages = response.results.filter(isFullPage)

  if (pages.length === 0) return null

  const page = pages[0]
  return {
    id: page.id,
    targetAmount: extractNumber(page, "목표금액"),
    monthlyExpense: extractNumber(page, "월간생활비"),
  }
}

/**
 * 자산 유형별 합계 계산
 */
export function aggregateAssetsByType(
  assets: Asset[]
): Record<AssetType, number> {
  return assets.reduce(
    (acc, asset) => {
      acc[asset.type] = (acc[asset.type] ?? 0) + asset.amount
      return acc
    },
    {} as Record<AssetType, number>
  )
}

/**
 * FIRE 달성률 계산
 * - 달성률 = 총자산 / 목표금액 × 100
 * - FIRE 배수 = 총자산 / (월간생활비 × 12)
 */
export function calculateFireProgress(
  totalAssets: number,
  targetAmount: number,
  monthlyExpense: number
) {
  const achievementRate =
    targetAmount > 0 ? (totalAssets / targetAmount) * 100 : 0
  const fireMultiple =
    monthlyExpense > 0 ? totalAssets / (monthlyExpense * 12) : 0
  const remainingAmount = Math.max(0, targetAmount - totalAssets)

  return {
    totalAssets,
    targetAmount,
    achievementRate: Math.min(100, achievementRate),
    fireMultiple,
    remainingAmount,
    monthlyExpense,
  }
}
