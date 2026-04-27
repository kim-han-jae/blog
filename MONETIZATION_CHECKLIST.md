# 수익화 실행 체크리스트

## 0) 선행 조건

- [ ] `NEXT_PUBLIC_SITE_URL`를 실 도메인으로 설정
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` 설정
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID` 설정
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HOME` 설정
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_IN_ARTICLE` 설정

## 1) 정책/신뢰도 페이지

- [x] `/about` 공개
- [x] `/privacy` 공개
- [x] `/contact` 공개
- [x] `/disclosure`(광고/제휴 고지) 공개
- [x] 푸터에서 정책 페이지 접근 가능
- [x] `/ads.txt` 노출

## 2) 색인/유입

- [ ] Google Search Console에 사이트 등록
- [ ] `sitemap.xml` 제출
- [ ] 대표 글 10개 URL 검사/색인 요청
- [ ] 네이버 서치어드바이저 등록

## 3) 광고 배치 운영

- [x] 레이아웃에 AdSense 스크립트 로드
- [x] 홈 슬롯 배치
- [x] 블로그 목록 슬롯 배치
- [x] 본문 하단 슬롯 배치
- [ ] 광고 과밀도 점검(본문 품질 저하 금지)

## 4) 콘텐츠 운영 기준

- [ ] 주 3~5개 발행 루틴
- [ ] 글당 내부 링크 3개 이상
- [ ] 검색 의도 중심 제목/메타디스크립션 개선
- [ ] 비교형/체크리스트형 글 비중 확대

## 5) 성과 측정

- [x] 포스트 조회수 트래킹
- [ ] Search Console 클릭/CTR 주간 점검
- [ ] RPM(1,000뷰당 수익) 추적
- [ ] 상위 글 업데이트 루프 운영

## 6) 배포 후 점검

- [ ] `https://도메인/ads.txt` 내용 확인
- [ ] `https://도메인/sitemap.xml` 200 확인
- [ ] `https://도메인/robots.txt` 200 확인
- [ ] 실사용자 광고 노출 여부 확인(애드블록 제외)
