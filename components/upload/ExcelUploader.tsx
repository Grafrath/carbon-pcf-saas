"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 1. 데이터 검증 스키마 정의
const activitySchema = z.object({
    date: z.string().min(1, "일자는 필수입니다."),
    type: z.enum(["전기", "원소재", "운송"]).refine(
        (value) => ["전기", "원소재", "운송"].includes(value),
        { message: "유효한 활동 유형이 아닙니다." }
    ),
    description: z.string().min(1, "설명은 필수입니다."),
    amount: z.number().positive("량은 0보다 커야 합니다."),
    unit: z.string().min(1, "단위는 필수입니다."),
});

type ActivityData = z.infer<typeof activitySchema>;

interface ValidationError {
    row: number;
    errors: string[];
}

export default function ExcelUploader() {
    const [data, setData] = useState<ActivityData[]>([]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    // 2. 엑셀 파일 처리 함수
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
            const targetSheetName = workbook.SheetNames[1];
            if (!targetSheetName) {
                setErrors([{ row: 0, errors: ["두 번째 시트(과제용 데이터)를 찾을 수 없습니다."] }]);
                return;
            }

            const sheet = workbook.Sheets[targetSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { range: 2 }) as any[];

            const parsedData: ActivityData[] = [];
            const validationErrors: ValidationError[] = [];

            rows.forEach((row, index) => {
                // 엑셀 헤더 매핑
                const mappedRow = {
                    date: row["일자(원본)"] || row["일자"],
                    type: row["활동 유형"],
                    description: row["설명"],
                    amount: Number(row["량"]),
                    unit: row["단위"],
                };

                const result = activitySchema.safeParse(mappedRow);
                if (result.success) {
                    parsedData.push(result.data);
                } else {
                    // 3. result.error.issues를 사용하여 에러 배열에 안전하게 접근
                    validationErrors.push({
                        // 실제 엑셀 행 번호 계산: 시작점(3) + 인덱스
                        row: index + 4,
                        errors: result.error.issues.map(issue => issue.message),
                    });
                }
            });

            setData(parsedData);
            setErrors(validationErrors);
            setIsSuccess(validationErrors.length === 0 && parsedData.length > 0);
        };
    };

    return (
        <div className="space-y-8 text-left">
            <section>
                <h2 className="text-2xl font-bold mb-4">
                    데이터 업로드
                </h2>
                <Card className="border-dashed border-2">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-lime-50 p-4 rounded-full">
                            <FileUp className="w-8 h-8 text-lime-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">제공된 과제용 엑셀 파일을 선택해주세요.</p>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="excel-upload"
                            />
                            <label htmlFor="excel-upload">
                                <Button variant="outline" className="cursor-pointer" asChild>
                                    <span>파일 선택하기</span>
                                </Button>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* 에러 메시지 출력 영역 */}
            {errors.length > 0 && (
                <section className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-red-800 font-semibold flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        데이터 검증 오류 ({errors.length}건)
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((err, i) => (
                            <li key={i}>행 {err.row}: {err.errors.join(', ')}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* 데이터 미리보기 영역 */}
            {data.length > 0 && (
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            업로드 데이터 미리보기
                        </h3>
                        {isSuccess && (
                            <Button className="bg-lime-600 hover:bg-lime-700">
                                <CheckCircle2 className="mr-2 w-4 h-4" /> DB로 데이터 전송
                            </Button>
                        )}
                    </div>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>일자</TableHead>
                                    <TableHead>유형</TableHead>
                                    <TableHead>설명</TableHead>
                                    <TableHead className="text-right">량</TableHead>
                                    <TableHead>단위</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">{item.amount.toLocaleString()}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            )}
        </div>
    );
}