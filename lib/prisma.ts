import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

// pg Pool 및 Prisma 어댑터 생성
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 커넥션 풀 누수 방지용 글로벌 인스턴스 관리
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;