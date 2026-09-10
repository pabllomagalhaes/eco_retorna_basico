import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Donation,
  Participant,
  RecyclingRecord,
  Redemption,
} from '../types';
import { EcoState, StorageService } from '../services/storage';
import { calculateEnvironmentalImpact, EnvironmentalImpactResult } from '../utils/environmental';
import { pointsToReais } from '../utils/scoring';

interface EcoContextType {
  participant: Participant;
  pointsBalance: number;
  reaisEquivalent: number;
  recyclingRecords: RecyclingRecord[];
  redemptions: Redemption[];
  donations: Donation[];
  badges: Badge[];
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

  // Sincronizar alterações de saldo e participante
  useEffect(() => {
    StorageService.saveBalance(state.pointsBalance);
  }, [state.pointsBalance]);

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

  // Cálculos centrais derivados estritamente da lista de reciclagens
  const totalContainers = useMemo(() => {
    return state.recyclingRecords.reduce((sum, item) => sum + item.quantity, 0);
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

  const reaisEquivalent = useMemo(() => {
    return pointsToReais(state.pointsBalance);
  }, [state.pointsBalance]);

  // Ação de Simular Resgate
  const redeemPoints = (points: number, description = 'Resgate de benefício em créditos'): { success: boolean; message: string } => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para resgatar.' };
    }
    if (points > state.pointsBalance) {
      return {
        success: false,
        message: `Saldo insuficiente. Você possui ${state.pointsBalance} pontos disponíveis.`,
      };
    }

    const newBalance = state.pointsBalance - points;
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
      pointsBalance: newBalance,
      redemptions: [newRedemption, ...prev.redemptions],
    }));

    return {
      success: true,
      message: 'Resgate demonstrativo registrado com sucesso. Nenhuma transferência financeira real foi realizada.',
    };
  };

  // Ação de Doar Pontos
  const donatePoints = (initiativeId: string, initiativeName: string, points: number): { success: boolean; message: string } => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para doação.' };
    }
    if (points > state.pointsBalance) {
      return {
        success: false,
        message: `Saldo insuficiente para doação. Seu saldo atual é de ${state.pointsBalance} pontos.`,
      };
    }

    const newBalance = state.pointsBalance - points;
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
      pointsBalance: newBalance,
      donations: [newDonation, ...prev.donations],
    }));

    return {
      success: true,
      message: 'Doação demonstrativa registrada. Esta operação não representa transferência financeira real.',
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
    pointsBalance: state.pointsBalance,
    reaisEquivalent,
    recyclingRecords: state.recyclingRecords,
    redemptions: state.redemptions,
    donations: state.donations,
    badges: state.badges,
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
