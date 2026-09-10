/**
 * Regras centrais de pontuação e conversão financeira do EcoRetorna.
 * Conforme especificação:
 * 1 ponto = R$ 0,125
 * Portanto: 2 pontos = R$ 0,25
 */

export const REAIS_PER_POINT = 0.125;

export const STANDARD_MATERIALS = [
  {
    id: 'pet_2l',
    name: 'Garrafa PET 2 L',
    category: 'pet' as const,
    unit: 'unidade',
    pointsPerUnit: 2,
    description: 'Embalagem PET de 2 litros limpa e seca',
  },
  {
    id: 'lata_aluminio',
    name: 'Lata de Alumínio',
    category: 'aluminio' as const,
    unit: 'unidade',
    pointsPerUnit: 2,
    description: 'Latas de bebidas em alumínio amassadas ou limpas',
  },
];

/**
 * Calcula pontos com base na quantidade e pontos unitários da embalagem:
 * pontos = quantidade × pontosDaEmbalagem
 */
export function calculatePoints(quantity: number, pointsPerPackaging: number): number {
  if (quantity <= 0 || isNaN(quantity)) return 0;
  return Math.round(quantity * pointsPerPackaging);
}

/**
 * Converte pontos em valor equivalente em reais:
 * valorEmReais = pontos × 0,125
 */
export function pointsToReais(points: number): number {
  if (points <= 0 || isNaN(points)) return 0;
  return Number((points * REAIS_PER_POINT).toFixed(2));
}

/**
 * Formata um valor numérico em Reais (pt-BR)
 */
export function formatCurrencyPtBR(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

/**
 * Formata números no padrão brasileiro
 */
export function formatNumberPtBR(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value || 0);
}
