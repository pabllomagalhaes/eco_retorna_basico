import {
  Badge,
  Donation,
  Participant,
  RecyclingRecord,
  Redemption,
} from '../types';
import {
  BADGES,
  INITIAL_DONATIONS,
  INITIAL_PARTICIPANT,
  INITIAL_RECYCLING_RECORDS,
  INITIAL_REDEMPTIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  PARTICIPANT: 'ecoretorna_participant',
  POINTS_BALANCE: 'ecoretorna_points_balance',
  RECORDS: 'ecoretorna_recycling_records',
  REDEMPTIONS: 'ecoretorna_redemptions',
  DONATIONS: 'ecoretorna_donations',
  BADGES: 'ecoretorna_badges',
  IS_LOGGED_IN: 'ecoretorna_is_logged_in',
  READ_ALERTS: 'ecoretorna_read_alerts',
};

export interface EcoState {
  participant: Participant;
  pointsBalance: number;
  recyclingRecords: RecyclingRecord[];
  redemptions: Redemption[];
  donations: Donation[];
  badges: Badge[];
  isLoggedIn: boolean;
}

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const StorageService = {
  loadState(): EcoState {
    if (!isBrowser) {
      return {
        participant: INITIAL_PARTICIPANT,
        pointsBalance: 480,
        recyclingRecords: INITIAL_RECYCLING_RECORDS,
        redemptions: INITIAL_REDEMPTIONS,
        donations: INITIAL_DONATIONS,
        badges: BADGES,
        isLoggedIn: true,
      };
    }
    try {
      const storedParticipant = localStorage.getItem(STORAGE_KEYS.PARTICIPANT);
      const storedBalance = localStorage.getItem(STORAGE_KEYS.POINTS_BALANCE);
      const storedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
      const storedRedemptions = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
      const storedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      const storedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
      const storedAuth = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);

      return {
        participant: storedParticipant ? JSON.parse(storedParticipant) : INITIAL_PARTICIPANT,
        // Initial 480 points as per specification
        pointsBalance: storedBalance !== null ? Number(storedBalance) : 480,
        recyclingRecords: storedRecords ? JSON.parse(storedRecords) : INITIAL_RECYCLING_RECORDS,
        redemptions: storedRedemptions ? JSON.parse(storedRedemptions) : INITIAL_REDEMPTIONS,
        donations: storedDonations ? JSON.parse(storedDonations) : INITIAL_DONATIONS,
        badges: storedBadges ? JSON.parse(storedBadges) : BADGES,
        isLoggedIn: storedAuth !== null ? storedAuth === 'true' : true,
      };
    } catch (e) {
      console.error('Erro ao ler do localStorage, carregando dados padrão:', e);
      return {
        participant: INITIAL_PARTICIPANT,
        pointsBalance: 480,
        recyclingRecords: INITIAL_RECYCLING_RECORDS,
        redemptions: INITIAL_REDEMPTIONS,
        donations: INITIAL_DONATIONS,
        badges: BADGES,
        isLoggedIn: true,
      };
    }
  },

  saveParticipant(participant: Participant): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT, JSON.stringify(participant));
  },

  saveBalance(balance: number): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.POINTS_BALANCE, String(balance));
  },

  saveRedemptions(redemptions: Redemption[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
  },

  saveDonations(donations: Donation[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  },

  saveBadges(badges: Badge[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  },

  saveAuth(isLoggedIn: boolean): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
  },

  clearSession(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANT);
    localStorage.removeItem(STORAGE_KEYS.POINTS_BALANCE);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.REDEMPTIONS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
  },

  getReadAlerts(): string[] {
    if (!isBrowser) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.READ_ALERTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveReadAlerts(ids: string[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.READ_ALERTS, JSON.stringify(ids));
  },

  resetToDemo(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANT);
    localStorage.removeItem(STORAGE_KEYS.POINTS_BALANCE);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.REDEMPTIONS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.BADGES);
    localStorage.removeItem(STORAGE_KEYS.READ_ALERTS);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  },
};
