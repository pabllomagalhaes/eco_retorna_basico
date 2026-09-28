import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { Campaign, MaterialType } from '../types';

export interface CampaignBonusResult {
  bonusPoints: number;
  totalPoints: number;
  explanation?: string;
  appliedCampaign: Campaign | null;
}

export const CampaignService = {
  /**
   * Verifica se uma campanha está ativa para uma data específica (padrão: hoje)
   */
  isCampaignActive(campaign: Campaign, targetDate: Date = new Date()): boolean {
    if (!campaign.active) return false;
    if (!campaign.startDate || !campaign.endDate) return false;

    // Normaliza para 'YYYY-MM-DD'
    const todayStr = targetDate.toISOString().split('T')[0];
    return todayStr >= campaign.startDate && todayStr <= campaign.endDate;
  },

  /**
   * Busca campanhas ativas no Firestore.
   * Quando o Firebase NÃO estiver configurado, retorna lista vazia de fallback.
   */
  async getActiveCampaigns(): Promise<Campaign[]> {
    if (!isFirebaseConfigured || !db) {
      return [];
    }

    try {
      const colRef = collection(db, 'campaigns');
      const snap = await getDocs(colRef);

      if (snap.empty) {
        return [];
      }

      const list: Campaign[] = [];
      const now = new Date();

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const camp: Campaign = {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'multiplier',
          materialId: data.materialId || '',
          multiplier: data.multiplier !== undefined ? Number(data.multiplier) : undefined,
          minimumQuantity: data.minimumQuantity !== undefined ? Number(data.minimumQuantity) : undefined,
          bonusPoints: data.bonusPoints !== undefined ? Number(data.bonusPoints) : undefined,
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          active: Boolean(data.active ?? true),
          createdAt: data.createdAt,
          createdBy: data.createdBy,
        };

        if (this.isCampaignActive(camp, now)) {
          list.push(camp);
        }
      });

      return list;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao carregar campanhas do Firestore:', err);
      throw err;
    }
  },

  /**
   * Encontra a melhor campanha ativa aplicável a um determinado material
   */
  findActiveCampaignForMaterial(
    materialId: string,
    campaigns: Campaign[],
    targetDate: Date = new Date()
  ): Campaign | null {
    if (!campaigns || campaigns.length === 0) return null;
    const matches = campaigns.filter(
      (c) => c.materialId === materialId && this.isCampaignActive(c, targetDate)
    );
    return matches.length > 0 ? matches[0] : null;
  },

  /**
   * Calcula o bônus promocional de uma campanha para uma quantidade de material
   */
  calculateBonus(
    material: MaterialType,
    quantity: number,
    campaign: Campaign | null
  ): CampaignBonusResult {
    const basePoints = Math.round(quantity * material.pointsPerUnit);

    if (!campaign || quantity <= 0 || !this.isCampaignActive(campaign)) {
      return {
        bonusPoints: 0,
        totalPoints: basePoints,
        appliedCampaign: null,
      };
    }

    // Tipo 1: Multiplicador (ex: multiplier = 2 -> pontos em dobro)
    if (campaign.type === 'multiplier' && campaign.multiplier && campaign.multiplier > 1) {
      const totalPoints = Math.round(basePoints * campaign.multiplier);
      const bonusPoints = totalPoints - basePoints;
      const explanation =
        campaign.multiplier === 2
          ? `Campanha aplicada: ${campaign.title} — pontos em dobro.`
          : `Campanha aplicada: ${campaign.title} — ${campaign.multiplier}x pontos.`;

      return {
        bonusPoints,
        totalPoints,
        explanation,
        appliedCampaign: campaign,
      };
    }

    // Tipo 2: Bônus por quantidade mínima (ex: minimumQuantity = 10, bonusPoints = 5)
    if (campaign.type === 'quantity_bonus' && campaign.minimumQuantity && campaign.bonusPoints) {
      if (quantity >= campaign.minimumQuantity) {
        const tiers = Math.floor(quantity / campaign.minimumQuantity);
        const bonusPoints = tiers * campaign.bonusPoints;
        const totalPoints = basePoints + bonusPoints;
        const explanation = `Campanha aplicada: ${campaign.title} — +${bonusPoints} pts de bônus.`;

        return {
          bonusPoints,
          totalPoints,
          explanation,
          appliedCampaign: campaign,
        };
      }
    }

    return {
      bonusPoints: 0,
      totalPoints: basePoints,
      appliedCampaign: null,
    };
  },
};
