"use client";

import { useState } from "react";

interface ActivityItem {
    id: string;
    date: string;
    category: string;
    description: string;
    usage: number;
    unit: string;
    impact: {
        weights: {
            kg: number;
            ton: number;
        };
    };
}

interface ActivityTableProps {
    data: ActivityItem[];
    onDelete: (id: string) => void;
}

export default function ActivityTable({ data, onDelete }: ActivityTableProps) {
    // 1. 카테고리 목록
    const categories = ["전체", ...Array.from(new Set(data.map((item) => item.category)))];

    // 2. 현재 선택된 탭 상태 관리
    const [activeCategory, setActiveCategory] = useState("전체");

    // 3. 선택된 카테고리에 따른 데이터 필터링
    const filteredData = activeCategory === "전체"
        ? data
        : data.filter(item => item.category === activeCategory);

    // 4. 날짜순 정렬
    const sortedData = [...filteredData].sort((a, b) => {
        return b.category.localeCompare(a.category);
    });

    const handleDeleteClick = (id: string) => {
        if (window.confirm("정말로 이 데이터를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")) {
            onDelete(id);
        }
    };

    return (
        <section className="space-y-8">
            {/* 타이틀 및 탭 버튼 영역 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-zinc-800 tracking-tight">상세 활동 내역</h2>

                <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100/50 rounded-2xl border border-zinc-100">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === category
                                    ? "bg-lime-500 text-white shadow-md shadow-lime-200"
                                    : "text-zinc-500 hover:bg-white hover:text-lime-600"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden transition-all">
                <div className="p-6 border-b border-zinc-50 bg-zinc-50/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-zinc-800">{activeCategory} 내역</h3>
                    </div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Total {sortedData.length} Items
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest border-b border-zinc-100">
                                <th className="p-6 pl-10">일자</th>
                                <th className="p-6">유형</th>
                                <th className="p-6">활동 설명</th>
                                <th className="p-6">사용량</th>
                                <th className="p-6 text-right pr-10">배출량(kg)</th>
                                <th className="p-6 text-center pr-10">관리</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {sortedData.map((item) => (
                                <tr key={item.id} className="border-b border-zinc-50 last:border-0 hover:bg-lime-50/40 transition-colors">
                                    <td className="p-6 pl-10 text-zinc-400 font-medium">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black uppercase">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-6 font-semibold text-zinc-700">
                                        {item.description}
                                    </td>
                                    <td className="p-6 text-zinc-500">
                                        <span className="font-bold text-zinc-800">{item.usage}</span> {item.unit}
                                    </td>
                                    <td className="p-6 text-right pr-10 font-black text-lime-600">
                                        {item.impact.weights.kg.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-6 text-center pr-10">
                                        <button
                                            onClick={() => handleDeleteClick(item.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}