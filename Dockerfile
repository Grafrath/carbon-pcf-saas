FROM node:20-alpine
WORKDIR /app

# 1. 의존성 패키지 및 Prisma 스키마 복사
COPY package.json yarn.lock ./
COPY prisma ./prisma

# 2. 패키지 설치
RUN yarn install

# 3. 전체 소스코드 복사
COPY . .

# 4. Prisma Client 생성 및 Next.js 프로젝트 빌드
RUN npx prisma generate
RUN yarn build

# 5. 포트 노출
EXPOSE 3000

# 6. 실행 명령어: DB 스키마 동기화 후 서버 실행
CMD ["sh", "-c", "npx prisma db push && yarn start"]