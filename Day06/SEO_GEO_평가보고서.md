# 모닝브루 홈페이지 SEO · GEO 평가 보고서

> **작성일**: 6일차 (월요일)
> **평가 대상**: `Day05/index.html` — 모닝브루 1주차 통합 홈페이지 (히어로 + 메뉴 + 영업/픽업시간 + 예약 + 위치)
> **루트 진입**: `index.html`(저장소 루트) → `Day05/index.html`로 리디렉션
> **평가 관점**: ① SEO(검색엔진 최적화) ② GEO(생성형 AI 답변 노출 최적화, Generative Engine Optimization)
> **표기 규칙**: 변동·검증 필요 항목은 **(확인 필요)**

---

## 1. 요약 (Executive Summary)

| 영역 | 점수 | 한줄 평가 |
|---|---|---|
| **SEO** | **58 / 100** | 기본기(타이틀·설명·시맨틱·모바일·속도)는 양호하나, **구조화 데이터·OG·canonical·사이트맵**이 전무 |
| **GEO** | **45 / 100** | 영업시간·메뉴·가치 제안이 정적 HTML에 명시돼 추출은 가능하나, **schema.org·FAQ·엔티티 설명 문단**이 없어 AI 인용 근거가 약함 |
| **종합** | **52 / 100** | "잘 만든 한 장짜리 페이지"지만 **검색·AI에 발견되기 위한 메타 레이어가 비어 있음** |

핵심 한 줄: **콘텐츠는 괜찮은데, 기계(크롤러·LLM)가 읽을 신호가 부족하다.**

---

## 2. 평가 대상 · 방법 · 한계

- **방법**: 페이지 소스의 `<head>` 메타, 시맨틱 구조(헤딩 위계), 구조화 데이터, 콘텐츠 추출 가능성, 모바일/성능 신호를 정적 분석.
- **한계 (확인 필요)**
  - 실제 도메인·배포 URL 기준의 색인 상태, Core Web Vitals 실측, 검색 순위는 **미측정** (확인 필요).
  - 주소·전화·인스타 등 **NAP 정보가 실습용 가짜 데이터**(`02-000-0000`, `@morningbrew_demo`)라, 실제 로컬 SEO 평가는 실데이터 입력 후 재평가 필요.

---

## 3. SEO 평가

### 3-1. 잘 되어 있는 점 ✅

| 항목 | 현황 |
|---|---|
| 언어 선언 | `<html lang="ko">` ✓ |
| 타이틀 | `모닝브루 \| 연남동 출근길 픽업 카페` — 브랜드+지역+핵심키워드 포함, 길이 적절 ✓ |
| 메타 설명 | 약 110자, "연남동·출근 전·픽업·핸드드립·수제 스콘" 키워드 자연스럽게 포함 ✓ |
| 뷰포트/모바일 | `viewport` 설정 + 모바일 우선 반응형 레이아웃 ✓ |
| 시맨틱/헤딩 | `h1`(1개) → `h2`(섹션) → `h3`(메뉴·카드) 위계 정상, `header/main/section/footer` 사용 ✓ |
| 성능 | 인라인 CSS·외부 JS 프레임워크 없음 → 렌더링 빠름, 폰트 `preconnect` 적용 ✓ |
| 접근성 일부 | `role="status"`, `aria-live`, `aria-labelledby` 등 일부 적용 ✓ |

### 3-2. 부족 · 개선 필요 ⚠️

| # | 항목 | 현황 | 영향 | 개선안 |
|---|---|---|---|---|
| S1 | **구조화 데이터(JSON-LD)** | 없음 | 높음 | `CafeOrCoffeeShop`/`LocalBusiness` 스키마로 영업시간·주소·메뉴·가격 마크업 (→ 7장 스니펫) |
| S2 | **Open Graph / Twitter Card** | 없음 | 높음 | 공유 시 제목·설명·썸네일이 안 나옴 → `og:*`, `twitter:card` 추가 + `og:image` 1장 |
| S3 | **canonical** | 없음 | 중간 | `<link rel="canonical">`로 중복 URL(루트/Day05) 정규화 |
| S4 | **robots.txt / sitemap.xml** | 없음 | 중간 | 크롤링·색인 유도용 두 파일 추가 |
| S5 | **루트 리디렉션 방식** | meta refresh + JS `location.replace` | 중간 | 검색엔진엔 **301 영구 리디렉션**이 이상적. Vercel `vercel.json` 또는 페이지 자체를 루트로 |
| S6 | **H1 정보량** | `모닝브루` 단독 | 중간 | "모닝브루 — 연남동 출근길 픽업 카페"처럼 핵심 키워드 보강 (또는 보조 문구) |
| S7 | **NAP 일관성** | 주소·전화 가짜 | 높음(실서비스 시) | 실제 상호·주소·전화로 교체 후 구글 비즈니스 프로필과 일치 (확인 필요) |
| S8 | **favicon / 브랜드 아이콘** | 없음 | 낮음 | `favicon.ico`/`apple-touch-icon` 추가 |
| S9 | **og:image용 대표 이미지** | 페이지에 실제 이미지 0개(이모지만) | 중간 | 대표 사진 1~2장(메뉴·매장) 추가 시 이미지 검색·공유·시각 신뢰도 ↑ |

---

## 4. GEO 평가 (생성형 AI 답변 최적화)

> GEO = ChatGPT·Perplexity·구글 AI 개요 등이 **답변에 인용·요약**하기 좋게 만드는 최적화. 핵심은 ① 명확한 사실 진술 ② 구조화 데이터 ③ 엔티티 명료성 ④ Q&A·인용 가능 형태.

### 4-1. 잘 되어 있는 점 ✅

| 항목 | 현황 |
|---|---|
| 핵심 사실의 정적 노출 | 영업시간(화~일 08:00~20:00, 월 휴무), 픽업 가능 시간(08:00~19:30), 메뉴 4종+가격이 **JS가 아닌 정적 HTML**에 있음 → LLM 추출 가능 ✓ |
| 가치 제안 명료 | "출근 전, 메뉴와 픽업 시간을 미리 골라 줄 서지 않고 받는다" — AI가 한 줄 요약하기 쉬움 ✓ |
| 지역 엔티티 | "연남동", "홍대입구역 3번 출구 도보 8분" 등 위치 신호 ✓ |

### 4-2. 부족 · 개선 필요 ⚠️

| # | 항목 | 현황 | 개선안 |
|---|---|---|---|
| G1 | **schema.org 구조화 데이터** | 없음 | GEO에서 가장 중요. 엔티티(상호·유형·위치·영업시간·메뉴)를 JSON-LD로 기계가 신뢰하게 (→ 7장) |
| G2 | **엔티티 정의 문단** | 없음 | "모닝브루는 서울 연남동의 출근길 픽업 전문 동네 카페입니다…" 같은 **명시적 한 문단**(About) 추가 → AI가 정의를 그대로 인용 |
| G3 | **FAQ / Q&A 블록** | 없음 | "픽업은 몇 시부터 되나요?", "주차 되나요?", "예약은 어떻게 하나요?" 등 Q&A + `FAQPage` 스키마 → AI 답변에 직접 채택률 ↑ |
| G4 | **인용 가능한 구체 진술** | 일부 | 가격·시간 등 수치는 좋음. "도보 8분", "08:00 오픈처럼 동네에서 가장 이른" 등 **비교·구체 표현** 보강 |
| G5 | **신선도 신호** | 없음 | 업데이트 날짜/`dateModified` 등으로 최신성 신호 제공 |
| G6 | **실데이터** | 가짜 | AI가 잘못된 정보를 학습·인용하지 않도록 실서비스 전 실제 정보로 교체 (확인 필요) |

---

## 5. 종합 점수표

| 세부 항목 | SEO | GEO |
|---|---|---|
| 기술적 기반(메타·시맨틱·속도·모바일) | 7 / 10 | 6 / 10 |
| 구조화 데이터 | 0 / 10 | 0 / 10 |
| 콘텐츠 품질·키워드 | 7 / 10 | 6 / 10 |
| 엔티티·사실 명료성 | 6 / 10 | 5 / 10 |
| 공유·인용 자산(OG/FAQ/이미지) | 2 / 10 | 3 / 10 |
| 신뢰·실데이터(NAP/신선도) | 3 / 10 | 3 / 10 |
| **환산** | **58 / 100** | **45 / 100** |

---

## 6. 우선순위 개선 로드맵

### 🟢 즉시 (Quick Wins · 30분~1시간)
1. **JSON-LD `CafeOrCoffeeShop` 추가** — SEO·GEO 동시 최대 효과 (S1·G1)
2. **Open Graph / Twitter + canonical 추가** — 공유·중복 정리 (S2·S3)
3. **About 한 문단 + FAQ 3~4개(+`FAQPage` 스키마)** — GEO 인용률 (G2·G3)

### 🟡 구조 개선 (반나절)
4. **루트 리디렉션을 301로** 또는 페이지를 루트 `index.html`로 승격 (S5)
5. **robots.txt + sitemap.xml** 추가 (S4)
6. **H1 키워드 보강** + 대표 이미지 1~2장(og:image 겸용) (S6·S9)

### 🔵 실서비스 전 필수 (콘텐츠/데이터)
7. **NAP(상호·주소·전화·인스타) 실데이터 교체** + 구글 비즈니스 프로필 연동 (S7·G6) — (확인 필요)

---

## 7. 바로 적용 가능한 코드 스니펫

> `Day05/index.html`의 `<head>` 안, `</head>` 직전에 붙여넣으면 됩니다. (값은 실데이터로 교체 — 현재는 실습용 예시)

### 7-1. 구조화 데이터 (JSON-LD · SEO+GEO 핵심)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "모닝브루",
  "description": "서울 연남동의 출근길 픽업 전문 동네 카페. 출근 전 메뉴와 픽업 시간을 미리 골라 줄 서지 않고 받습니다.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "(실데이터 필요) 연남동 ○○길 ○○",
    "addressLocality": "서울 마포구",
    "addressCountry": "KR"
  },
  "telephone": "(실데이터 필요) +82-2-000-0000",
  "servesCuisine": "Coffee",
  "priceRange": "₩₩",
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "08:00", "closes": "20:00" }
  ],
  "url": "(배포 도메인)",
  "sameAs": ["https://instagram.com/(실계정)"]
}
</script>
```

### 7-2. Open Graph / Twitter / canonical
```html
<link rel="canonical" href="https://(도메인)/" />
<meta property="og:type" content="website" />
<meta property="og:title" content="모닝브루 | 연남동 출근길 픽업 카페" />
<meta property="og:description" content="출근 전 메뉴와 픽업 시간을 미리 골라 줄 서지 않고 받는 연남동 동네 카페." />
<meta property="og:image" content="https://(도메인)/og-image.jpg" />
<meta property="og:locale" content="ko_KR" />
<meta name="twitter:card" content="summary_large_image" />
```

### 7-3. FAQ 블록 (+ FAQPage 스키마) — GEO 인용률 ↑
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "픽업은 몇 시부터 가능한가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "오전 8시부터 오후 7시 30분까지 픽업이 가능합니다." } },
    { "@type": "Question", "name": "예약은 어떻게 하나요?",
      "acceptedAnswer": { "@type": "Answer", "text": "홈페이지 픽업 예약 폼에서 메뉴·날짜·시간·인원을 입력하면 됩니다." } },
    { "@type": "Question", "name": "휴무일은 언제인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "매주 월요일은 휴무이며, 화~일요일 08:00~20:00 영업합니다." } }
  ]
}
</script>
```

### 7-4. robots.txt / sitemap.xml (저장소 루트)
```text
# robots.txt
User-agent: *
Allow: /
Sitemap: https://(도메인)/sitemap.xml
```

---

## 8. 주의 — 실습용 가짜 데이터

현재 페이지의 주소·전화·인스타·예시 이름은 **실습용 가짜 데이터**입니다. 위 스니펫의 `(실데이터 필요)` 부분을 실제 정보로 채우기 전에는 구조화 데이터·로컬 SEO를 **실제로 활성화하지 마세요** (잘못된 정보가 검색/AI에 노출·인용될 수 있음). 실데이터 확정 후 재평가 권장. (확인 필요)
