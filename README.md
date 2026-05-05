Step 1: Next.js 프로젝트 초기 세팅 및 폴더 구조 설계. V

Step 2: PostgreSQL 스키마 설계 및 ORM 세팅 (활동 데이터, 배출계수 테이블 분리). V

Step 3: 탄소 계산 코어 로직(Util 함수) 및 단위 테스트 V

Step 4: 대시보드 UI 및 차트 연동.

Step 5: 엑셀 파싱 및 DB 임포트 API 구현.

Step 6: README 작성. (여기에 시스템 설계 이유, Trade-off, AI 활용 범위, Scope 분류 기준 등을 상세히 기록).

Docker를 이용해 백그라운드에 PostgreSQL 데이터베이스를 실행
docker-compose up -d

DB 마이그레이션 및 초기 데이터 주입 (자동)
npx prisma migrate dev --name init

Next.js 개발 서버 실행
yarn dev

DB 확인
npx prisma studio