import { Badge, Challenge, RecyclingRecord } from '../types';
import {
  calculateTotalContainers,
  calculateEstimatedCO2,
  calculateTotalByMaterial,
} from './environmental';

/**
 * Utilitários centrais de gamificação do EcoRetorna.
 *
 * REGRAS CRÍTICAS:
 * 1. Conquistas e desafios são calculados DINAMICAMENTE a partir dos registros reais de reciclagem.
 * 2. NENHUM ponto com equivalência financeira é concedido por conquistas, desafios, logins,
 *    acessos diários ou cliques.
 * 3. Badges e desafios representam exclusivamente reconhecimento socioambiental e motivação cidadã.
 */

export function calculateBadges(records: RecyclingRecord[]): Badge[] {
  const total = calculateTotalContainers(records);
  const { pet, aluminio: alu } = calculateTotalByMaterial(records);
  const co2e = calculateEstimatedCO2(records);

  return [
    {
      id: 'badge_first_step',
      title: 'Primeiro Passo',
      description: 'Reciclou sua primeira embalagem no EcoRetorna.',
      condition: 'Reciclar 1 embalagem',
      iconName: 'Footprints',
      unlocked: total >= 1,
      unlockedAt: total >= 1 ? '2026-04-03' : undefined,
      currentProgress: Math.min(1, total),
      targetProgress: 1,
      unit: 'embalagem',
      category: 'iniciante',
    },
    {
      id: 'badge_recycler_50',
      title: 'Reciclador 50',
      description: 'Alcançou a marca de 50 embalagens recicladas.',
      condition: 'Reciclar 50 embalagens no total',
      iconName: 'CheckCircle2',
      unlocked: total >= 50,
      unlockedAt: total >= 50 ? '2026-05-18' : undefined,
      currentProgress: total,
      targetProgress: 50,
      unit: 'embalagens',
      category: 'volume',
    },
    {
      id: 'badge_recycler_100',
      title: 'Reciclador 100',
      description: 'Alcançou a marca de 100 embalagens recicladas.',
      condition: 'Reciclar 100 embalagens no total',
      iconName: 'Award',
      unlocked: total >= 100,
      unlockedAt: total >= 100 ? '2026-06-21' : undefined,
      currentProgress: total,
      targetProgress: 100,
      unit: 'embalagens',
      category: 'volume',
    },
    {
      id: 'badge_recycler_200',
      title: 'Reciclador 200',
      description: 'Alcançou a marca de 200 embalagens recicladas.',
      condition: 'Reciclar 200 embalagens no total',
      iconName: 'Trophy',
      unlocked: total >= 200,
      unlockedAt: total >= 200 ? '2026-08-27' : undefined,
      currentProgress: total,
      targetProgress: 200,
      unit: 'embalagens',
      category: 'volume',
    },
    {
      id: 'badge_recycler_300',
      title: 'Reciclador 300',
      description: 'Alcance 300 embalagens recicladas.',
      condition: 'Reciclar 300 embalagens no total',
      iconName: 'Sparkles',
      unlocked: total >= 300,
      currentProgress: total,
      targetProgress: 300,
      unit: 'embalagens',
      category: 'volume',
    },
    {
      id: 'badge_aluminum_friend',
      title: 'Amigo do Alumínio',
      description: 'Reciclou mais de 25 latas de alumínio.',
      condition: 'Reciclar 25 latas de alumínio',
      iconName: 'ShieldCheck',
      unlocked: alu >= 25,
      unlockedAt: alu >= 25 ? '2026-06-21' : undefined,
      currentProgress: alu,
      targetProgress: 25,
      unit: 'latas',
      category: 'material',
    },
    {
      id: 'badge_aluminum_centurion',
      title: 'Centurião do Alumínio',
      description: 'Alcance 100 latas de alumínio recicladas.',
      condition: 'Reciclar 100 latas de alumínio',
      iconName: 'Zap',
      unlocked: alu >= 100,
      currentProgress: alu,
      targetProgress: 100,
      unit: 'latas',
      category: 'material',
    },
    {
      id: 'badge_pet_friend',
      title: 'Amigo do PET',
      description: 'Reciclou mais de 25 embalagens PET.',
      condition: 'Reciclar 25 embalagens PET',
      iconName: 'PackageCheck',
      unlocked: pet >= 25,
      unlockedAt: pet >= 25 ? '2026-05-18' : undefined,
      currentProgress: pet,
      targetProgress: 25,
      unit: 'garrafas',
      category: 'material',
    },
    {
      id: 'badge_pet_master',
      title: 'Mestre do PET',
      description: 'Alcance 200 garrafas PET recicladas.',
      condition: 'Reciclar 200 garrafas PET',
      iconName: 'Flame',
      unlocked: pet >= 200,
      currentProgress: pet,
      targetProgress: 200,
      unit: 'garrafas',
      category: 'material',
    },
    {
      id: 'badge_green_impact',
      title: 'Impacto Verde',
      description: 'Alcançou mais de 25 kg de CO₂e evitado estimado.',
      condition: 'Alcançar 25 kg de CO₂e evitado estimado',
      iconName: 'Leaf',
      unlocked: co2e >= 25,
      unlockedAt: co2e >= 25 ? '2026-07-29' : undefined,
      currentProgress: co2e,
      targetProgress: 25,
      unit: 'kg CO₂e',
      category: 'impacto',
    },
    {
      id: 'badge_climate_guardian',
      title: 'Guardião do Clima',
      description: 'Alcance 50 kg de CO₂e evitado estimado.',
      condition: 'Alcançar 50 kg de CO₂e evitado estimado',
      iconName: 'Globe',
      unlocked: co2e >= 50,
      currentProgress: co2e,
      targetProgress: 50,
      unit: 'kg CO₂e',
      category: 'impacto',
    },
  ];
}

export function calculateChallenges(records: RecyclingRecord[]): Challenge[] {
  const total = calculateTotalContainers(records);
  const { pet, aluminio: alu } = calculateTotalByMaterial(records);
  const co2e = calculateEstimatedCO2(records);

  return [
    {
      id: 'chal_total_250',
      title: 'Recicle 250 embalagens',
      description: 'Entregue embalagens nos postos EcoRetorna para atingir a meta acumulada.',
      condition: '250 embalagens entregues no total',
      currentProgress: total,
      targetProgress: 250,
      unit: 'embalagens',
      category: 'volume',
      iconName: 'PackageCheck',
      completed: total >= 250,
    },
    {
      id: 'chal_alu_100',
      title: 'Recicle 100 latas de alumínio',
      description: 'O alumínio tem ciclo de reciclagem quase infinito e grande economia de energia.',
      condition: '100 latas de alumínio entregues',
      currentProgress: alu,
      targetProgress: 100,
      unit: 'latas',
      category: 'material',
      iconName: 'ShieldCheck',
      completed: alu >= 100,
    },
    {
      id: 'chal_pet_150',
      title: 'Recicle 150 garrafas PET',
      description: 'Evite que garrafas plásticas sobrecarreguem aterros e recursos naturais.',
      condition: '150 garrafas PET entregues',
      currentProgress: pet,
      targetProgress: 150,
      unit: 'garrafas',
      category: 'material',
      iconName: 'Recycle',
      completed: pet >= 150,
    },
    {
      id: 'chal_co2_50',
      title: 'Alcance 50 kg de CO₂e evitado estimado',
      description: 'Atingir 50 kg de CO₂e evitado representa um marco de expressivo impacto limpo.',
      condition: '50 kg de CO₂e evitado com reciclagens',
      currentProgress: co2e,
      targetProgress: 50,
      unit: 'kg CO₂e',
      category: 'impacto',
      iconName: 'Leaf',
      completed: co2e >= 50,
    },
  ];
}
