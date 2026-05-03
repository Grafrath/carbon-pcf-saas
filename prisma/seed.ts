import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const factors = [
        { category: "전기", name: "한국전력 기본값", value: 0.456, unit: "kWh", version: 1 },
        { category: "원소재", name: "플라스틱 1", value: 2.3, unit: "kg", version: 1 },
        { category: "원소재", name: "플라스틱 2", value: 3.2, unit: "kg", version: 1 },
        { category: "운송", name: "트럭", value: 3.5, unit: "ton-km", version: 1 },
    ]

    for (const factor of factors) {
        await prisma.emissionFactor.create({
            data: factor
        })
    }
    console.log('초기 배출계수 데이터 주입 완료 (Version 1)')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })