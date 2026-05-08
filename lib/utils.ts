/**
 * 공통 유틸리티 함수
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Tailwind 클래스 병합 헬퍼 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 숫자를 한국 원화 형식으로 포맷
 * @example formatKRW(12345678) → "1,234만 5,678원"
 */
export function formatKRW(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = Math.floor(amount / 100_000_000)
    const remainder = amount % 100_000_000
    if (remainder === 0) return `${eok.toLocaleString("ko-KR")}억원`
    const man = Math.floor(remainder / 10_000)
    if (man === 0) return `${eok.toLocaleString("ko-KR")}억원`
    return `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`
  }
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000)
    return `${man.toLocaleString("ko-KR")}만원`
  }
  return `${amount.toLocaleString("ko-KR")}원`
}

/**
 * 숫자를 소수점 포함 원화 형식으로 포맷 (정밀 표시용)
 * @example formatKRWFull(12345678) → "12,345,678원"
 */
export function formatKRWFull(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`
}

/**
 * 달성률을 퍼센트 문자열로 포맷
 * @example formatPercent(73.456) → "73.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * YYYY-MM-DD 날짜를 "YYYY년 MM월" 형식으로 포맷
 * @example formatMonth("2025-01-01") → "2025년 1월"
 */
export function formatMonth(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}
