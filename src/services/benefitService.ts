import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { Benefit, BenefitCategory, Donation, Redemption } from '../types';
import { StorageService } from './storage';
import { DEMO_BENEFITS } from '../data/mockData';

export const BenefitService = {
  /**
   * Retorna os benefícios ativos disponíveis no catálogo.
   * Quando Firebase estiver configurado, lê diretamente de 'benefits'.
   * Se a coleção estiver vazia, retorna [].
   * Se ocorrer erro, propaga a exceção.
   * Quando Firebase NÃO estiver configurado, utiliza DEMO_BENEFITS como fallback.
   */
  async getActiveBenefits(): Promise<Benefit[]> {
    if (!isFirebaseConfigured || !db) {
      return [...DEMO_BENEFITS];
    }

    try {
      const colRef = collection(db, 'benefits');
      const snap = await getDocs(colRef);

      if (snap.empty) {
        return [];
      }

      const list: Benefit[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.active !== false) {
          list.push({
            id: docSnap.id,
            title: data.title || '',
            description: data.description || '',
            category: (data.category as BenefitCategory) || 'gift',
            pointsRequired: Number(data.pointsRequired) || 0,
            stock: data.stock !== undefined && data.stock !== null ? Number(data.stock) : null,
            active: Boolean(data.active ?? true),
            imageUrl: data.imageUrl || undefined,
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
          });
        }
      });

      return list;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao carregar benefícios do Firestore:', err);
      throw err;
    }
  },

  /**
   * Obtém os resgates do participante autenticado.
   * Suporta leitura retrocompatível com registros legados.
   */
  async getRedemptions(userId: string = 'usr_camila_01'): Promise<Redemption[]> {
    if (!isFirebaseConfigured || !db) {
      return StorageService.loadState().redemptions;
    }

    try {
      const colRef = collection(db, 'redemptions');
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const list: Redemption[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || userId,
            benefitId: data.benefitId || '',
            benefitTitle: data.benefitTitle || data.description || '',
            date: data.date || '',
            pointsSpent: Number(data.pointsSpent ?? data.pointsUsed) || 0,
            reaisValue: Number(data.reaisValue ?? data.equivalentValue) || 0,
            description: data.description || data.benefitTitle || 'Resgate demonstrativo',
            status: data.status || 'concluido',
            demonstrative: data.demonstrative ?? true,
            createdAt: data.createdAt,
          });
        });
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return list;
      }

      return [];
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao buscar resgates no Firestore:', err);
      throw err;
    }
  },

  /**
   * Cria novo resgate demonstrativo aplicando comportamento REMOTE-FIRST:
   * 1. Grava no Firestore primeiro com contrato canônico;
   * 2. Somente após sucesso atualiza o cache local;
   * 3. Se o Firestore falhar, propaga o erro e não altera cache local.
   */
  async createRedemption(
    userId: string = 'usr_camila_01',
    points: number,
    reaisValue: number,
    description = 'Resgate demonstrativo em créditos',
    benefitId = '',
    benefitTitle = ''
  ): Promise<Redemption> {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const newId = `red_${Date.now()}`;
    const title = benefitTitle || description;

    const newRedemption: Redemption = {
      id: newId,
      userId,
      benefitId: benefitId || '',
      benefitTitle: title,
      date: today,
      pointsSpent: points,
      reaisValue,
      description,
      status: 'concluido',
      demonstrative: true,
      createdAt: nowIso,
    };

    // 1. Remote-First: gravar no Firestore primeiro se configurado
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'redemptions', newId);
        await setDoc(docRef, {
          userId,
          benefitId: benefitId || '',
          benefitTitle: title,
          date: today,
          pointsSpent: points,
          reaisValue,
          description,
          createdAt: nowIso,
          status: 'concluido',
          demonstrative: true,
        });
      } catch (err) {
        console.warn('[EcoRetorna] Falha ao persistir resgate no Firestore (Remote-First):', err);
        throw err;
      }
    }

    // 2. Salvar no cache local somente após sucesso do Firestore ou em modo local
    const currentList = StorageService.loadState().redemptions;
    StorageService.saveRedemptions([newRedemption, ...currentList]);

    return newRedemption;
  },

  /**
   * Obtém as doações do participante autenticado.
   * Suporta leitura retrocompatível com registros legados.
   */
  async getDonations(userId: string = 'usr_camila_01'): Promise<Donation[]> {
    if (!isFirebaseConfigured || !db) {
      return StorageService.loadState().donations;
    }

    try {
      const colRef = collection(db, 'donations');
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const list: Donation[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || userId,
            initiativeId: data.initiativeId || '',
            initiativeName: data.initiativeName || '',
            date: data.date || '',
            pointsDonated: Number(data.pointsDonated ?? data.pointsUsed) || 0,
            reaisValue: Number(data.reaisValue ?? data.equivalentValue) || 0,
            status: data.status || 'concluido',
            demonstrative: data.demonstrative ?? true,
            createdAt: data.createdAt,
          });
        });
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return list;
      }

      return [];
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao buscar doações no Firestore:', err);
      throw err;
    }
  },

  /**
   * Cria nova doação demonstrativa aplicando comportamento REMOTE-FIRST:
   * 1. Grava no Firestore primeiro com contrato canônico;
   * 2. Somente após sucesso atualiza o cache local;
   * 3. Se o Firestore falhar, propaga o erro e não altera cache local.
   */
  async createDonation(
    userId: string = 'usr_camila_01',
    initiativeId: string,
    initiativeName: string,
    points: number,
    reaisValue: number
  ): Promise<Donation> {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const newId = `don_${Date.now()}`;

    const newDonation: Donation = {
      id: newId,
      userId,
      date: today,
      initiativeId,
      initiativeName,
      pointsDonated: points,
      reaisValue,
      status: 'concluido',
      demonstrative: true,
      createdAt: nowIso,
    };

    // 1. Remote-First: gravar no Firestore primeiro se configurado
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'donations', newId);
        await setDoc(docRef, {
          userId,
          initiativeId,
          initiativeName,
          date: today,
          pointsDonated: points,
          reaisValue,
          createdAt: nowIso,
          status: 'concluido',
          demonstrative: true,
        });
      } catch (err) {
        console.warn('[EcoRetorna] Falha ao persistir doação no Firestore (Remote-First):', err);
        throw err;
      }
    }

    // 2. Salvar no cache local somente após sucesso do Firestore ou em modo local
    const currentList = StorageService.loadState().donations;
    StorageService.saveDonations([newDonation, ...currentList]);

    return newDonation;
  },
};
