# FIRE 달성 계산기

Notion을 CMS로 활용한 자산 관리 및 FIRE(Financial Independence, Retire Early) 진행률 시각화 대시보드.

## 주요 기능

- **FIRE 달성률 시각화** — 총자산 / 목표금액 기반 프로그레스바
- **핵심 지표 카드** — 총자산, 목표금액, 달성률, FIRE 배수(총자산 / 연간생활비)
- **월별 자산 추이** — 라인 차트로 자산 변화 추적
- **자산 목록 테이블** — 유형별 자산 분류 및 수익률 표시
- **Notion CMS 연동** — Notion DB를 통해 코드 수정 없이 데이터 관리

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| CMS | Notion API (읽기 전용) |
| 차트 | Recharts |
| Icons | Lucide React |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
NOTION_API_KEY=your_notion_integration_token
NOTION_ASSETS_DB_ID=your_assets_database_id
NOTION_MONTHLY_DB_ID=your_monthly_records_database_id
NOTION_GOALS_DB_ID=your_goals_database_id
```

> Notion Integration 생성: [notion.so/my-integrations](https://www.notion.so/my-integrations)

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## Notion 데이터베이스 구조

### 자산 목록 DB

| 필드 | 타입 | 예시 |
|------|------|------|
| 자산명 | Title | 삼성전자 |
| 금액 | Number | 5000000 |
| 자산유형 | Select | 주식 / ETF / 현금 / 부동산 / 기타 |
| 수익률 | Number | 12.5 |

### 월별 기록 DB

| 필드 | 타입 | 예시 |
|------|------|------|
| 월 | Date | 2026-05-01 |
| 총자산 | Number | 150000000 |
| 저축액 | Number | 3000000 |
| 투자수익 | Number | 1200000 |

### 목표 설정 DB

| 필드 | 타입 | 예시 |
|------|------|------|
| 목표금액 | Number | 500000000 |
| 월간생활비 | Number | 3000000 |

## 프로젝트 구조

```
├── app/               # Next.js App Router 페이지
├── components/        # React 컴포넌트
│   ├── layout/        # Header, Footer
│   ├── ui/            # shadcn/ui 컴포넌트
├── data/              # 로컬 데이터 (개발용)
├── docs/              # 문서 (PRD 등)
├── lib/               # 유틸리티
└── public/            # 정적 자산
```

## 라이선스

MIT
