/**
 * Notion CMS 데이터 타입 정의
 * PRD의 Notion DB 구조를 기반으로 작성
 */

/** 자산 유형 */
export type AssetType = "현금" | "주식" | "ETF" | "부동산" | "기타"

/** 자산 목록 DB 항목 */
export interface Asset {
  id: string
  /** 자산명 (Title) */
  name: string
  /** 현재 평가금액 (원) */
  amount: number
  /** 자산 유형 */
  type: AssetType
  /** 연환산 수익률 (%) */
  returnRate: number
}

/** 월별 기록 DB 항목 */
export interface MonthlyRecord {
  id: string
  /** 기록 기준 월 (YYYY-MM-01) */
  month: string
  /** 해당 월 말 총자산 (원) */
  totalAssets: number
  /** 해당 월 저축 금액 (원) */
  savings: number
  /** 해당 월 투자손익 (원) */
  investmentReturn: number
}

/** 목표 설정 DB 항목 */
export interface Goal {
  id: string
  /** FIRE 달성 목표 자산 (원) */
  targetAmount: number
  /** 은퇴 후 월 생활비 (원) */
  monthlyExpense: number
}

/** FIRE 계산 결과 */
export interface FireCalculation {
  /** 현재 총자산 (원) */
  totalAssets: number
  /** 목표 금액 (원) */
  targetAmount: number
  /** 달성률 (%) */
  achievementRate: number
  /** FIRE 배수 (총자산 / 연간생활비) */
  fireMultiple: number
  /** 목표까지 남은 금액 (원) */
  remainingAmount: number
  /** 월간 생활비 (원) */
  monthlyExpense: number
}

/** API 응답 공통 타입 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}
