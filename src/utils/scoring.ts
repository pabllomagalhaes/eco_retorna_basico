import { MaterialType, RecyclingRecord } from '../types';

/**
 * Regras centrais de pontuação e conversão financeira do EcoRetorna.
 * Conforme especificação:
 * 1 ponto = R$ 0,125
 * Portanto: 2 pontos = R$ 0,25
 */
export const REAIS_PER_POINT = 0.125;
export const POINTS_PER_PET = 2;
export const POINTS_PER_ALUMINUM = 2;
export const INITIAL_WELCOME_BONUS_POINTS = 44;

export const STANDARD_MATERIALS: MaterialType[] = [
  {
    id: 'pet_2l',
    name: 'Garrafa PET 2 L',
    category: 'pet',
    unit: 'unidade',
    pointsPerUnit: POINTS_PER_PET,
    co2eAvoidedKgPerUnit: 0.18,
    description: 'Embalagem PET de 2 litros limpa e seca',
  },
  {
    id: 'lata_aluminio',
    name: 'Lata de Alumínio',
    category: 'aluminio',
    unit: 'unidade',
    pointsPerUnit: POINTS_PER_ALUMINUM,
    co2eAvoidedKgPerUnit: 0.22,
    description: 'Latas de bebidas em alumínio amassadas ou limpas',
  },
];

/**
 * Calcula pontos com base na quantidade e pontos unitários da embalagem:
 * pontos = quantidade × pontosDaEmbalagem
 * Exemplo: 10 PET 2 L -> 10 × 2 = 20 pontos
 */
export function calcularPontos(quantity: number, pointsPerPackaging: number = 2): number {
  if (quantity <= 0 || isNaN(quantity)) return 0;
  return Math.round(quantity * pointsPerPackaging);
}

// Alias para compatibilidade
export const calculatePoints = calcularPontos;

/**
 * Converte pontos em valor equivalente em reais:
 * valorEmReais = pontos × 0,125
 * Exemplo: 20 pontos × R$ 0,125 = R$ 2,50
 */
export function calcularValorEmReais(points: number): number {
  if (points <= 0 || isNaN(points)) return 0;
  return Number((points * REAIS_PER_POINT).toFixed(2));
}

// Alias para compatibilidade
export const pointsToReais = calcularValorEmReais;

/**
 * Calcula a quantidade total de embalagens recicladas a partir dos registros
 * Exemplo: soma de todas as quantidades nos registros de histórico
 */
export function calcularTotalEmbalagens(records: RecyclingRecord[]): number {
  if (!records || !Array.isArray(records)) return 0;
  return records.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

/**
 * Calcula o saldo de pontos derivado diretamente dos registros de reciclagem
 * (mais o bônus inicial de boas-vindas demonstrativo de 44 pontos, totalizando 480 para Camila)
 */
export function calcularSaldoPontos(
  records: RecyclingRecord[],
  initialBonus: number = INITIAL_WELCOME_BONUS_POINTS
): number {
  if (!records || !Array.isArray(records)) return initialBonus;
  const pointsFromRecords = records.reduce(
    (sum, item) => sum + (Number(item.pointsEarned) || 0),
    0
  );
  return pointsFromRecords + initialBonus;
}

/**
 * Formata um valor numérico em Reais no padrão brasileiro (pt-BR)
 * Exemplo: 2.5 -> "R$ 2,50"
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
 * Exemplo: 1250 -> "1.250"
 */
export function formatNumberPtBR(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value || 0);
}
