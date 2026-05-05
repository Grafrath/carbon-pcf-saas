"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateCarbonImpact } from "@/utils/carbonCalculator";

export function useActivities() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // API에서 DB 데이터를 불러오는 함수
    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/activities");
            if (!res.ok) {
                throw new Error("네트워크 응답이 올바르지 않습니다.");
            }

            const dbData = await res.json();

            const calculated = dbData.map((item: any) => ({
                id: item.id,
                date: new Date(item.date).toISOString().split("T")[0], // 날짜 포맷팅
                category: item.category,
                description: item.description,
                usage: item.usage,
                unit: item.unit,
                // 중첩 객체로 들어온 배출계수 값을 넘겨줍니다.
                impact: calculateCarbonImpact(item.usage, item.emissionFactor.value, item.unit),
            }));

            setActivities(calculated);
        } catch (error) {
            console.error("데이터 패칭 오류:", error);
            // 에러 처리 빈 배열 반환
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const stats = useMemo(() => {
        const totalKg = activities.reduce((sum, item) => sum + (item.impact?.weights?.kg || 0), 0);
        const totalPineTrees = activities.reduce((sum, item) => sum + (item.impact?.equivalents?.pineTrees || 0), 0);
        const totalCarMileage = activities.reduce((sum, item) => sum + (item.impact?.equivalents?.drivingKm || 0), 0);

        return { totalKg, totalPineTrees, totalCarMileage };
    }, [activities]);

    const chartData = useMemo(() => {
        return activities.reduce((acc: any[], curr: any) => {
            const found = acc.find((item) => item.name === curr.category);
            if (found) {
                found.value += curr.impact?.weights?.kg || 0;
            } else {
                acc.push({ name: curr.category, value: curr.impact?.weights?.kg || 0 });
            }
            return acc;
        }, []);
    }, [activities]);

    return {
        activities,
        stats,
        chartData,
        loading,
        refresh: fetchActivities
    };
}