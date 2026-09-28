import { RecyclingRecord } from '../types';

/**
 * CONFIGURAÇÃO CENTRAL DE FATORES AMBIENTAIS DO ECORETORNA
 * 
 * Centralização mandatória de todos os fatores de impacto ambiental.
 * Nenhuma página ou componente deve conter fatores ou valores fixos arbitrários.
 * Todos os valores representam expressamente ESTIMATIVAS.
 */
export const environmentalFactors = {
  // Fatores de CO2e evitado estimado por unidade reciclada (em kg)
  co2eKg: {
    pet: 0.18, // ~0.18 kg CO2e evitado estimado por Garrafa PET 2L
    aluminio: 0.22, // ~0.22 kg CO2e evitado estimado por Lata de Alumínio
  },
  // Disclaimer obrigatório padrão
  disclaimer: '*Os valores ambientais apresentados são estimativas baseadas no tipo e na quantidade de materiais reciclados.',
};

/**
 * Calcula a quantidade total de embalagens a partir dos registros de reciclagem
 */
export function calculateTotalContainers(records: RecyclingRecord[]): number {
  if (!records || !Array.isArray(records)) return 0;
  return records.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

// Alias para compatibilidade
export const calcularTotalEmbalagens = calculateTotalContainers;

/**
 * Calcula o total de embalagens agrupadas por material (PET e Alumínio)
 */
export function calculateTotalByMaterial(records: RecyclingRecord[]): {
  pet: number;
  aluminio: number;
  total: number;
} {
  if (!records || !Array.isArray(records)) {
    return { pet: 0, aluminio: 0, total: 0 };
  }

  let pet = 0;
  let aluminio = 0;

  for (const item of records) {
    const qty = Number(item.quantity) || 0;
    if (item.materialCategory === 'pet') {
      pet += qty;
    } else if (item.materialCategory === 'aluminio') {
      aluminio += qty;
    }
  }

  return {
    pet,
    aluminio,
    total: pet + aluminio,
  };
}

/**
 * Calcula o CO2e evitado estimado total somando diretamente os valores
 * gravados no snapshot histórico (record.co2eAvoidedKg) de cada registro.
 * NÃO recalcula usando fatores atuais, preservando a imutabilidade histórica.
 */
export function calculateEstimatedCO2(records: RecyclingRecord[]): number {
  if (!records || !Array.isArray(records)) return 0;
  const total = records.reduce((sum, item) => sum + (Number(item.co2eAvoidedKg) || 0), 0);
  return Number(total.toFixed(1));
}

/**
 * Calcula o CO2e evitado estimado a partir de quantidades de PET e Alumínio
 */
export function calculateEstimatedCO2FromCounts(petCount: number, aluminumCount: number): number {
  const pet = Math.max(0, petCount);
  const alu = Math.max(0, aluminumCount);
  const totalKg = pet * environmentalFactors.co2eKg.pet + alu * environmentalFactors.co2eKg.aluminio;
  return Number(totalKg.toFixed(1));
}

/**
 * Interface para agregação mensal de estatísticas
 */
export interface MonthlyAggregate {
  monthKey: string; // Ex: '2026-04'
  label: string; // Ex: 'Abr/26'
  shortLabel: string; // Ex: 'Abr'
  year: number;
  month: number;
  containers: number;
  pet: number;
  aluminio: number;
  points: number;
  co2e: number;
}

/**
 * Agrupa registros de reciclagem por mês, somando o co2eAvoidedKg histórico de cada registro.
 */
export function groupRecordsByMonth(records: RecyclingRecord[]): MonthlyAggregate[] {
  const map: Record<string, MonthlyAggregate> = {};

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  records.forEach((record) => {
    const ym = record.date.substring(0, 7); // 'YYYY-MM'
    if (!map[ym]) {
      const [yearStr, monthStr] = ym.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const shortLabel = monthNames[month - 1] || monthStr;
      map[ym] = {
        monthKey: ym,
        label: `${shortLabel}/${String(year).slice(-2)}`,
        shortLabel,
        year,
        month,
        containers: 0,
        pet: 0,
        aluminio: 0,
        points: 0,
        co2e: 0,
      };
    }

    const qty = Number(record.quantity) || 0;
    const pts = Number(record.pointsEarned) || 0;
    const co2 = Number(record.co2eAvoidedKg) || 0;

    map[ym].containers += qty;
    map[ym].points += pts;
    map[ym].co2e += co2;
    if (record.materialCategory === 'pet') {
      map[ym].pet += qty;
    } else if (record.materialCategory === 'aluminio') {
      map[ym].aluminio += qty;
    }
  });

  // Formata o co2e acumulado para 1 casa decimal
  Object.values(map).forEach((m) => {
    m.co2e = Number(m.co2e.toFixed(1));
  });

  return Object.values(map).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

/**
 * Calcula a comparação percentual entre o período atual e o período anterior
 */
export function calculatePeriodComparison(
  currentQuantity: number,
  previousQuantity: number
): { percent: number | null; text: string; hasData: boolean } {
  if (previousQuantity <= 0) {
    return {
      percent: null,
      text: 'Ainda não há dados suficientes para comparação.',
      hasData: false,
    };
  }

  const diff = currentQuantity - previousQuantity;
  const percent = Math.round((diff / previousQuantity) * 100);
  const sign = percent > 0 ? '+' : '';

  return {
    percent,
    text: `${sign}${percent}% de embalagens recicladas em relação ao período anterior`,
    hasData: true,
  };
}

/**
 * Interface legada para compatibilidade de outros componentes
 */
export interface EnvironmentalImpactResult {
  totalContainers: number;
  petCount: number;
  aluminumCount: number;
  co2eAvoidedKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  equivalentTreesPlanted: number;
}

export function calculateEnvironmentalImpact(
  petCount: number,
  aluminumCount: number,
  recordsOrCo2e?: RecyclingRecord[] | number
): EnvironmentalImpactResult {
  const safePet = Math.max(0, petCount);
  const safeAlu = Math.max(0, aluminumCount);
  const total = safePet + safeAlu;
  let co2e: number;

  if (typeof recordsOrCo2e === 'number') {
    co2e = Number(recordsOrCo2e.toFixed(1));
  } else if (Array.isArray(recordsOrCo2e)) {
    co2e = calculateEstimatedCO2(recordsOrCo2e);
  } else {
    co2e = calculateEstimatedCO2FromCounts(safePet, safeAlu);
  }

  return {
    totalContainers: total,
    petCount: safePet,
    aluminumCount: safeAlu,
    co2eAvoidedKg: co2e,
    waterSavedLiters: Number((safePet * 5.2 + safeAlu * 3.5).toFixed(1)),
    energySavedKwh: Number((safePet * 0.26 + safeAlu * 0.58).toFixed(1)),
    equivalentTreesPlanted: Number((co2e / 15).toFixed(1)),
  };
}

export function getSingleItemImpact(category: 'pet' | 'aluminio', quantity = 1): number {
  const factor = category === 'aluminio' ? environmentalFactors.co2eKg.aluminio : environmentalFactors.co2eKg.pet;
  return Number((quantity * factor).toFixed(2));
}
