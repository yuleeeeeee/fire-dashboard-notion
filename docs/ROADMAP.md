# FIRE 달성 계산기 개발 로드맵

**프로젝트:** FIRE Progress Dashboard  
**최초 작성일:** 2026-05-08  
**기준 버전:** PRD v1.0

---

## 프로젝트 개요

Notion을 CMS로 활용하여 FIRE(Financial Independence, Retire Early) 달성 현황을 시각화하는 개인 자산 관리 대시보드입니다. 비개발자도 Notion에서 직접 데이터를 입력·수정할 수 있어 별도의 어드민 UI가 필요 없다는 것이 핵심 가치입니다.

**핵심 가치 제안:**
- Notion 기반 데이터 입력으로 개발 없이 자산 데이터 관리 가능
- FIRE 달성률, FIRE 배수 등 핵심 지표를 한눈에 파악
- 월별 자산 추이를 시각화하여 목표 달성 진행 상황 추적

---

## 성공 지표 (KPIs)

| 지표 | 기준값 | 측정 방법 |
|------|--------|-----------|
| Notion API 응답 시간 | 3초 이내 (캐시 히트 시 100ms 이내) | 브라우저 Network 탭 |
| 페이지 LCP | 2.5초 이내 | Lighthouse / Vercel Analytics |
| 반응형 지원 범위 | 375px ~ 1280px | 브라우저 DevTools 시뮬레이션 |
| Notion API 캐시 갱신 주기 | 1시간 | `revalidate` 설정값 검증 |
| 타입 오류 | 0건 | `tsc --noEmit` CI 통과 |

---

## 기술 아키텍처

### 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js | **16.2.4** |
| 언어 | TypeScript | ^5 |
| 스타일링 | Tailwind CSS | ^4 |
| UI 컴포넌트 | shadcn/ui + @base-ui/react | shadcn ^4.6.0 |
| 차트 | Recharts | ^3.8.1 |
| 아이콘 | Lucide React | ^1.14.0 |
| CMS | Notion API (@notionhq/client) | ^5.20.0 |
| 런타임 | React | 19.2.4 |

> **중요 — Breaking Changes 주의:**  
> 이 프로젝트는 **Next.js 16.2.4** 를 사용합니다. 학습 데이터나 공개 문서와 다른 API 및 컨벤션이 존재할 수 있습니다. 코드 작성 전 반드시 `node_modules/next/dist/docs/` 하위 문서를 확인하십시오.
>
> - 라우트 핸들러: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
> - 데이터 캐싱: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`
> - 재검증: `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
> - 환경 변수: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
>
> `@notionhq/client` v5는 `databases.query()` 대신 `dataSources.query()` API를 사용합니다. 기존 코드 예제와 다르므로 `lib/notion.ts`를 반드시 참조하십시오.

### 시스템 구조

```
[브라우저] → [Next.js App Router (서버 컴포넌트)]
                        ↓
             [lib/notion.ts (Notion API 클라이언트)]
                        ↓
              [Notion API (읽기 전용)]
                        ↓
         [assets DB / monthly_records DB / goals DB]
```

### 디렉토리 구조

```
notion-cms-project/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Header, Footer 포함)
│   ├── page.tsx                # 메인 대시보드 (/)
│   ├── assets/page.tsx         # 자산 목록 (/assets)
│   ├── analysis/page.tsx       # 분석 페이지 (/analysis) — Phase 4
│   ├── loading.tsx             # 전역 로딩 UI
│   ├── error.tsx               # 전역 에러 UI
│   └── api/
│       ├── assets/route.ts
│       ├── monthly-records/route.ts
│       └── goals/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── FireProgressBar.tsx
│   │   ├── MetricCard.tsx
│   │   └── AssetTrendChart.tsx
│   └── analysis/               # Phase 4 추가 예정
│       ├── AssetPieChart.tsx
│       └── SavingsBarChart.tsx
├── lib/
│   ├── notion.ts               # Notion API 클라이언트 및 조회 함수
│   └── utils.ts                # 포맷 헬퍼 (formatKRW, formatPercent 등)
└── types/
    └── notion.ts               # Notion DB 타입 정의
```

---

## 전체 로드맵 요약

```
Phase 0  Phase 1  Phase 2  Phase 3  Phase 4   Phase 5
  완료      완료      완료      완료     진행예정    예정
   ▼         ▼         ▼        ▼         ▼        ▼
[서비스설정]→[골격]→[공통모듈]→[핵심기능]→[추가기능]→[최적화/배포]
```

| Phase | 이름 | 상태 | 예상 기간 |
|-------|------|------|-----------|
| Phase 0 | 외부 서비스 설정 | 완료 | 1일 |
| Phase 1 | 프로젝트 골격 구축 | 완료 | 0.5일 |
| Phase 2 | 공통 모듈 개발 | 완료 | 1일 |
| Phase 3 | 핵심 기능 개발 | 완료 | 2일 |
| Phase 4 | 추가 기능 개발 | 진행 예정 | 3~4일 |
| Phase 5 | 최적화 및 배포 | 예정 | 2일 |

---

## Phase 0: 외부 서비스 설정 (완료)

### 이 순서인 이유
환경 변수와 외부 API 연결이 검증되지 않은 상태에서 코드를 작성하면 이후 모든 작업이 불확실해집니다. Notion 연결이 실제로 동작하는지 먼저 확인해야 이후 개발이 결정론적으로 진행됩니다.

### 완료된 작업

- [x] 🔴 **Notion Integration 생성 및 API 키 발급** — `NOTION_API_KEY` 설정
- [x] 🔴 **3개 Notion DB 생성** — assets / monthly_records / goals
- [x] 🔴 **샘플 데이터 입력** — 각 DB에 테스트용 레코드 추가
- [x] 🔴 **환경 변수 설정** — `.env.local`에 DB ID 3개 등록
  - `NOTION_API_KEY`
  - `NOTION_ASSETS_DB_ID`
  - `NOTION_MONTHLY_RECORDS_DB_ID`
  - `NOTION_GOALS_DB_ID`

### 예상 소요 시간
1일

### 완료 기준 (달성)
- [x] Notion API 키로 HTTP 200 응답 확인
- [x] 각 DB에 샘플 레코드 1건 이상 존재
- [x] `.env.local` 환경 변수 4종 설정 완료

---

## Phase 1: 프로젝트 골격 구축 (완료)

### 이 순서인 이유
레이아웃과 설정 파일은 모든 페이지·컴포넌트가 공유합니다. 기능 개발 중간에 레이아웃 구조를 바꾸면 이미 작성된 모든 페이지를 수정해야 하므로, 골격을 먼저 확정하고 기능을 채워야 합니다.

### 완료된 작업

- [x] 🔴 **`next.config.ts` 보안 헤더 설정** — X-Frame-Options 등 4종
- [x] 🔴 **`app/layout.tsx` 루트 레이아웃** — Header, Footer 포함
- [x] 🟠 **`app/loading.tsx`** — 전역 로딩 UI
- [x] 🟠 **`app/error.tsx`** — 전역 에러 UI
- [x] 🟠 **`components/layout/Header.tsx`** — 상단 내비게이션
- [x] 🟠 **`components/layout/Footer.tsx`** — 하단 푸터

### 예상 소요 시간
0.5일

### 완료 기준 (달성)
- [x] `npm run dev` 실행 시 Header/Footer가 포함된 빈 페이지 에러 없이 기동
- [x] `/`, `/assets`, `/analysis` 경로 접속 시 공통 레이아웃 렌더링
- [x] 에러 발생 시 `error.tsx` UI 표시, 로딩 중 `loading.tsx` UI 표시

### 테스트 항목 (완료)

| 시나리오 | 합격 기준 |
|----------|-----------|
| 개발 서버 기동 | `npm run dev` 후 `http://localhost:3000` 접속 시 에러 없음 |
| 공통 레이아웃 | Header, Footer가 모든 페이지에 렌더링 |
| 에러 UI | 존재하지 않는 경로 접속 시 에러 UI 표시 |

---

## Phase 2: 공통 모듈 개발 (완료)

### 이 순서인 이유
타입 정의와 API 클라이언트는 모든 기능 컴포넌트가 `import`하는 기반입니다. 기능 개발 중에 타입이 바뀌면 이를 참조하는 컴포넌트 전체를 수정해야 합니다. 공통 모듈을 먼저 안정화하면 수정 범위가 `lib/`·`types/` 계층에만 한정됩니다.

### 완료된 작업

**타입 정의 (`types/notion.ts`)**
- [x] 🔴 **`Asset` / `MonthlyRecord` / `Goal` / `FireCalculation` 인터페이스**
- [x] 🔴 **`AssetType` 유니온 타입** — `현금 | 주식 | ETF | 부동산 | 기타`
- [x] 🟠 **`ApiResponse<T>` 공통 응답 타입**

**Notion API 클라이언트 (`lib/notion.ts`)**
- [x] 🔴 **Notion 클라이언트 초기화** — 싱글톤 패턴, `@notionhq/client` v5 기준 `dataSources.query()` 사용
- [x] 🔴 **`getAssets()`** — 자산 목록 조회 (자산명 오름차순 정렬)
- [x] 🔴 **`getMonthlyRecords()`** — 월별 기록 조회 (월 오름차순 정렬)
- [x] 🔴 **`getGoal()`** — 목표 설정 조회 (첫 번째 레코드)

**유틸 함수 (`lib/utils.ts`)**
- [x] 🟠 **`formatKRW()`** — 원화 포맷 (예: `10000000` → `"1,000만원"`)
- [x] 🟠 **`formatPercent()`** — 퍼센트 포맷
- [x] 🟠 **`formatMonth()`** — 월 포맷 (예: `"2026-01-01"` → `"2026년 1월"`)

### 예상 소요 시간
1일

### 완료 기준 (달성)
- [x] `tsc --noEmit` 타입 오류 0건
- [x] `getAssets()` 호출 시 `Asset[]` 타입 데이터 반환
- [x] `formatKRW(10000000)` 올바른 포맷 반환

### 테스트 항목 (완료)

| 시나리오 | 합격 기준 |
|----------|-----------|
| assets DB 연결 | `getAssets()` 반환 배열이 비어있지 않음 |
| monthly_records DB 연결 | `getMonthlyRecords()` 반환 배열이 비어있지 않음 |
| goals DB 연결 | `getGoal()` 반환값에 `목표금액`, `월간생활비` 필드 존재 |
| 환경 변수 누락 에러 | `NOTION_API_KEY` 제거 시 명확한 에러 메시지 출력 |

---

## Phase 3: 핵심 기능 개발 (완료)

### 이 순서인 이유
공통 타입과 API 클라이언트가 확정된 후 기능 컴포넌트를 조립해야 합니다. 이 시점에서는 `import` 경로와 타입이 안정적이므로 기능 코드에만 집중할 수 있습니다. 추가 기능(Phase 4)은 핵심 기능이 동작한다는 것이 검증된 이후에 붙여야 디버깅 범위를 좁힐 수 있습니다.

### 완료된 작업

**비즈니스 로직 (`lib/notion.ts`)**
- [x] 🔴 **`calculateFireProgress()`** — 달성률 / FIRE 배수 / 남은 금액 / 예상 달성 기간 계산
- [x] 🔴 **`aggregateAssetsByType()`** — 자산 유형별 합산

**API 라우트 (`app/api/`)**
- [x] 🟠 **`GET /api/assets`** — 자산 목록 + 유형별 합계 + 총합
- [x] 🟠 **`GET /api/monthly-records`** — 월별 기록 목록
- [x] 🟠 **`GET /api/goals`** — 목표 설정

**메인 대시보드 (`app/page.tsx`)**
- [x] 🔴 **서버 컴포넌트로 3개 API 병렬 호출** — `Promise.all()` 활용
- [x] 🔴 **`FireProgressBar`** — 대형 달성률 프로그레스바 (ARIA 접근성 포함)
- [x] 🔴 **`MetricCard`** — 총자산 / 목표금액 / 달성률 / FIRE 배수 카드 (2열×2행)
- [x] 🔴 **`AssetTrendChart`** — Recharts 라인 차트 (클라이언트 컴포넌트, 커스텀 툴팁)
- [x] 🟠 **Goal 미설정 시 빈 상태(Empty State) 처리**

**자산 목록 페이지 (`app/assets/page.tsx`)**
- [x] 🔴 **자산 테이블** — 자산명 / 금액 / 유형 / 수익률 / 비중
- [x] 🔴 **유형별 합계 카드** — 유형별 금액 및 비중 표시
- [x] 🟠 **수익률 색상 구분** — 양수(초록) / 음수(빨강)
- [x] 🟠 **데이터 없음 상태 처리**

### 예상 소요 시간
2일

### 완료 기준 (달성)
- [x] 메인 대시보드(`/`)에서 Notion 데이터 기반 FIRE 달성률 정상 표시
- [x] 자산 목록(`/assets`)에서 자산 테이블 및 유형별 합계 정상 표시
- [x] TypeScript 타입 오류 0건 (`tsc --noEmit` 통과)
- [x] 반응형 레이아웃 375px ~ 1280px 지원

### 테스트 항목 (완료)

> Playwright MCP (`mcp__playwright__*`) 사용. 미설정 시 `npx @playwright/mcp@latest` 설치 후 `~/.claude/settings.json`에 등록.

| 시나리오 | 합격 기준 |
|----------|-----------|
| 메인 대시보드 로드 | `http://localhost:3000` 접속 시 FIRE 달성률 프로그레스바 렌더링 |
| MetricCard 4종 표시 | 총자산 / 목표금액 / 달성률 / FIRE 배수 카드 모두 0 이외의 값 표시 |
| 라인 차트 렌더링 | `AssetTrendChart`에 월별 데이터 포인트 1개 이상 표시 |
| FIRE 계산 정확성 | `달성률 = 총자산 / 목표금액 × 100` 계산값과 화면 표시값 일치 |
| 자산 목록 테이블 | `/assets` 접속 시 자산 행 1개 이상 렌더링, 수익률 색상 구분 표시 |
| 유형별 합계 카드 | 자산 유형별 합계 카드가 테이블 위에 정상 표시 |
| 반응형 레이아웃 | 375px viewport에서 레이아웃 깨짐 없음 |

---

## Phase 4: 추가 기능 개발 (진행 예정)

### 이 순서인 이유
핵심 기능이 검증된 후에야 추가 기능을 안전하게 확장할 수 있습니다. `getAssets()`·`getMonthlyRecords()` 등 공통 함수가 이미 안정적으로 동작하므로 추가 기능은 이를 재사용하기만 하면 됩니다. 핵심 기능이 불안정한 상태에서 추가 기능을 붙이면 버그 원인을 특정하기 어려워집니다.

### 예상 소요 시간
3~4일

### 주요 기능

**자산 구성 비율 파이 차트**
- [ ] 🔴 **`components/analysis/AssetPieChart.tsx` 생성** — Recharts `PieChart` 활용
  - 담당: Frontend | 예상 소요: 4시간
  - Depends on: `aggregateAssetsByType()` (Phase 3 완료)
- [ ] 🟠 **파이 차트 커스텀 레이블** — 유형명 + 비중(%) 표시
  - 담당: Frontend | 예상 소요: 2시간
- [ ] 🟡 **파이 차트 범례** — 색상 코드 + 금액 표시
  - 담당: Frontend | 예상 소요: 1시간

**저축 vs 투자수익 바 차트**
- [ ] 🔴 **`components/analysis/SavingsBarChart.tsx` 생성** — Recharts `BarChart` 활용
  - 담당: Frontend | 예상 소요: 4시간
  - Depends on: `getMonthlyRecords()` (Phase 3 완료)
- [ ] 🟠 **바 차트 그룹형 표시** — 저축액(파랑) / 투자수익(초록) 월별 나란히 표시
  - 담당: Frontend | 예상 소요: 2시간
- [ ] 🟡 **투자수익 음수 시 색상 처리** — 손실 구간 빨강 표시
  - 담당: Frontend | 예상 소요: 1시간

**분석 페이지 통합 (`app/analysis/page.tsx`)**
- [ ] 🔴 **Coming Soon 플레이스홀더 제거 후 실제 차트 컴포넌트 연결**
  - 담당: Frontend | 예상 소요: 2시간
  - Depends on: AssetPieChart, SavingsBarChart 완성
- [ ] 🟠 **서버 컴포넌트에서 `getAssets()` + `getMonthlyRecords()` 병렬 호출**
  - 담당: Frontend | 예상 소요: 1시간
- [ ] 🟡 **차트 데이터 없음 상태 처리**
  - 담당: Frontend | 예상 소요: 1시간

**다크 모드**
- [ ] 🟠 **`next-themes` 기반 테마 Provider 설정** — 이미 `next-themes ^0.4.6` 설치됨
  - 담당: Frontend | 예상 소요: 3시간
  - 참고: `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- [ ] 🟡 **Header에 테마 전환 버튼 추가** — Lucide React `Sun`/`Moon` 아이콘
  - 담당: Frontend | 예상 소요: 1시간
  - Depends on: 다크 모드 Provider 설정
- [ ] 🟡 **Recharts 차트 다크 모드 색상 대응** — CSS 변수 기반 색상 적용
  - 담당: Frontend | 예상 소요: 2시간

**목표 시나리오 시뮬레이터**
- [ ] 🟡 **시뮬레이터 UI 컴포넌트** — 월 저축액 / 투자 수익률 변수 입력
  - 담당: Frontend | 예상 소요: 2시간
- [ ] 🟡 **달성 예상 기간 계산 로직** — 복리 계산 공식 적용 (⚠️ 공식 확인 필요)
  - 담당: Frontend / Backend | 예상 소요: 3시간
- [ ] 🟢 **시나리오별 자산 성장 프로젝션 라인 차트**
  - 담당: Frontend | 예상 소요: 3시간

### 완료 기준
- [ ] `/analysis` 페이지에서 파이 차트·바 차트 정상 렌더링
- [ ] 다크/라이트 모드 전환 시 모든 UI 요소 정상 표시
- [ ] 시뮬레이터 입력값 변경 시 결과 실시간 갱신
- [ ] 반응형 차트 — 모바일(375px)에서도 가독성 유지
- [ ] TypeScript 타입 오류 0건
- [ ] 아래 테스트 항목 전체 Playwright MCP 통과

### 테스트 항목

> `npm run dev` 기동 후 Playwright MCP로 수행. 구현 완료 직후 각 시나리오 실행, 실패 시 재구현 후 재수행.

| 시나리오 | 합격 기준 | 도구 |
|----------|-----------|------|
| `/analysis` 페이지 접속 | Coming Soon 대신 차트 2종 렌더링 | Playwright MCP 셀렉터 |
| 파이 차트 — 유형별 렌더링 | 자산 유형 수만큼 파이 조각 렌더링, 레이블 표시 | Playwright MCP 스크린샷 |
| 파이 차트 — 금액 합계 | 파이 차트 총합 = 자산 목록 총합 (±1원 허용) | Playwright MCP 콘솔 평가 |
| 바 차트 — 월별 데이터 | 저축액·투자수익 막대 월 수만큼 렌더링 | Playwright MCP 스크린샷 |
| 바 차트 — 음수 색상 | 투자수익 음수 구간 막대가 빨강으로 표시 | Playwright MCP 셀렉터 |
| 다크 모드 전환 | 테마 토글 클릭 후 배경·텍스트 다크 테마 적용 | Playwright MCP 스크린샷 |
| 시뮬레이터 입력 반응 | 월 저축액 변경 시 예상 달성 기간 실시간 갱신 | Playwright MCP 셀렉터 |
| 반응형 — 375px | 모바일 viewport에서 차트 잘림 없이 가독성 유지 | Playwright MCP 스크린샷 |

---

## Phase 5: 최적화 및 배포 (예정)

### 이 순서인 이유
기능이 확정되지 않은 상태에서 최적화하면 변경될 코드에 비용을 낭비합니다. 모든 기능이 완성되고 테스트를 통과한 후 실제 병목을 측정하고 개선하는 것이 원칙입니다. 배포는 최적화 이후 프로덕션 환경에서 최종 검증하는 단계입니다.

### 예상 소요 시간
2일

### 주요 작업

**성능 최적화**
- [ ] 🟠 **`revalidate = 3600` 캐시 전략 전환** — 현재 `force-dynamic`에서 교체
  - 담당: Backend | 예상 소요: 2시간
  - 참고: `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
  - ⚠️ 데이터 갱신 반영에 최대 1시간 지연 발생 — 이해관계자 확인 필요
- [ ] 🟡 **Next.js `<Image>` 최적화 적용** — 이미지 추가 시 적용
  - 담당: Frontend | 예상 소요: 1시간

**접근성 강화**
- [ ] 🟡 **차트 컴포넌트 ARIA 레이블 추가** — 스크린 리더 대응
  - 담당: Frontend | 예상 소요: 2시간
- [ ] 🟢 **키보드 내비게이션 검증** — Tab 순서 및 포커스 트랩 확인
  - 담당: Frontend | 예상 소요: 1시간

**기술 부채 해소**
- [ ] 🟡 **Notion 필드명 상수 파일 분리** — `lib/constants.ts` 또는 인라인 상수
  - 담당: Frontend | 예상 소요: 1시간
- [ ] 🟢 **차트 색상 토큰 통합** — CSS 변수 기반 색상 팔레트 파일 분리
  - 담당: Frontend | 예상 소요: 0.5시간

**배포**
- [ ] 🔴 **Vercel 프로젝트 연결 및 환경 변수 등록**
  - 담당: DevOps | 예상 소요: 1시간
- [ ] 🔴 **`npm run build` 프로덕션 빌드 검증** — 타입 오류·빌드 오류 0건
  - 담당: Frontend | 예상 소요: 0.5시간
- [ ] 🔴 **Vercel 프로덕션 URL에서 전체 기능 동작 확인**
  - 담당: Frontend | 예상 소요: 1시간
- [ ] 🟠 **Lighthouse 성능·접근성 점수 측정**
  - 담당: Frontend | 예상 소요: 1시간

### 완료 기준
- [ ] `npm run build` 에러 없이 통과
- [ ] Notion API 응답 헤더에 `Cache-Control: s-maxage=3600` 확인
- [ ] Lighthouse 접근성 점수 90점 이상
- [ ] Vercel 프로덕션 URL에서 전체 페이지 정상 동작
- [ ] 아래 테스트 항목 전체 Playwright MCP 통과

### 테스트 항목

> `npm run dev` 기동 후 Playwright MCP로 수행. 구현 완료 직후 각 시나리오 실행, 실패 시 재구현 후 재수행.

| 시나리오 | 합격 기준 | 도구 |
|----------|-----------|------|
| 시스템 테마 기본값 | `prefers-color-scheme: dark` 미디어 쿼리에 따라 초기 테마 설정 | Playwright MCP 콘솔 평가 |
| 캐시 — `revalidate` 적용 | 첫 요청 이후 응답 헤더에 `Cache-Control: s-maxage=3600` 포함 | Playwright MCP 네트워크 |
| 접근성 — 키보드 내비게이션 | Tab 키로 모든 인터랙티브 요소 접근 가능, 포커스 표시 확인 | Playwright MCP 셀렉터 |
| 프로덕션 빌드 | Vercel URL에서 대시보드·자산 목록·분석 페이지 정상 렌더링 | Playwright MCP 스크린샷 |

---

## 리스크 및 완화 전략

| 리스크 | 발생 가능성 | 영향도 | 완화 전략 |
|--------|------------|--------|-----------|
| Notion API 요청 제한(Rate Limit) 초과 | 중 | 높음 | 서버 사이드 캐시 적용, 클라이언트에서 직접 호출 금지 |
| `@notionhq/client` v5 API 변경으로 인한 호환성 문제 | 낮 | 높음 | `lib/notion.ts`를 단일 진입점으로 유지, `dataSources.query()` 패턴 준수 |
| Recharts v3 Breaking Change | 낮 | 중간 | 공식 마이그레이션 가이드 확인, `@types/recharts` 병행 사용 |
| Next.js 16 신규 API 미파악 | 중 | 중간 | `node_modules/next/dist/docs/` 문서 우선 참조 |
| Notion DB 필드명 변경으로 인한 데이터 파싱 오류 | 중 | 높음 | 헬퍼 함수 집중 관리, 필드명 상수화 (Phase 5) |
| 환경 변수 미설정으로 인한 런타임 오류 | 낮 | 높음 | `getRequiredEnv()` 헬퍼로 실행 시점 검증 |

---

## 기술 부채 관리

| 항목 | 설명 | 우선순위 | 해결 시기 |
|------|------|----------|-----------|
| `dynamic = "force-dynamic"` | 캐시 없이 매 요청마다 Notion API 호출. `revalidate` 전략으로 교체 필요 | 🟠 High | Phase 5 |
| Notion 필드명 하드코딩 | `"자산명"`, `"금액"` 등이 `lib/notion.ts` 내 문자열로 직접 사용됨 | 🟡 Medium | Phase 5 |
| 차트 색상 분산 | `AssetTrendChart`의 색상이 `hsl(var(--primary))`로 하드코딩됨 | 🟢 Low | Phase 5 |

---

## 명확화 필요 항목

1. **캐시 전략 트레이드오프** — `revalidate = 3600` 전환 시 데이터 반영에 최대 1시간 지연. 허용 여부 확인 필요
2. **시뮬레이터 복리 계산 공식** — 단리/복리, 세금 고려 여부 미명시. 공식 확인 필요
3. **다크 모드 기본값** — 시스템 설정을 기본값으로 사용하는 것으로 가정

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2026-05-08 | v1.0 | 최초 작성 — PRD v1.0 기반, Phase 0/1 완료 상태 반영 |
| 2026-05-08 | v2.0 | 개발 순서 재편 — 골격/공통모듈/핵심기능/추가기능/최적화·배포 6단계로 분리, 각 Phase 순서 이유 추가, 배포 계획 추가 |
