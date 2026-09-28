export type MaterialCategory = 'pet' | 'aluminio';

export interface MaterialType {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  unit: string;
  pointsPerUnit: number;
  co2eAvoidedKgPerUnit: number; // kg of CO2e avoided per unit recycled
  co2eFactor?: number;
  active?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  registeredAt: string; // ISO date or formatted
  city: string;
  neighborhood: string;
  avatarUrl?: string;
  notificationsEnabled: boolean;
  motivationalMessages?: boolean;
  highContrastMode: boolean;
  createdAt?: string;
  active?: boolean;
}

export interface RecyclingRecord {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  materialId: string;
  materialName: string;
  materialCategory: MaterialCategory;
  quantity: number;
  pointsEarned: number;
  reaisEquivalent: number;
  co2eAvoidedKg: number;
  collectionPointName: string;
}

export interface Redemption {
  id: string;
  userId?: string;
  benefitId?: string;
  benefitTitle?: string;
  date: string;
  pointsSpent: number;
  reaisValue: number;
  description: string;
  status: 'concluido' | 'processando';
  demonstrative?: boolean;
  createdAt?: string;
}

export interface Donation {
  id: string;
  userId?: string;
  date: string;
  initiativeId: string;
  initiativeName: string;
  pointsDonated: number;
  reaisValue: number;
  status: 'concluido';
  demonstrative?: boolean;
  createdAt?: string;
}

export type BenefitCategory = 'gift' | 'donation' | 'other';

export interface Benefit {
  id: string;
  title: string;
  description: string;
  category: BenefitCategory;
  pointsRequired: number;
  stock: number | null;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Initiative {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  cause: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  operatingHours: string;
  acceptedMaterials: string[];
  latitude: number;
  longitude: number;
  description: string;
  active: boolean;
  notes?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  condition: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  targetProgress?: number;
  unit?: string;
  category: 'iniciante' | 'volume' | 'material' | 'impacto';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  condition: string;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  category: 'volume' | 'material' | 'impacto';
  iconName: string;
  completed: boolean;
}

export type EcoItemCategory = 'Reciclagem' | 'Sustentabilidade' | 'Coleta seletiva' | 'Comunidade';
export type EcoItemType = 'evento' | 'alerta';

export interface EcoEventAlert {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  time?: string;
  location?: string;
  category: EcoItemCategory;
  type: EcoItemType;
  active: boolean;
  severity?: 'info' | 'aviso' | 'sucesso';
}

export interface EcoEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Mutirão' | 'Oficina' | 'Campanha' | 'Coleta Especial' | 'Reciclagem' | 'Sustentabilidade' | 'Coleta seletiva';
}

export interface RankingParticipant {
  id: string;
  position: number;
  name: string;
  co2eAvoidedKg: number;
  containersCount: number;
  isCurrentUser?: boolean;
}

export interface GeneralSettings {
  pointValueBRL: number;
  environmentalFactors: {
    co2eKg: {
      pet: number;
      aluminio: number;
    };
    disclaimer: string;
  };
  initialBonusPoints?: number;
}

export type CampaignType = 'multiplier' | 'quantity_bonus';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: CampaignType;
  materialId: string;
  multiplier?: number;
  minimumQuantity?: number;
  bonusPoints?: number;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  active: boolean;
  createdAt?: string;
  createdBy?: string;
}

