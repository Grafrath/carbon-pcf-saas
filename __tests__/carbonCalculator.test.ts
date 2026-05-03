import { calculateCarbonImpact } from '../utils/carbonCalculator';

describe('Carbon Calculator Core Logic Test', () => {
    test('전력 100kWh 사용 시 탄소 배출량 및 지표 계산 (계수: 0.456)', () => {
        const result = calculateCarbonImpact(100, 0.456, 'kWh');

        // 100 * 0.456 = 45.6 kgCO2eq
        expect(result.weights.kg).toBe(45.6);
        expect(result.weights.ton).toBe(0.0); // 0.0456 -> 0.0 (2자리 반올림 규칙)

        // 45.6 / 8 = 5.7그루
        expect(result.equivalents.pineTrees).toBe(5.7);

        // 45.6 / 0.17 = 268.235... -> 268.2km
        expect(result.equivalents.drivingKm).toBe(268.2);
    });

    test('무게 단위(ton) 입력 시 정상적으로 kg으로 환산되어 계산되는가', () => {
        // 1.5톤 사용, 계수 2.0 (kgCO2eq) -> 총 3000kg 배출
        const result = calculateCarbonImpact(1.5, 2.0, 'ton');
        expect(result.weights.kg).toBe(3000);
        expect(result.weights.ton).toBe(3);
    });
});