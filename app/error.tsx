"use client"

/**
 * 전역 에러 바운더리
 * 서버 컴포넌트에서 발생한 에러를 클라이언트에서 처리합니다.
 */

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로그 (프로덕션에서는 Sentry 등 연동 권장)
    console.error("[ErrorBoundary]", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-xl font-semibold">오류가 발생했습니다</h2>
        <p className="text-sm text-muted-foreground">
          데이터를 불러오는 중 문제가 발생했습니다. Notion API 키와 DB ID 설정을
          확인해주세요.
        </p>
        {error.message && (
          <code className="text-xs bg-muted rounded px-2 py-1">
            {error.message}
          </code>
        )}
        <button
          onClick={reset}
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
