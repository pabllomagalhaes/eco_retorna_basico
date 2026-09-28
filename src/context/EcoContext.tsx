import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Challenge,
  Donation,
  Participant,
  RecyclingRecord,
  Redemption,
  MaterialType,
  Campaign,
  GeneralSettings,
} from '../types';
import { EcoState, StorageService } from '../services/storage';
import {
  calculateEnvironmentalImpact,
  calculateTotalByMaterial,
  EnvironmentalImpactResult,
} from '../utils/environmental';
import { calculateBadges, calculateChallenges } from '../utils/gamification';
import {
  calcularSaldoPontos,
  calcularValorEmReais,
  pointsToReais,
  INITIAL_WELCOME_BONUS_POINTS,
  STANDARD_MATERIALS,
} from '../utils/scoring';
import { isFirebaseConfigured } from '../firebase/config';
import { AuthService } from '../services/authService';
import { ParticipantService } from '../services/participantService';
import { RecyclingService } from '../services/recyclingService';
import { BenefitService } from '../services/benefitService';
import { MaterialService } from '../services/materialService';
import { CampaignService } from '../services/campaignService';
import { SettingsService, DEFAULT_SETTINGS } from '../services/settingsService';

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

  // Estados de conectividade e carregamento
  isLoading: boolean;
  isUsingFirebase: boolean;
  error: string | null;

  // Materiais, Campanhas e Configurações Dinâmicas
  materials: MaterialType[];
  campaigns: Campaign[];
  settings: GeneralSettings;
  isMaterialsLoading: boolean;
  materialsError: string | null;
  refreshMaterialsAndCampaigns: () => Promise<void>;

  // Consistência central de dados (sempre derivados, nunca persistidos como duplicatas)
  totalContainers: number;
  petCount: number;
  aluminumCount: number;
  environmentalImpact: EnvironmentalImpactResult;

  // Ações
  login: (email?: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  redeemPoints: (points: number, description?: string, benefitId?: string, benefitTitle?: string) => Promise<{ success: boolean; message: string }>;
  donatePoints: (initiativeId: string, initiativeName: string, points: number) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updated: Partial<Participant>) => Promise<void>;
  resetToDemoData: () => void;
}

const EcoContext = createContext<EcoContextType | null>(null);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização síncrona segura: em modo local usa StorageService; em modo Firebase aguarda onAuthStateChanged
  const [state, setState] = useState<EcoState>(() => {
    if (isFirebaseConfigured) {
      return {
        participant: {
          id: '',
          name: '',
          email: '',
          registeredAt: '',
          city: '',
          neighborhood: '',
          avatarUrl: '',
          notificationsEnabled: true,
          motivationalMessages: true,
          highContrastMode: false,
        },
        pointsBalance: 0,
        reaisEquivalent: 0,
        recyclingRecords: [],
        redemptions: [],
        donations: [],
        isLoggedIn: false,
      };
    }
    return StorageService.loadState();
  });
  const [isLoading, setIsLoading] = useState<boolean>(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // Estados dinâmicos de materiais, campanhas e configurações
  const [materials, setMaterials] = useState<MaterialType[]>(() => {
    if (!isFirebaseConfigured) {
      return [...STANDARD_MATERIALS];
    }
    return [];
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState<boolean>(isFirebaseConfigured);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  // Recarregamento manual seguro de materiais e campanhas (preservado para chamadas manuais futuras)
  const refreshMaterialsAndCampaigns = async () => {
    if (!AuthService.isConfigured()) {
      setMaterials([...STANDARD_MATERIALS]);
      setCampaigns([]);
      setSettings(DEFAULT_SETTINGS);
      setIsMaterialsLoading(false);
      return;
    }

    // Se Firebase estiver configurado mas o usuário NÃO estiver autenticado, não faz chamada protegida
    if (!AuthService.getCurrentUser()) {
      return;
    }

    try {
      setIsMaterialsLoading(true);
      setMaterialsError(null);
      const [fetchedMaterials, fetchedCampaigns, fetchedSettings] = await Promise.all([
        MaterialService.getActiveMaterials(),
        CampaignService.getActiveCampaigns(),
        SettingsService.getGeneralSettings(),
      ]);
      setMaterials(fetchedMaterials);
      setCampaigns(fetchedCampaigns);
      setSettings(fetchedSettings);
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao recarregar materiais e configurações do Firestore:', err);
      setMaterialsError('Não foi possível carregar as informações do sistema.');
    } finally {
      setIsMaterialsLoading(false);
    }
  };

  // Observação de sessão via AuthService com carregamento condicionado à autenticação
  useEffect(() => {
    let isMounted = true;

    // 1. Fallback local: quando Firebase NÃO está configurado
    if (!AuthService.isConfigured()) {
      setIsLoading(false);
      setIsMaterialsLoading(false);
      setMaterials([...STANDARD_MATERIALS]);
      setCampaigns([]);
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    // 2. Firebase ativo: escuta mudanças reais de autenticação via AuthService
    setIsLoading(true);
    setIsMaterialsLoading(true);
    const unsubscribe = AuthService.onAuthStateChanged(async (authUser) => {
      if (!isMounted) return;

      if (authUser) {
        const uid = authUser.uid;
        try {
          setIsLoading(true);
          setError(null);
          setIsMaterialsLoading(true);
          setMaterialsError(null);

          // 1. ANTES de carregar qualquer serviço ou dado protegido:
          // Consultar users/{authUser.uid} e exigir role === "participant" && active === true
          const validation = await AuthService.validateParticipant(uid);

          if (!validation.valid) {
            console.warn(`[EcoRetorna] Sessão rejeitada para o UID ${uid}: ${validation.message}`);
            // Executar logout/signOut imediato
            await AuthService.logout();
            StorageService.clearSession();

            if (isMounted) {
              // Limpar completamente o estado do participante
              setState((prev) => ({
                ...prev,
                isLoggedIn: false,
                participant: {
                  id: '',
                  name: '',
                  email: '',
                  registeredAt: '',
                  city: '',
                  neighborhood: '',
                  avatarUrl: '',
                  notificationsEnabled: true,
                  motivationalMessages: true,
                  highContrastMode: false,
                },
                recyclingRecords: [],
                redemptions: [],
                donations: [],
              }));
              setMaterials([]);
              setCampaigns([]);
              setSettings(DEFAULT_SETTINGS);
              setError(validation.message || 'Esta conta não possui acesso à área do participante.');
              setIsLoading(false);
              setIsMaterialsLoading(false);
            }
            return;
          }

          // 2. Apenas após validação estrita positiva: carregar dados do participante
          const [
            remoteParticipant,
            remoteRecords,
            remoteRedemptions,
            remoteDonations,
            fetchedMaterials,
            fetchedCampaigns,
            fetchedSettings,
          ] = await Promise.all([
            ParticipantService.getParticipant(uid),
            RecyclingService.getRecyclingRecords(uid),
            BenefitService.getRedemptions(uid),
            BenefitService.getDonations(uid),
            MaterialService.getActiveMaterials(),
            CampaignService.getActiveCampaigns(),
            SettingsService.getGeneralSettings(),
          ]);

          if (isMounted) {
            setState((prev) => ({
              ...prev,
              isLoggedIn: true,
              participant: {
                ...remoteParticipant,
                id: uid,
                name: remoteParticipant.name || authUser.displayName || 'Participante EcoRetorna',
                email: authUser.email || remoteParticipant.email,
              },
              recyclingRecords: remoteRecords,
              redemptions: remoteRedemptions,
              donations: remoteDonations,
            }));
            setMaterials(fetchedMaterials);
            setCampaigns(fetchedCampaigns);
            setSettings(fetchedSettings);
          }
        } catch (err: any) {
          console.warn('[EcoRetorna] Erro ao sincronizar dados do participante no Firestore:', err);
          await AuthService.logout();
          StorageService.clearSession();
          if (isMounted) {
            setState((prev) => ({
              ...prev,
              isLoggedIn: false,
              participant: {
                id: '',
                name: '',
                email: '',
                registeredAt: '',
                city: '',
                neighborhood: '',
                avatarUrl: '',
                notificationsEnabled: true,
                motivationalMessages: true,
                highContrastMode: false,
              },
              recyclingRecords: [],
              redemptions: [],
              donations: [],
            }));
            setMaterials([]);
            setCampaigns([]);
            setSettings(DEFAULT_SETTINGS);
            setError(err?.message || 'Não foi possível sincronizar seus dados da nuvem.');
            setMaterialsError('Não foi possível carregar as informações do sistema.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
            setIsMaterialsLoading(false);
          }
        }
      } else {
        // Usuário deslogado no Firebase (ex.: tela /login pública)
        // NÃO faz nenhuma chamada ao Firestore para evitar permission-denied
        if (isMounted) {
          StorageService.clearSession();
          setState((prev) => ({
            ...prev,
            isLoggedIn: false,
            participant: {
              id: '',
              name: '',
              email: '',
              registeredAt: '',
              city: '',
              neighborhood: '',
              avatarUrl: '',
              notificationsEnabled: true,
              motivationalMessages: true,
              highContrastMode: false,
            },
            recyclingRecords: [],
            redemptions: [],
            donations: [],
          }));
          setMaterials([]);
          setCampaigns([]);
          setSettings(DEFAULT_SETTINGS);
          setIsLoading(false);
          setIsMaterialsLoading(false);
          setMaterialsError(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Persistência em cache local para reatividade instantânea
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
  const { pet: petCount, aluminio: aluminumCount, total: totalContainers } = useMemo(() => {
    return calculateTotalByMaterial(state.recyclingRecords);
  }, [state.recyclingRecords]);

  const environmentalImpact = useMemo(() => {
    return calculateEnvironmentalImpact(petCount, aluminumCount, state.recyclingRecords);
  }, [petCount, aluminumCount, state.recyclingRecords]);

  // Saldo calculado estritamente a partir dos registros de reciclagem menos resgates e doações
  const pointsBalance = useMemo(() => {
    const bonus = isFirebaseConfigured ? 0 : INITIAL_WELCOME_BONUS_POINTS;
    const earned = calcularSaldoPontos(state.recyclingRecords, bonus);
    const spent =
      state.redemptions.reduce((s, r) => s + r.pointsSpent, 0) +
      state.donations.reduce((s, d) => s + d.pointsDonated, 0);
    return Math.max(0, earned - spent);
  }, [state.recyclingRecords, state.redemptions, state.donations]);

  // Sincronizar persistência do saldo no cache
  useEffect(() => {
    StorageService.saveBalance(pointsBalance);
  }, [pointsBalance]);

  const reaisEquivalent = useMemo(() => {
    return calcularValorEmReais(pointsBalance, settings.pointValueBRL);
  }, [pointsBalance, settings.pointValueBRL]);

  // Badges e desafios derivados estritamente dos registros reais de reciclagem
  const badges = useMemo(() => {
    return calculateBadges(state.recyclingRecords);
  }, [state.recyclingRecords]);

  const challenges = useMemo(() => {
    return calculateChallenges(state.recyclingRecords);
  }, [state.recyclingRecords]);

  // Ação de Simular Resgate
  const redeemPoints = async (
    points: number,
    description = 'Resgate demonstrativo de benefício',
    benefitId = '',
    benefitTitle = ''
  ): Promise<{ success: boolean; message: string }> => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para resgatar.' };
    }
    if (points > pointsBalance) {
      return {
        success: false,
        message: 'Saldo de pontos insuficiente.',
      };
    }

    try {
      const reais = pointsToReais(points, settings.pointValueBRL);
      const newRedemption = await BenefitService.createRedemption(
        state.participant.id || 'usr_camila_01',
        points,
        reais,
        description,
        benefitId,
        benefitTitle
      );

      setState((prev) => ({
        ...prev,
        redemptions: [newRedemption, ...prev.redemptions],
      }));

      return {
        success: true,
        message: 'Resgate demonstrativo registrado. Nenhuma transferência financeira real foi realizada.',
      };
    } catch (err) {
      console.error('[EcoRetorna] Erro ao registrar resgate:', err);
      return {
        success: false,
        message: 'Falha ao registrar resgate no servidor. Tente novamente mais tarde.',
      };
    }
  };

  // Ação de Doar Pontos
  const donatePoints = async (initiativeId: string, initiativeName: string, points: number): Promise<{ success: boolean; message: string }> => {
    if (points <= 0) {
      return { success: false, message: 'Selecione uma quantidade positiva de pontos para doação.' };
    }
    if (points > pointsBalance) {
      return {
        success: false,
        message: 'Saldo de pontos insuficiente.',
      };
    }

    try {
      const reais = pointsToReais(points, settings.pointValueBRL);
      const newDonation = await BenefitService.createDonation(
        state.participant.id || 'usr_camila_01',
        initiativeId,
        initiativeName,
        points,
        reais
      );

      setState((prev) => ({
        ...prev,
        donations: [newDonation, ...prev.donations],
      }));

      return {
        success: true,
        message: 'Doação demonstrativa registrada.',
      };
    } catch (err) {
      console.error('[EcoRetorna] Erro ao registrar doação:', err);
      return {
        success: false,
        message: 'Falha ao registrar doação no servidor. Tente novamente mais tarde.',
      };
    }
  };

  const updateProfile = async (updated: Partial<Participant>) => {
    const userId = state.participant.id || 'usr_camila_01';
    await ParticipantService.updateParticipant(userId, updated);
    setState((prev) => ({
      ...prev,
      participant: {
        ...prev.participant,
        ...updated,
      },
    }));
  };

  const login = async (email?: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    if (!AuthService.isConfigured()) {
      // Modo local / fallback demonstrativo
      setState((prev) => ({ ...prev, isLoggedIn: true }));
      return { success: true };
    }

    if (!email || !password) {
      return { success: false, message: 'Informe seu e-mail e código de acesso.' };
    }

    return await AuthService.login({ email, password });
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    StorageService.clearSession();
    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
      participant: {
        id: '',
        name: '',
        email: '',
        registeredAt: '',
        city: '',
        neighborhood: '',
        avatarUrl: '',
        notificationsEnabled: true,
        motivationalMessages: true,
        highContrastMode: false,
      },
      recyclingRecords: [],
      redemptions: [],
      donations: [],
    }));
  };

  const resetToDemoData = () => {
    if (isFirebaseConfigured) {
      console.warn('[EcoRetorna] Restauração de dados demonstrativos desabilitada quando o Firebase está ativo.');
      return;
    }
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
    isLoading,
    isUsingFirebase: isFirebaseConfigured,
    error,
    materials,
    campaigns,
    settings,
    isMaterialsLoading,
    materialsError,
    refreshMaterialsAndCampaigns,
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
