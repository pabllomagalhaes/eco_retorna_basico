export type MaterialCategory = 'pet' | 'aluminio';

export interface MaterialType {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  unit: string;
  pointsPerUnit: number;
  co2eAvoidedKgPerUnit: number; // kg of CO2e avoided per unit recycled
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
  highContrastMode: boolean;
}

export interface RecyclingRecord {
  id: string;
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
  date: string;
  pointsSpent: number;
  reaisValue: number;
  description: string;
  status: 'concluido' | 'processando';
}

export interface Donation {
  id: string;
  date: string;
  initiativeId: string;
  initiativeName: string;
  pointsDonated: number;
  reaisValue: number;
  status: 'concluido';
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
  notes?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  targetProgress?: number;
  category: 'iniciante' | 'volume' | 'material' | 'impacto';
}

export interface EcoEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Mutirão' | 'Oficina' | 'Campanha' | 'Coleta Especial';
}

export interface RankingParticipant {
  id: string;
  position: number;
  name: string;
  co2eAvoidedKg: number;
  containersCount: number;
  isCurrentUser?: boolean;
}
