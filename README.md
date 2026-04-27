# 이슈있슈 Blog Automation MVP

Next.js(App Router) + TypeScript + Tailwind + Prisma(PostgreSQL/Supabase) 기반의 검색형 콘텐츠 운영 도구 MVP입니다.

## 실행 방법

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## 환경변수 예시

`.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/current_affairs_blog?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="이슈있슈"
INTERNAL_API_KEY="dev-internal-key"
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=""
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT="ca-pub-xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID="pub-xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_IN_ARTICLE="1234567890"
NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HOME="1234567890"
NEXT_PUBLIC_SITE_AUTHOR="이슈있슈 편집팀"
```

## Prisma migrate 방법

```bash
npm run db:migrate
```

개발 단계에서 빠르게 스키마 반영 시:

```bash
npm run db:push
```

## Seed 실행 방법

```bash
npm run db:seed
```

기본 시드에는 최근 시사 이슈 키워드 10개와 샘플 브리프가 포함됩니다.

## 개발 서버 실행

```bash
npm run dev
```

- 사이트: `http://localhost:3000`
- 관리자: `http://localhost:3000/admin`

## Vercel 배포 시 주의사항

- `DATABASE_URL`을 Supabase Postgres 연결 문자열로 설정하세요.
- Vercel Build Command 전에 Prisma Client 생성이 필요할 수 있어 `postinstall` 또는 빌드 단계에서 `prisma generate` 실행을 권장합니다.
- `NEXT_PUBLIC_SITE_URL`은 실제 도메인(`https://...`)으로 설정해야 canonical/sitemap/OG URL이 정확해집니다.
- 서버리스 환경에서는 장기 실행 작업 대신 API 기반 배치(예: `keyword-sync`, `analytics-sync`)를 크론으로 호출하는 구조를 권장합니다.

## SEO / GEO / 수익화 체크리스트

- `NEXT_PUBLIC_SITE_URL`에 실제 운영 도메인을 넣고 배포
- `https://도메인/robots.txt`, `https://도메인/sitemap.xml`, `https://도메인/rss.xml` 동작 확인
- `https://도메인/llms.txt`, `https://도메인/llms-full.txt` 공개 확인(GEO)
- `https://도메인/manifest.webmanifest` 확인(앱/브랜드 메타데이터)
- Google Search Console에서 사이트맵 제출 + 색인 요청
- Naver 서치어드바이저에서 사이트 등록 및 소유권 인증
- AdSense 승인 후 `NEXT_PUBLIC_GOOGLE_ADSENSE_*` 환경변수 채우고 광고 슬롯 배치
- `https://도메인/ads.txt` 내용이 발급된 퍼블리셔 ID와 일치하는지 확인
- 실행용 상세 체크리스트: `MONETIZATION_CHECKLIST.md`
