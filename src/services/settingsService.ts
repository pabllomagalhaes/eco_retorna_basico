import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { GeneralSettings } from '../types';
import { REAIS_PER_POINT, INITIAL_WELCOME_BONUS_POINTS } from '../utils/scoring';
import { environmentalFactors } from '../utils/environmental';

export const DEFAULT_SETTINGS: GeneralSettings = {
  pointValueBRL: REAIS_PER_POINT,
  environmentalFactors: {
    co2eKg: {
      pet: environmentalFactors.co2eKg.pet,
      aluminio: environmentalFactors.co2eKg.aluminio,
    },
    disclaimer: environmentalFactors.disclaimer,
  },
  initialBonusPoints: INITIAL_WELCOME_BONUS_POINTS,
};

export const SettingsService = {
  getDefaultSettings(): GeneralSettings {
    return DEFAULT_SETTINGS;
  },

  async getGeneralSettings(): Promise<GeneralSettings> {
    if (!isFirebaseConfigured || !db) {
      return DEFAULT_SETTINGS;
    }

    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          pointValueBRL: data.pointValueBRL !== undefined ? Number(data.pointValueBRL) : DEFAULT_SETTINGS.pointValueBRL,
          environmentalFactors: {
            co2eKg: {
              pet: data.environmentalFactors?.co2eKg?.pet ?? DEFAULT_SETTINGS.environmentalFactors.co2eKg.pet,
              aluminio: data.environmentalFactors?.co2eKg?.aluminio ?? DEFAULT_SETTINGS.environmentalFactors.co2eKg.aluminio,
            },
            disclaimer: data.environmentalFactors?.disclaimer ?? DEFAULT_SETTINGS.environmentalFactors.disclaimer,
          },
          initialBonusPoints: data.initialBonusPoints !== undefined ? Number(data.initialBonusPoints) : DEFAULT_SETTINGS.initialBonusPoints,
        };
      }
      return DEFAULT_SETTINGS;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao carregar configurações do Firestore:', err);
      throw err;
    }
  },

  convertPointsToReais(points: number, pointValueBRL: number = DEFAULT_SETTINGS.pointValueBRL): number {
    if (points <= 0 || isNaN(points)) return 0;
    return Number((points * pointValueBRL).toFixed(2));
  },
};
