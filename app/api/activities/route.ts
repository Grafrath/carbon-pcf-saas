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