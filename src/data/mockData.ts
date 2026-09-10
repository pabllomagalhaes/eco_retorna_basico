import {
  Badge,
  CollectionPoint,
  Donation,
  EcoEvent,
  Initiative,
  Participant,
  RankingParticipant,
  RecyclingRecord,
  Redemption,
} from '../types';
import { calculatePoints, pointsToReais } from '../utils/scoring';
import { getSingleItemImpact } from '../utils/environmental';

export const INITIAL_PARTICIPANT: Participant = {
  id: 'usr_camila_01',
  name: 'Camila Ribeiro',
  email: 'camila.ribeiro@ecoretorna.demo',
  registeredAt: '2025-10-12',
  city: 'Curitiba',
  neighborhood: 'Batel',
  avatarUrl: '',
  notificationsEnabled: true,
  highContrastMode: false,
};

/**
 * 218 embalagens históricas geradas com exatidão:
 * 130 PET 2L (130 * 2 = 260 pontos, 130 * 0.18 = 23.4 kg CO2e)
 * 88 Latas de Alumínio (88 * 2 = 176 pontos, 88 * 0.22 = 19.36 kg CO2e)
 * Total de embalagens: 218
 * Total de CO2e evitado: 42.76 ≈ 42.8 kg CO2e
 * Pontos gerados ao longo do tempo: 436 pontos acumulados.
 * Com bônus de boas-vindas demonstrativo de 44 pontos = 480 pontos de saldo inicial!
 */
export const INITIAL_RECYCLING_RECORDS: RecyclingRecord[] = [
  // Mês atual: 34 embalagens (20 PET + 14 Alumínio) -> ~7.2 kg CO2e
  {
    id: 'rec_01',
    date: '2026-09-06',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 12,
    pointsEarned: calculatePoints(12, 2),
    reaisEquivalent: pointsToReais(calculatePoints(12, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 12),
    collectionPointName: 'EcoPonto Praça da Sustentabilidade',
  },
  {
    id: 'rec_02',
    date: '2026-09-03',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 14,
    pointsEarned: calculatePoints(14, 2),
    reaisEquivalent: pointsToReais(calculatePoints(14, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 14),
    collectionPointName: 'Estação Central Verde',
  },
  {
    id: 'rec_03',
    date: '2026-09-01',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 8,
    pointsEarned: calculatePoints(8, 2),
    reaisEquivalent: pointsToReais(calculatePoints(8, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 8),
    collectionPointName: 'Ponto Verde Mercado Municipal',
  },

  // Mês anterior (Agosto): 29 embalagens (34 vs 29 = +17.2% ~ +18%)
  {
    id: 'rec_04',
    date: '2026-08-27',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 15,
    pointsEarned: calculatePoints(15, 2),
    reaisEquivalent: pointsToReais(calculatePoints(15, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 15),
    collectionPointName: 'EcoPonto Praça da Sustentabilidade',
  },
  {
    id: 'rec_05',
    date: '2026-08-14',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 14,
    pointsEarned: calculatePoints(14, 2),
    reaisEquivalent: pointsToReais(calculatePoints(14, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 14),
    collectionPointName: 'Estação Parque Barigui',
  },

  // Julho: 38 embalagens (22 PET, 16 Alumínio)
  {
    id: 'rec_06',
    date: '2026-07-28',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 22,
    pointsEarned: calculatePoints(22, 2),
    reaisEquivalent: pointsToReais(calculatePoints(22, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 22),
    collectionPointName: 'EcoPonto Praça da Sustentabilidade',
  },
  {
    id: 'rec_07',
    date: '2026-07-10',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 16,
    pointsEarned: calculatePoints(16, 2),
    reaisEquivalent: pointsToReais(calculatePoints(16, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 16),
    collectionPointName: 'Estação Central Verde',
  },

  // Junho: 35 embalagens (21 PET, 14 Alumínio)
  {
    id: 'rec_08',
    date: '2026-06-21',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 14,
    pointsEarned: calculatePoints(14, 2),
    reaisEquivalent: pointsToReais(calculatePoints(14, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 14),
    collectionPointName: 'Ponto Verde Mercado Municipal',
  },
  {
    id: 'rec_09',
    date: '2026-06-05',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 21,
    pointsEarned: calculatePoints(21, 2),
    reaisEquivalent: pointsToReais(calculatePoints(21, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 21),
    collectionPointName: 'Estação Parque Barigui',
  },

  // Maio: 42 embalagens (25 PET, 17 Alumínio)
  {
    id: 'rec_10',
    date: '2026-05-18',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 25,
    pointsEarned: calculatePoints(25, 2),
    reaisEquivalent: pointsToReais(calculatePoints(25, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 25),
    collectionPointName: 'Estação Central Verde',
  },
  {
    id: 'rec_11',
    date: '2026-05-02',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 17,
    pointsEarned: calculatePoints(17, 2),
    reaisEquivalent: pointsToReais(calculatePoints(17, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 17),
    collectionPointName: 'EcoPonto Praça da Sustentabilidade',
  },

  // Abril: 40 embalagens (28 PET, 12 Alumínio) -> soma total exata:
  // PET: 12 + 8 + 14 + 22 + 21 + 25 + 28 = 130 garrafas PET
  // Alumínio: 14 + 15 + 16 + 14 + 17 + 12 = 88 latas de alumínio
  // TOTAL: 130 + 88 = 218 embalagens!
  {
    id: 'rec_12',
    date: '2026-04-19',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 28,
    pointsEarned: calculatePoints(28, 2),
    reaisEquivalent: pointsToReais(calculatePoints(28, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 28),
    collectionPointName: 'Ponto Verde Mercado Municipal',
  },
  {
    id: 'rec_13',
    date: '2026-04-03',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 12,
    pointsEarned: calculatePoints(12, 2),
    reaisEquivalent: pointsToReais(calculatePoints(12, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 12),
    collectionPointName: 'Estação Parque Barigui',
  },
];

export const INITIAL_REDEMPTIONS: Redemption[] = [];

export const INITIAL_DONATIONS: Donation[] = [];

export const COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: 'pt_01',
    name: 'EcoPonto Praça da Sustentabilidade',
    address: 'Av. Sete de Setembro, 4200',
    neighborhood: 'Batel',
    city: 'Curitiba - PR',
    operatingHours: 'Segunda a Sábado: 08:00 às 19:00',
    acceptedMaterials: ['Garrafas PET 2L', 'Latas de Alumínio'],
    latitude: -25.4411,
    longitude: -49.2785,
    notes: 'Acesso facilitado para pedestres e bicicletas.',
  },
  {
    id: 'pt_02',
    name: 'Estação Central Verde',
    address: 'Rua XV de Novembro, 1280',
    neighborhood: 'Centro',
    city: 'Curitiba - PR',
    operatingHours: 'Segunda a Sexta: 07:30 às 20:00 | Sáb: 08:00 às 14:00',
    acceptedMaterials: ['Garrafas PET 2L', 'Latas de Alumínio'],
    latitude: -25.4284,
    longitude: -49.2673,
    notes: 'Próximo à estação tubo de transporte público.',
  },
  {
    id: 'pt_03',
    name: 'Ponto Verde Mercado Municipal',
    address: 'Av. Presidente Affonso Camargo, 1993',
    neighborhood: 'Jardim Botânico',
    city: 'Curitiba - PR',
    operatingHours: 'Terça a Sábado: 08:00 às 18:00 | Dom: 08:00 às 13:00',
    acceptedMaterials: ['Garrafas PET 2L', 'Latas de Alumínio'],
    latitude: -25.4346,
    longitude: -49.2558,
    notes: 'Localizado no estacionamento lateral do mercado.',
  },
  {
    id: 'pt_04',
    name: 'Estação Parque Barigui',
    address: 'Alameda Ecológica Burle Marx, s/n',
    neighborhood: 'Santo Inácio',
    city: 'Curitiba - PR',
    operatingHours: 'Todos os dias: 06:00 às 20:00',
    acceptedMaterials: ['Garrafas PET 2L', 'Latas de Alumínio'],
    latitude: -25.4261,
    longitude: -49.3092,
    notes: 'Ponto com alta procura durante finais de semana.',
  },
];

export const INITIATIVES: Initiative[] = [
  {
    id: 'init_rios',
    name: 'Projeto Rios Limpos',
    tagline: 'Preservação de bacias hidrográficas e despoluição de leitos urbanos',
    description:
      'Iniciativa socioambiental dedicada à remoção de resíduos sólidos e recuperação de matas ciliares ao longo de córregos e rios urbanos.',
    iconName: 'Droplets',
    cause: 'Proteção Hídrica e Bacias',
  },
  {
    id: 'init_mata',
    name: 'Projeto Mata Viva',
    tagline: 'Reflorestamento de espécies nativas e corredores ecológicos',
    description:
      'Ações integradas de plantio de mudas de árvores nativas para restauro florestal e conservação da fauna e flora regional.',
    iconName: 'Trees',
    cause: 'Reflorestamento Nativo',
  },
  {
    id: 'init_oceano',
    name: 'Instituto Oceano Verde',
    tagline: 'Combate ao descarte de plásticos em regiões litorâneas e estuários',
    description:
      'Trabalho de conscientização, barreiras de contenção flutuantes e triagem de embalagens descartadas em áreas costeiras.',
    iconName: 'Waves',
    cause: 'Conservação Costeira e Marinha',
  },
];

export const BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    title: 'Primeiro Passo',
    description: 'Reciclou sua primeira embalagem no EcoRetorna.',
    iconName: 'Footprints',
    unlocked: true,
    unlockedAt: '2026-04-03',
    currentProgress: 1,
    targetProgress: 1,
    category: 'iniciante',
  },
  {
    id: 'badge_recycler_50',
    title: 'Reciclador 50',
    description: 'Alcançou a marca de 50 embalagens recicladas.',
    iconName: 'CheckCircle2',
    unlocked: true,
    unlockedAt: '2026-05-18',
    currentProgress: 218,
    targetProgress: 50,
    category: 'volume',
  },
  {
    id: 'badge_aluminum_friend',
    title: 'Amigo do Alumínio',
    description: 'Reciclou mais de 25 latas de alumínio.',
    iconName: 'ShieldCheck',
    unlocked: true,
    unlockedAt: '2026-06-21',
    currentProgress: 88,
    targetProgress: 25,
    category: 'material',
  },
  {
    id: 'badge_green_guardian',
    title: 'Guardião Verde',
    description: 'Alcançou mais de 40 kg de CO₂e evitados no planeta.',
    iconName: 'Leaf',
    unlocked: true,
    unlockedAt: '2026-09-06',
    currentProgress: 42.8,
    targetProgress: 40,
    category: 'impacto',
  },
  {
    id: 'badge_recycler_300',
    title: 'Mestre da Reciclagem',
    description: 'Complete 300 embalagens recicladas.',
    iconName: 'Award',
    unlocked: false,
    currentProgress: 218,
    targetProgress: 300,
    category: 'volume',
  },
  {
    id: 'badge_centurion_aluminum',
    title: 'Centurião do Alumínio',
    description: 'Alcance 100 latas de alumínio recicladas.',
    iconName: 'Sparkles',
    unlocked: false,
    currentProgress: 88,
    targetProgress: 100,
    category: 'material',
  },
];

export const ECO_EVENTS: EcoEvent[] = [
  {
    id: 'evt_01',
    title: 'Mutirão de Limpeza e Coleta Especial de Primavera',
    description:
      'Ação voluntária aberta à comunidade para conscientização, descarte correto de plásticos e latas, com pontos de coleta rápida.',
    date: '2026-09-20 • 09:00 às 13:00',
    location: 'Parque Barigui - Próximo ao Centro de Eventos',
    category: 'Mutirão',
  },
  {
    id: 'evt_02',
    title: 'Oficina Prática: Separação de Resíduos e Economia Circular',
    description:
      'Workshop gratuito sobre higienização correta de embalagens, redução de contaminação na triagem e ciclo do alumínio.',
    date: '2026-09-26 • 14:30 às 16:30',
    location: 'Centro Cultural Batel - Sala Verde',
    category: 'Oficina',
  },
  {
    id: 'evt_03',
    title: 'Campanha Descarte Consciente: PET & Alumínio',
    description:
      'Semana de engajamento comunitário em escolas e comércios locais para incentivar a entrega nos pontos do EcoRetorna.',
    date: '2026-10-05 a 2026-10-10',
    location: 'Todos os EcoPontos da Cidade',
    category: 'Campanha',
  },
  {
    id: 'evt_04',
    title: 'Roda de Conversa: O Papel do Consumidor na Logística Reversa',
    description:
      'Encontro com especialistas em engenharia ambiental e cooperativas para debater o futuro da reciclagem urbana.',
    date: '2026-10-17 • 19:00 às 20:30',
    location: 'Auditório Mercado Municipal',
    category: 'Coleta Especial',
  },
];

/**
 * Ranking de Impacto:
 * Ordenado EXCLUSIVAMENTE por CO2e evitado estimado.
 * Nunca exibe pontos ou dinheiro.
 */
export const RANKING_PARTICIPANTS: RankingParticipant[] = [
  {
    id: 'usr_camila_01',
    position: 1,
    name: 'Camila Ribeiro',
    co2eAvoidedKg: 42.8,
    containersCount: 218,
    isCurrentUser: true,
  },
  {
    id: 'usr_joao_02',
    position: 2,
    name: 'João Martins',
    co2eAvoidedKg: 37.4,
    containersCount: 187,
  },
  {
    id: 'usr_marina_03',
    position: 3,
    name: 'Marina Souza',
    co2eAvoidedKg: 31.9,
    containersCount: 164,
  },
  {
    id: 'usr_lucas_04',
    position: 4,
    name: 'Lucas Andrade',
    co2eAvoidedKg: 28.5,
    containersCount: 145,
  },
  {
    id: 'usr_beatriz_05',
    position: 5,
    name: 'Beatriz Lima',
    co2eAvoidedKg: 24.1,
    containersCount: 122,
  },
  {
    id: 'usr_gabriel_06',
    position: 6,
    name: 'Gabriel Costa',
    co2eAvoidedKg: 19.8,
    containersCount: 101,
  },
  {
    id: 'usr_amanda_07',
    position: 7,
    name: 'Amanda Vieira',
    co2eAvoidedKg: 15.3,
    containersCount: 78,
  },
];
