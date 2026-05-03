export interface CarbonResult {
    weights: {
        g: number;
        kg: number;
        ton: number;
    };
    equivalents: {
        pineTrees: number; // 소나무 식재 수 (그루)
        drivingKm: number; // 승용차 주행 거리 (km)
    };
}

// 소수점 2자리에서 반올림하여 첫째 자리까지 반환
const roundToFirstDecimal = (value: number): number => {
    return Math.round(value * 10) / 10;
};

/*
 탄소 배출량 및 일상 지표 계산 함수
 @param usage 사용량
 @param factorValue 배출계수 (kgCO2eq 기준)
 @param unit 입력 단위 (g, kg, ton, kWh)
 */
export const calculateCarbonImpact = (
    usage: number,
    factorValue: number,
    unit: string
): CarbonResult => {
    // kg 기준 단위 정규화
    let unitMultiplier = 1;
    const lowerUnit = unit.toLowerCase();

    if (lowerUnit === 'g') unitMultiplier = 0.001;
    else if (lowerUnit === 'ton' || lowerUnit === 't') unitMultiplier = 1000;

    // 기본 탄소 배출량 계산
    // '활동량(에너지/연료 사용량) * 배출계수' * kg정규화
    const totalKg = usage * factorValue * unitMultiplier;

    // 3. 결과 반환 (각 수치는 소수점 2자리에서 반올림)
    return {
        weights: {
            g: roundToFirstDecimal(totalKg * 1000),
            kg: roundToFirstDecimal(totalKg),
            ton: roundToFirstDecimal(totalKg / 1000),
        },
        equivalents: {
            pineTrees: roundToFirstDecimal(totalKg / 8),      // 소나무 1그루 당 8kg 흡수
            drivingKm: roundToFirstDecimal(totalKg / 0.17),   // 승용차 1km 당 0.17kg 배출
        },
    };
};