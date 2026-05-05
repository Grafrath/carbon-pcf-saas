import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const activities = await prisma.activityData.findMany({
            include: {
                emissionFactor: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: '데이터를 불러오는 데 실패했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. 현재 DB에 등록된 모든 배출계수 조회
        const factors = await prisma.emissionFactor.findMany();

        const activitiesToInsert = [];
        const errors = [];

        // 2. 데이터 유효성 및 배출계수 매칭 검사
        for (let i = 0; i < body.length; i++) {
            const item = body[i];

            const category = item.category || item.type;
            const usage = item.usage || item.amount;
            const description = item.description;

            // DB의 배출계수와 매칭
            const matchedFactor = factors.find(
                (f) => f.category === category && f.name === description
            );

            if (!matchedFactor) {
                // 일치하는 계수가 없으면 에러 목록에 추가
                errors.push(`[${i + 1}번째 행] 등록되지 않은 배출계수: ${category} - ${description}`);
                continue;
            }

            activitiesToInsert.push({
                date: new Date(item.date),
                category: category,
                description: description,
                usage: Number(usage),
                unit: item.unit,
                emissionFactorId: matchedFactor.id,
            });
        }

        // 3. 매칭 실패 시 전체 취소
        if (errors.length > 0) {
            return NextResponse.json(
                { error: '일치하지 않는 배출계수가 있어 저장을 취소합니다.', details: errors },
                { status: 400 }
            );
        }

        // 4. 모두 정상 매칭 시 일괄 저장
        const result = await prisma.activityData.createMany({
            data: activitiesToInsert,
        });

        return NextResponse.json({
            message: '성공적으로 저장되었습니다.',
            count: result.count
        });

    } catch (error) {
        console.error('API POST Error:', error);
        return NextResponse.json(
            { error: '데이터 저장 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}