import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Challenge,
  Donation,
  Participant,
  RecyclingRecord,
  Redemption,
} from '../types';
import { EcoState, StorageService } from '../services/storage';
import { calculateEnvironmentalImpact, EnvironmentalImpactResult } from '../utils/environmental';
import { calculateBadges, calculateChallenges } from '../utils/gamification';
import {
  calcularSaldoPontos,
  calcularTotalEmbalagens,
  calcularValorEmReais,
  pointsToReais,
} from '../utils/scoring';

interface EcoContextType {
  participant: Participant;
  pointsBalance: number;
  reaisEquivalent: number;
  recyclingRecords: RecyclingRecord[];
  redemptions: Redemption[];
  donations: Donation[];
  badges: Badge[];
  challenges: Challenge[];
  isLoggedIn: boolean;

  // Consistência central de dados
  totalContainers: number;
  petCount: number;
  aluminumCount: number;
  environmentalImpact: EnvironmentalImpactResult;

  // Ações
  login: () => void;
  logout: () => void;
  redeemPoints: (points: number, description?: string) => { success: boolean; message: string };
  donatePoints: (initiativeId: string, initiativeName: string, points: number) => { success: boolean; message: string };
  updateProfile: (updated: Partial<Participant>) => void;
  resetToDemoData: () => void;
}

const EcoContext = createContext<EcoContextType | null>(null);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EcoState>(() => StorageService.loadState());

  useEffect(() => {
    StorageService.saveParticipant(state.participant);
  }, [state.participant]);

  useEffect(() => {
    StorageService.saveRedemptions(state.redemptions);
  }, [state.redemptions]);

  useEffect(() => {
    StorageService.saveDonations(state.donations);
  }, [state.donations]);

  useEffect(() => {
    StorageService.saveAuth(state.isLoggedIn);
  }, [state.isLoggedIn]);

  // Cálculos centrais derivados estritamente da lista de reciclagens e operações
  const totalContainers = useMemo(() => {
    return calcularTotalEmbalagens(state.recyclingRecords);
  }, [state.recyclingRecords]);

  const petCount = useMemo(() => {
    return state.recyclingRecords
      .filter((item) => item.materialCategory === 'pet')
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [state.recyclingRecords]);

  const aluminumCount = useMemo(() => {
    return state.recyclingRecords
      .filter((item) => item.materialCategory === 'aluminio')
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [state.recyclingRecords]);

  const environmentalImpact = useMemo(() => {
    return calculateEnvironmentalImpact(petCount, aluminumCount);
  }, [petCount, aluminumCount]);

  // Saldo calculado estritamente a partir dos registros de reciclagem menos resgates e doações
  const pointsBalance = useMemo(() => {
    const earned = calcularSaldoPontos(state.recyclingRecords);
    const spent =
      state.redemptions.reduce((s, r) => s + r.pointsSpent, 0) +
      state.donations.reduce((s, d) => s + d.pointsDonated, 0);
    return Math.max(0, earned - spent);
  }, [state.recyclingRecords, state.redemptions, state.donations]);

  // Sincronizar persistência do saldo
  useEffect(() => {
    StorageService.saveBalance(pointsBalance);
  }, [pointsBalance]);

  const reaisEquivalent = useMemo(() => {
    return calcularValorEmReais(pointsBalance);
  }, [pointsBalance]);

  // Badges e desafios derivados estritamente dos registros reais de reciclagem
  const badges = useMemo(() => {
    return calculateBadges(state.recyclingRecords);
  }, [state.recyclingRecords]);

  const challenges = useMemo(() => {
    return calculateChallenges(state.recyclingRecords);
  }, [state.recyclingRecords]);

  // Ação de Simular Resgate
  const redeemPoints = (points: number, description = 'Resgate de benefício em créditos'): { success: boolean; message: string } => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para resgatar.' };
    }
    if (points > pointsBalance) {
      return {
        success: false,
        message: 'Saldo de pontos insuficiente.',
      };
    }

    const reais = pointsToReais(points);
    const newRedemption: Redemption = {
      id: `red_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pointsSpent: points,
      reaisValue: reais,
      description,
      status: 'concluido',
    };

    setState((prev) => ({
      ...prev,
      redemptions: [newRedemption, ...prev.redemptions],
    }));

    return {
      success: true,
      message: 'Resgate demonstrativo registrado. Nenhuma transferência financeira real foi realizada.',
    };
  };

  // Ação de Doar Pontos
  const donatePoints = (initiativeId: string, initiativeName: string, points: number): { success: boolean; message: string } => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para doação.' };
    }
    if (points > pointsBalance) {
      return {
        success: false,
        message: 'Saldo de pontos insuficiente.',
      };
    }

    const reais = pointsToReais(points);
    const newDonation: Donation = {
      id: `don_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      initiativeId,
      initiativeName,
      pointsDonated: points,
      reaisValue: reais,
      status: 'concluido',
    };

    setState((prev) => ({
      ...prev,
      donations: [newDonation, ...prev.donations],
    }));

    return {
      success: true,
      message: 'Doação demonstrativa registrada.',
    };
  };

  const updateProfile = (updated: Partial<Participant>) => {
    setState((prev) => ({
      ...prev,
      participant: {
        ...prev.participant,
        ...updated,
      },
    }));
  };

  const login = () => {
    setState((prev) => ({ ...prev, isLoggedIn: true }));
  };

  const logout = () => {
    setState((prev) => ({ ...prev, isLoggedIn: false }));
  };

  const resetToDemoData = () => {
    StorageService.resetToDemo();
    const fresh = StorageService.loadState();
    setState(fresh);
  };

  const value: EcoContextType = {
    participant: state.participant,
    pointsBalance,
    reaisEquivalent,
    recyclingRecords: state.recyclingRecords,
    redemptions: state.redemptions,
    donations: state.donations,
    badges,
    challenges,
    isLoggedIn: state.isLoggedIn,
    totalContainers,
    petCount,
    aluminumCount,
    environmentalImpact,
    login,
    logout,
    redeemPoints,
    donatePoints,
    updateProfile,
    resetToDemoData,
  };

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
};

export const useEco = (): EcoContextType => {
  const context = useContext(EcoContext);
  if (!context) {
    throw new Error('useEco deve ser utilizado dentro de um EcoProvider');
  }
  return context;
};
