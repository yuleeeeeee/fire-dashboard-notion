/**
 * 전역 로딩 UI
 * 서버 컴포넌트 데이터 로딩 중 표시됩니다.
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8 animate-pulse">
        {/* 페이지 제목 스켈레톤 */}
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted" />
        </div>

        {/* 프로그레스바 스켈레톤 */}
        <div className="h-32 rounded-xl bg-muted" />

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted" />
          ))}
        </div>

        {/* 차트 스켈레톤 */}
        <div className="h-80 rounded-xl bg-muted" />
      </div>
    </div>
  )
}
