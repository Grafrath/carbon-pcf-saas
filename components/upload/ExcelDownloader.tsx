"use client";

import * as XLSX from "xlsx";
import { Download } from "lucide-react";

interface ActivityItem {
    id: string;
    date: string;
    category: string;
    description: string;
    usage: number;
    unit: string;
    impact: {
        weights: { kg: number; ton: number; };
    };
}

interface ExcelDownloaderProps {
    data: ActivityItem[];
}

export default function ExcelDownloader({ data }: ExcelDownloaderProps) {
    // 데이터가 없을 때 버튼을 비활성화
    const isDisabled = !data || data.length === 0;

    const handleExportExcel = () => {
        if (isDisabled) return;

        // 1. 데이터 매핑
        const exportData = data.map((item) => ({
            "일자": new Date(item.date).toLocaleDateString(),
            "유형": item.category,
            "활동 설명": item.description,
            "사용량": item.usage,
            "단위": item.unit,
            "배출량(kg)": Number(item.impact.weights.kg.toFixed(2)),
            "배출량(t)": Number(item.impact.weights.ton.toFixed(4)),
        }));

        // 2. 워크시트 및 워크북 생성
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "전체_활동내역");

        // 3. 열 너비 자동 조절
        worksheet["!cols"] = [
            { wch: 15 }, // 일자
            { wch: 10 }, // 유형
            { wch: 25 }, // 활동 설명
            { wch: 12 }, // 사용량
            { wch: 8 },  // 단위
            { wch: 15 }, // 배출량(kg)
            { wch: 15 }, // 배출량(t)
        ];

        // 4. 엑셀 파일 다운로드
        const today = new Date().toISOString().split("T")[0];
        XLSX.writeFile(workbook, `Carbon_Report_${today}.xlsx`);
    };

    return (
        <button
            onClick={handleExportExcel}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-5 py-2.5 border rounded-2xl font-bold text-sm transition-all shadow-sm ${isDisabled
                    ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
        >
            <Download className={`w-4 h-4 ${isDisabled ? "text-zinc-400" : "text-zinc-500"}`} />
            엑셀 다운로드
        </button>
    );
}