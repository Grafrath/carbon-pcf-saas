"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, FileUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 1. 데이터 검증 스키마
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

// 2. TypeScript 에러 해결을 위한 Props 인터페이스 추가
interface ExcelUploaderProps {
    onUploadSuccess: () => void;
}

export default function ExcelUploader({ onUploadSuccess }: ExcelUploaderProps) {
    // 모달 창 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    const [data, setData] = useState<ActivityData[]>([]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    // 모달 닫기 및 상태 초기화 함수
    const handleClose = () => {
        setIsOpen(false);
        // 닫을 때 이전 데이터 초기화 (다음에 열 때 깨끗한 상태로)
        setTimeout(() => {
            setData([]);
            setErrors([]);
            setIsSuccess(false);
        }, 200);
    };

    // 3. 엑셀 파일 처리 함수
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const resultData = event.target?.result;
            const workbook = XLSX.read(resultData, { type: 'binary', cellDates: true });
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
                    validationErrors.push({
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

    // 4. 최종 전송 처리
    const handleSubmit = () => {
        // 실제 DB 연동 API 호출 로직이 들어갈 자리.
        console.log("DB로 전송할 데이터:", data);

        // 성공 알림, 모달 닫기
        onUploadSuccess();
        handleClose();
    };

    return (
        <>
            {/* 대시보드에 표시되는 업로드 버튼 */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-lime-50 text-lime-600 font-bold text-sm rounded-xl border border-lime-200 hover:bg-lime-100 transition-all shadow-sm"
            >
                <FileUp className="w-4 h-4" />
                데이터 엑셀 업로드
            </button>

            {/* 모달 영역 */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* 모달 헤더 */}
                        <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-800">새 활동 데이터 업로드</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 모달 본문 */}
                        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                            <section>
                                <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                                    <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
                                        <div className="bg-lime-100 p-4 rounded-full">
                                            <FileUp className="w-8 h-8 text-lime-600" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-zinc-600 mb-3">제공된 과제용 엑셀 파일을 선택해주세요.</p>
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="excel-upload"
                                            />
                                            <label htmlFor="excel-upload">
                                                <Button variant="outline" className="cursor-pointer border-lime-200 text-lime-700 hover:bg-lime-50" asChild>
                                                    <span>파일 찾아보기</span>
                                                </Button>
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* 에러 메시지 출력 영역 */}
                            {errors.length > 0 && (
                                <section className="bg-red-50 p-5 rounded-2xl border border-red-100">
                                    <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5" />
                                        데이터 검증 오류 ({errors.length}건)
                                    </h3>
                                    <ul className="text-sm text-red-700 space-y-1.5 list-disc list-inside">
                                        {errors.map((err, i) => (
                                            <li key={i}>
                                                <span className="font-semibold">행 {err.row}:</span> {err.errors.join(', ')}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* 데이터 미리보기 영역 */}
                            {data.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                                            정상 로드된 데이터 ({data.length}건)
                                        </h3>
                                    </div>
                                    <div className="border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
                                        <Table>
                                            <TableHeader className="bg-zinc-50">
                                                <TableRow>
                                                    <TableHead className="font-bold">일자</TableHead>
                                                    <TableHead className="font-bold">유형</TableHead>
                                                    <TableHead className="font-bold">설명</TableHead>
                                                    <TableHead className="text-right font-bold">량</TableHead>
                                                    <TableHead className="font-bold">단위</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.map((item, idx) => (
                                                    <TableRow key={idx} className="hover:bg-lime-50/30">
                                                        <TableCell className="text-zinc-500">{item.date}</TableCell>
                                                        <TableCell>
                                                            <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-xs font-bold">
                                                                {item.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-zinc-700">{item.description}</TableCell>
                                                        <TableCell className="text-right font-bold">{item.amount.toLocaleString()}</TableCell>
                                                        <TableCell className="text-zinc-500">{item.unit}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* 모달 푸터 */}
                        <div className="px-8 py-5 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={handleClose} className="text-zinc-500 hover:text-zinc-700">
                                취소
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!isSuccess}
                                className={`${isSuccess ? 'bg-lime-600 hover:bg-lime-700 text-white' : 'bg-zinc-200 text-zinc-400'}`}
                            >
                                {isSuccess ? (
                                    <><CheckCircle2 className="mr-2 w-4 h-4" /> DB로 데이터 전송</>
                                ) : (
                                    '오류를 수정해 주세요'
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}