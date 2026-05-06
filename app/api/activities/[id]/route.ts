import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await context.params;
        const id = resolvedParams.id;

        await prisma.activityData.delete({
            where: { id },
        });

        return NextResponse.json({ message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('삭제 오류:', error);
        return NextResponse.json(
            { error: '데이터를 삭제하는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}