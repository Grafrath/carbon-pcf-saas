import { prisma } from '../lib/prisma';
import { RAW_MOCK_DATA } from '../lib/mockData';

async function main() {
    console.log('데이터 시딩을 시작합니다...');

    // 1. 기존 데이터 초기화 
    await prisma.activityData.deleteMany();
    await prisma.emissionFactor.deleteMany();

    // 2. 배출계수 생성
    const factorElec = await prisma.emissionFactor.create({
        data: { category: '전기', name: '한국전력', value: 0.456, unit: 'kWh' },
    });

    const factorMat1 = await prisma.emissionFactor.create({
        data: { category: '원소재', name: '플라스틱 1', value: 2.3, unit: 'kg' },
    });

    const factorMat2 = await prisma.emissionFactor.create({
        data: { category: '원소재', name: '플라스틱 2', value: 3.2, unit: 'kg' },
    });

    const factorTrans = await prisma.emissionFactor.create({
        data: { category: '운송', name: '트럭', value: 3.5, unit: 'ton-km' },
    });

    // 배출계수 ID 매핑
    const getFactorId = (category: string, description: string) => {
        if (category === '전기') return factorElec.id;
        if (category === '원소재' && description === '플라스틱 1') return factorMat1.id;
        if (category === '원소재' && description === '플라스틱 2') return factorMat2.id;
        if (category === '운송') return factorTrans.id;
        throw new Error(`알 수 없는 배출계수: ${category} - ${description}`);
    };

    // 3. 목업 데이터 변환 (2025 -> 2024) 및 가공
    const activitiesToInsert = RAW_MOCK_DATA.map((item) => {
        const date2024 = item.date.replace('2025', '2024');

        return {
            date: new Date(date2024),
            category: item.category,
            description: item.description,
            usage: item.usage,
            unit: item.unit,
            emissionFactorId: getFactorId(item.category, item.description),
        };
    });

    // 4. DB에 일괄 삽입 (Bulk Insert)
    await prisma.activityData.createMany({
        data: activitiesToInsert,
    });

    console.log(`총 ${activitiesToInsert.length}개의 활동 데이터가 2024년 기준으로 성공적으로 시딩되었습니다.`);
}

main()
    .catch((e) => {
        console.error('시딩 중 오류 발생: ', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });