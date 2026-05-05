"use client";

import SummaryCards from "@/components/SummaryCards";
import EmissionChart from "@/components/EmissionChart";
import ActivityTable from "@/components/ActivityTable";
import ExcelUploader from "@/components/upload/ExcelUploader";
import { useActivities } from "@/hooks/useActivities";

export default function Home() {
  // 커스텀 훅을 통해 데이터와 로직을 한 번에 가져옴
  const { activities, stats, chartData, loading } = useActivities();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Analyzing Carbon Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans">
      <main className="max-w-6xl mx-auto py-16 px-6 sm:px-12">

        {/* 헤더 영역 */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-lime-600 tracking-tight">
              Carbon Dashboard
            </h1>
            <p className="text-zinc-400 font-medium mt-1">실시간 탄소 발자국 분석 및 리포트</p>
          </div>
          {/* 업로드 성공 시 데이터를 다시 불러오는 로직 등을 연결할 예정 */}
          <ExcelUploader onUploadSuccess={() => { }} />
        </header>

        {/* 1. 요약 카드 섹션 (kg, 그루, km 포함) */}
        <SummaryCards
          totalKg={stats.totalKg}
          totalPineTrees={stats.totalPineTrees}
          totalCarMileage={stats.totalCarMileage}
        />

        <div className="space-y-12">
          {/* 2. 시각화 섹션 (카테고리별 막대 그래프) */}
          <EmissionChart data={chartData} />

          {/* 3. 상세 내역 섹션 (유형별 필터링 기능 포함) */}
          <ActivityTable data={activities} />
        </div>
      </main>

      {/* 푸터 영역 */}
      <footer className="py-12 border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-12 text-center text-zinc-400 text-xs font-medium">
          &copy; 2026 Carbon-PCF SaaS. All environmental metrics are based on standard factors.
        </div>
      </footer>
    </div>
  );
}