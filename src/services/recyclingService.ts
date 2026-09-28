import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { RecyclingRecord } from '../types';
import { StorageService } from './storage';
import { calculatePoints, pointsToReais } from '../utils/scoring';
import { getSingleItemImpact } from '../utils/environmental';

export const RecyclingService = {
  /**
   * Obtém os registros de reciclagem do participante.
   * REGRA: Nesta aplicação PARTICIPANTE, os registros são SOMENTE LEITURA.
   * Novos registros serão inseridos futuramente pelo EcoRetorna Admin.
   */
  async getRecyclingRecords(userId: string = 'usr_camila_01'): Promise<RecyclingRecord[]> {
    if (!isFirebaseConfigured || !db) {
      return StorageService.loadState().recyclingRecords;
    }

    try {
      const recordsCol = collection(db, 'recyclingRecords');
      const q = query(recordsCol, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const records: RecyclingRecord[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const category = (data.materialCategory || (data.materialId?.includes('aluminio') ? 'aluminio' : 'pet')) as 'pet' | 'aluminio';
          const qty = Number(data.quantity) || 0;
          const points = data.pointsEarned ?? data.points ?? calculatePoints(qty, 2);
          const reais = data.reaisEquivalent ?? pointsToReais(points);
          const co2 = data.co2eAvoidedKg ?? getSingleItemImpact(category, qty);

          records.push({
            id: docSnap.id,
            userId: data.userId || userId,
            date: data.date || '',
            materialId: data.materialId || 'pet_2l',
            materialName: data.materialName || (category === 'pet' ? 'Garrafa PET 2 L' : 'Lata de Alumínio'),
            materialCategory: category,
            quantity: qty,
            pointsEarned: points,
            reaisEquivalent: reais,
            co2eAvoidedKg: co2,
            collectionPointName: data.collectionPointName || 'Posto de Coleta EcoRetorna',
          });
        });

        // Ordenar do mais recente para o mais antigo
        records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return records;
      }

      // Se o participante autenticado ainda não possui registros no Firestore, retorna lista vazia
      return [];
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao buscar registros de reciclagem no Firestore:', err);
      throw err;
    }
  },
};
