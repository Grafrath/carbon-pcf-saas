interface SummaryProps {
    totalKg: number;
    totalPineTrees: number;
    totalCarMileage: number;
}

export default function SummaryCards({ totalKg, totalPineTrees, totalCarMileage }: SummaryProps) {
    const totalTon = totalKg / 1000;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 1. 총 탄소 배출량 (kg & t) */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-3">Total Emission</p>
                <div className="space-y-1">
                    <p className="text-3xl font-black text-lime-600">
                        {totalKg.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        <span className="text-sm ml-1.5 font-bold text-lime-700/60">kg</span>
                    </p>
                    <p className="text-sm font-medium text-zinc-400">
                        ≈ {totalTon.toFixed(3)} tCO2eq
                    </p>
                </div>
            </div>

            {/* 2. 소나무 식재 효과 */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-3">Pine Trees</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-emerald-600">
                        {totalPineTrees.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        <span className="text-sm ml-1.5 font-bold text-emerald-700/60">그루</span>
                    </p>
                    <div className="mb-1.5 p-1 bg-emerald-50 rounded">
                        <i className="fa-solid fa-tree text-emerald-500 text-xs"></i>
                    </div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 font-medium">연간 흡수량 기준</p>
            </div>

            {/* 3. 승용차 주행 거리 */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-3">Car Mileage</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-sky-600">
                        {totalCarMileage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="text-sm ml-1.5 font-bold text-sky-700/60">km</span>
                    </p>
                    <div className="mb-1.5 p-1 bg-sky-50 rounded">
                        <i className="fa-solid fa-car-side text-sky-500 text-xs"></i>
                    </div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 font-medium">내연기관 승용차 기준</p>
            </div>

            {/* 4. 상태 요약 (에너지 효율 등) */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md bg-gradient-to-br from-white to-lime-50/30">
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-3">Analysis</p>
                <p className="text-sm font-bold text-zinc-700 leading-tight">
                    현재 데이터 기반<br />
                    탄소 발자국 분석 완료
                </p>
                <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-lime-700 uppercase">System Active</span>
                </div>
            </div>
        </div>
    );
}