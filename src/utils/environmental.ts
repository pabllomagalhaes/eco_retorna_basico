/**
 * Configuração central de fatores ambientais do EcoRetorna.
 * Todos os cálculos ambientais são expressamente estimativas científicas/demonstrativas
 * baseadas no tipo e na quantidade de materiais reciclados.
 */

export const environmentalFactors = {
  // Fatores em kg de CO2e evitados por unidade reciclada
  co2eKg: {
    pet: 0.18, // ~0.18 kg CO2e por garrafa PET 2L reciclada vs resina virgem
    aluminio: 0.22, // ~0.22 kg CO2e por lata de alumínio reciclada vs bauxita virgem
  },
  // Litros de água economizados por unidade reciclada
  waterLiters: {
    pet: 5.2,
    aluminio: 3.5,
  },
  // Energia economizada em kWh por unidade reciclada
  energyKwh: {
    pet: 0.26,
    aluminio: 0.58,
  },
  disclaimer: '*Os valores ambientais são estimativas baseadas no tipo e na quantidade de materiais reciclados.',
};

export interface EnvironmentalImpactResult {
  totalContainers: number;
  petCount: number;
  aluminumCount: number;
  co2eAvoidedKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  equivalentTreesPlanted: number;
}

/**
 * Calcula o impacto ambiental consolidado a partir de quantidades de PET e Alumínio
 */
export function calculateEnvironmentalImpact(
  petCount: number,
  aluminumCount: number
): EnvironmentalImpactResult {
  const safePet = Math.max(0, petCount);
  const safeAlu = Math.max(0, aluminumCount);
  const total = safePet + safeAlu;

  const co2e = safePet * environmentalFactors.co2eKg.pet + safeAlu * environmentalFactors.co2eKg.aluminio;
  const water = safePet * environmentalFactors.waterLiters.pet + safeAlu * environmentalFactors.waterLiters.aluminio;
  const energy = safePet * environmentalFactors.energyKwh.pet + safeAlu * environmentalFactors.energyKwh.aluminio;
  // Árvores equivalentes aproximadas (~15kg CO2 absorvido por ano por árvore jovem)
  const trees = Number((co2e / 15).toFixed(1));

  return {
    totalContainers: total,
    petCount: safePet,
    aluminumCount: safeAlu,
    co2eAvoidedKg: Number(co2e.toFixed(1)),
    waterSavedLiters: Number(water.toFixed(1)),
    energySavedKwh: Number(energy.toFixed(1)),
    equivalentTreesPlanted: trees,
  };
}

/**
 * Retorna o impacto de um item individual
 */
export function getSingleItemImpact(category: 'pet' | 'aluminio', quantity = 1): number {
  const factor = category === 'aluminio' ? environmentalFactors.co2eKg.aluminio : environmentalFactors.co2eKg.pet;
  return Number((quantity * factor).toFixed(2));
}
