import {
  Badge,
  CollectionPoint,
  Donation,
  EcoEvent,
  EcoEventAlert,
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
  motivationalMessages: true,
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
  // Mês atual: 26 embalagens recentes (20 PET + 6 Alumínio)
  {
    id: 'rec_01',
    date: '2026-09-08',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 2,
    pointsEarned: calculatePoints(2, 2),
    reaisEquivalent: pointsToReais(calculatePoints(2, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 2),
    collectionPointName: 'EcoPonto Praça da Sustentabilidade',
  },
  {
    id: 'rec_02',
    date: '2026-09-05',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 6,
    pointsEarned: calculatePoints(6, 2),
    reaisEquivalent: pointsToReais(calculatePoints(6, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 6),
    collectionPointName: 'Estação Central Verde',
  },
  {
    id: 'rec_03',
    date: '2026-09-01',
    materialId: 'pet_2l',
    materialName: 'Garrafa PET 2 L',
    materialCategory: 'pet',
    quantity: 18,
    pointsEarned: calculatePoints(18, 2),
    reaisEquivalent: pointsToReais(calculatePoints(18, 2)),
    co2eAvoidedKg: getSingleItemImpact('pet', 18),
    collectionPointName: 'Ponto Verde Mercado Municipal',
  },

  // Mês anterior (Agosto): 37 embalagens (14 PET + 23 Alumínio)
  {
    id: 'rec_04',
    date: '2026-08-27',
    materialId: 'lata_aluminio',
    materialName: 'Lata de Alumínio',
    materialCategory: 'aluminio',
    quantity: 23,
    pointsEarned: calculatePoints(23, 2),
    reaisEquivalent: pointsToReais(calculatePoints(23, 2)),
    co2eAvoidedKg: getSingleItemImpact('aluminio', 23),
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
    operatingHours: '08:00 às 19:00',
    acceptedMaterials: ['PET', 'Alumínio'],
    latitude: -25.4411,
    longitude: -49.2785,
    description: 'Ponto de coleta de alta capacidade com fácil acesso para pedestres e ciclistas na praça central.',
    active: true,
    notes: 'Acesso facilitado para pedestres e bicicletas.',
  },
  {
    id: 'pt_02',
    name: 'Estação Central Verde',
    address: 'Rua XV de Novembro, 1280',
    neighborhood: 'Centro',
    city: 'Curitiba - PR',
    operatingHours: '07:30 às 20:00',
    acceptedMaterials: ['PET', 'Alumínio'],
    latitude: -25.4284,
    longitude: -49.2673,
    description: 'Localizada no calçadão central, com grande fluxo e recebimento contínuo de embalagens descartadas.',
    active: true,
    notes: 'Próximo à estação tubo de transporte público.',
  },
  {
    id: 'pt_03',
    name: 'Ponto Verde Mercado Municipal',
    address: 'Av. Presidente Affonso Camargo, 1993',
    neighborhood: 'Jardim Botânico',
    city: 'Curitiba - PR',
    operatingHours: '08:00 às 18:00',
    acceptedMaterials: ['PET', 'Alumínio'],
    latitude: -25.4346,
    longitude: -49.2558,
    description: 'Estação situada na área externa do Mercado Municipal, com ampla sinalização de reciclagem.',
    active: true,
    notes: 'Localizado no estacionamento lateral do mercado.',
  },
  {
    id: 'pt_04',
    name: 'Estação Parque Barigui',
    address: 'Alameda Ecológica Burle Marx, s/n',
    neighborhood: 'Santo Inácio',
    city: 'Curitiba - PR',
    operatingHours: '06:00 às 20:00',
    acceptedMaterials: ['PET', 'Alumínio'],
    latitude: -25.4261,
    longitude: -49.3092,
    description: 'Ponto em parque ecológico para descarte correto durante caminhadas e atividades ao ar livre.',
    active: true,
    notes: 'Ponto com alta procura durante finais de semana.',
  },
  {
    id: 'pt_05',
    name: 'EcoPonto Cabral Conectado',
    address: 'Av. Paraná, 1100',
    neighborhood: 'Cabral',
    city: 'Curitiba - PR',
    operatingHours: '08:30 às 18:30',
    acceptedMaterials: ['PET'],
    latitude: -25.4098,
    longitude: -49.2523,
    description: 'Ponto voltado exclusivamente para garrafas PET 2L, com triagem imediata para cooperativas.',
    active: true,
    notes: 'Próximo ao terminal do Cabral.',
  },
  {
    id: 'pt_06',
    name: 'Estação Metal Portão',
    address: 'Rua Itacolomi, 250',
    neighborhood: 'Portão',
    city: 'Curitiba - PR',
    operatingHours: '08:00 às 19:00',
    acceptedMaterials: ['Alumínio'],
    latitude: -25.4752,
    longitude: -49.2941,
    description: 'Especializada no recolhimento de latas de alumínio para direcionamento à fundição limpa.',
    active: true,
    notes: 'Estacionamento rápido disponível.',
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
    condition: 'Reciclar 1 embalagem',
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
    condition: 'Reciclar 50 embalagens no total',
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
    condition: 'Reciclar 25 latas de alumínio',
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
    condition: 'Alcançar 40 kg de CO₂e evitado estimado',
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
    condition: 'Reciclar 300 embalagens no total',
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
    condition: 'Reciclar 100 latas de alumínio',
    iconName: 'Sparkles',
    unlocked: false,
    currentProgress: 88,
    targetProgress: 100,
    category: 'material',
  },
];

export const ECO_EVENTS_AND_ALERTS: EcoEventAlert[] = [
  // --- EVENTOS FICTÍCIOS ---
  {
    id: 'evt_01',
    title: 'Mutirão de Reciclagem',
    description: 'Participe de uma ação coletiva de separação e destinação de materiais recicláveis.',
    fullDescription: 'Ação comunitária voluntária e aberta a todos os cidadãos para triagem, separação e destinação ambientalmente adequada de embalagens plásticas e latinhas de alumínio. Haverá estações volantes de orientação ecológica e cálculo de impacto.',
    date: '20/09/2026',
    time: '09:00 às 13:00',
    location: 'Praça Central',
    category: 'Reciclagem',
    type: 'evento',
    active: true,
  },
  {
    id: 'evt_02',
    title: 'Semana do Meio Ambiente',
    description: 'Atividades educativas sobre sustentabilidade e consumo consciente.',
    fullDescription: 'Ciclo de palestras, rodas de conversa e oficinas práticas voltadas à conscientização sobre ciclo de vida dos produtos, redução da pegada de carbono, conservação de recursos hídricos e logística reversa na cidade.',
    date: '05/10/2026 a 10/10/2026',
    time: '14:00 às 18:00',
    location: 'Auditório do Parque das Águas',
    category: 'Sustentabilidade',
    type: 'evento',
    active: true,
  },
  {
    id: 'evt_03',
    title: 'Campanha de Coleta de PET',
    description: 'Campanha especial para incentivar a destinação correta de embalagens PET.',
    fullDescription: 'Iniciativa especial e temporária em todos os postos de entrega do EcoRetorna para ampliar a arrecadação de garrafas PET (2 L e 500 mL). Cada entrega contribui para o fornecimento direto a cooperativas locais de catadores de materiais recicláveis.',
    date: '15/10/2026 a 22/10/2026',
    time: 'Horário de funcionamento dos postos',
    location: 'Todos os Postos EcoRetorna',
    category: 'Coleta seletiva',
    type: 'evento',
    active: true,
  },
  {
    id: 'evt_04',
    title: 'Oficina Prática: Separação de Resíduos',
    description: 'Workshop sobre correta higienização e segregação de embalagens para triagem.',
    fullDescription: 'Aprenda como higienizar corretamente garrafas plásticas e latinhas, evitar contaminações no fluxo de reciclagem, economizar água no enxágue e potencializar o aproveitamento dos materiais pelas cooperativas e usinas de reciclagem.',
    date: '26/10/2026',
    time: '14:30 às 16:30',
    location: 'Centro Cultural Batel - Sala Verde',
    category: 'Reciclagem',
    type: 'evento',
    active: true,
  },

  // --- ALERTAS DEMONSTRATIVOS ---
  {
    id: 'alt_01',
    title: 'Novo ponto de coleta disponível',
    description: 'Um novo ponto de entrega voluntária foi instalado próximo à Praça da Ucrânia. Confira no mapa de postos!',
    fullDescription: 'O EcoPonto Praça da Ucrânia já está ativo e operando diariamente das 08:00 às 19:00. Ele aceita garrafas PET (2L e 500mL) e latas de alumínio. Você pode consultá-lo na seção Postos & Mapa da plataforma.',
    date: '08/09/2026',
    time: '10:15',
    location: 'Bairro Batel / Bigorrilho',
    category: 'Coleta seletiva',
    type: 'alerta',
    active: true,
    severity: 'sucesso',
  },
  {
    id: 'alt_02',
    title: 'Campanha de PET termina nesta semana',
    description: 'Aproveite os últimos dias da campanha especial para entregar garrafas PET nos postos credenciados.',
    fullDescription: 'A campanha temática com foco na arrecadação de garrafas plásticas termina neste domingo. Lembre-se de higienizar suas garrafas e retirar tampas e rótulos quando possível para facilitar a triagem.',
    date: '07/09/2026',
    time: '08:30',
    location: 'Rede de Postos Parceiros',
    category: 'Reciclagem',
    type: 'alerta',
    active: true,
    severity: 'aviso',
  },
  {
    id: 'alt_03',
    title: 'Confira suas novas conquistas',
    description: 'Você já acumulou 4 conquistas ecológicas. Acesse a aba Desafios & Badges para visualizar seus selos.',
    fullDescription: 'Com suas 218 embalagens recicladas e mais de 42 kg de CO₂e evitados, você já desbloqueou os selos Primeira Conexão, Ciclo Inicial, Guardião de 100 Embalagens e Redutor de Carbono. Continue reciclando para novas conquistas!',
    date: '04/09/2026',
    time: '16:00',
    location: 'Plataforma EcoRetorna',
    category: 'Sustentabilidade',
    type: 'alerta',
    active: true,
    severity: 'info',
  },
  {
    id: 'alt_04',
    title: 'Horário especial de feriado nos postos',
    description: 'Alguns postos parceiros terão horários especiais no próximo feriado municipal. Consulte a lista de postos antes de ir.',
    fullDescription: 'No feriado desta semana, os postos situados em parques públicos e shoppings operarão em regime de plantão das 10:00 às 16:00. Verifique previamente o status e o endereço completo no menu Postos & Mapa.',
    date: '01/09/2026',
    time: '09:00',
    location: 'Postos Conveniados',
    category: 'Coleta seletiva',
    type: 'alerta',
    active: true,
    severity: 'info',
  },
];

export const ECO_EVENTS: EcoEvent[] = ECO_EVENTS_AND_ALERTS
  .filter((item) => item.type === 'evento')
  .map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.time ? `${item.date} • ${item.time}` : item.date,
    location: item.location || 'Local a definir',
    category: item.category as any,
  }));

/**
 * Participantes fictícios da comunidade para o Ranking de Impacto.
 * Contém quantidades de PET e Alumínio para cálculo dinâmico através dos fatores centrais.
 */
export interface CommunityParticipantRaw {
  id: string;
  name: string;
  petCount: number;
  aluminumCount: number;
}

export const COMMUNITY_PARTICIPANTS_RAW: CommunityParticipantRaw[] = [
  {
    id: 'usr_joao_02',
    name: 'João Martins',
    petCount: 94,
    aluminumCount: 93, // 187 embalagens -> 94*0.18 + 93*0.22 = 37.38 ≈ 37,4 kg CO2e
  },
  {
    id: 'usr_marina_03',
    name: 'Marina Souza',
    petCount: 104,
    aluminumCount: 60, // 164 embalagens -> 104*0.18 + 60*0.22 = 31.92 ≈ 31,9 kg CO2e
  },
  {
    id: 'usr_lucas_04',
    name: 'Lucas Andrade',
    petCount: 85,
    aluminumCount: 60, // 145 embalagens -> 85*0.18 + 60*0.22 = 28.5 kg CO2e
  },
  {
    id: 'usr_beatriz_05',
    name: 'Beatriz Lima',
    petCount: 70,
    aluminumCount: 52, // 122 embalagens -> 70*0.18 + 52*0.22 = 24.04 ≈ 24,0 kg CO2e
  },
  {
    id: 'usr_gabriel_06',
    name: 'Gabriel Costa',
    petCount: 60,
    aluminumCount: 41, // 101 embalagens -> 60*0.18 + 41*0.22 = 19.82 ≈ 19,8 kg CO2e
  },
  {
    id: 'usr_amanda_07',
    name: 'Amanda Vieira',
    petCount: 45,
    aluminumCount: 33, // 78 embalagens -> 45*0.18 + 33*0.22 = 15.36 ≈ 15,4 kg CO2e
  },
  {
    id: 'usr_rodrigo_08',
    name: 'Rodrigo Pires',
    petCount: 36,
    aluminumCount: 26, // 62 embalagens -> 36*0.18 + 26*0.22 = 12.2 kg CO2e
  },
  {
    id: 'usr_larissa_09',
    name: 'Larissa Mendes',
    petCount: 28,
    aluminumCount: 18, // 46 embalagens -> 28*0.18 + 18*0.22 = 9.0 kg CO2e
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
    co2eAvoidedKg: 15.4,
    containersCount: 78,
  },
];
