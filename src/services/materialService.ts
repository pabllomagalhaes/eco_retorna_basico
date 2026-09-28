import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { MaterialType } from '../types';
import { STANDARD_MATERIALS } from '../utils/scoring';

export const MaterialService = {
  /**
   * Retorna os materiais ativos para uso no aplicativo e no simulador.
   * Quando o Firebase estiver configurado, lê diretamente da coleção 'materials'.
   * Se a coleção estiver vazia, retorna array vazio [].
   * Quando o Firebase NÃO estiver configurado, utiliza STANDARD_MATERIALS como fallback local.
   */
  async getActiveMaterials(): Promise<MaterialType[]> {
    if (!isFirebaseConfigured || !db) {
      return [...STANDARD_MATERIALS];
    }

    try {
      const colRef = collection(db, 'materials');
      const snap = await getDocs(colRef);

      if (snap.empty) {
        return [];
      }

      const list: MaterialType[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        // Filtra apenas materiais ativos (active !== false)
        if (data.active !== false) {
          const category = (data.category === 'aluminio' ? 'aluminio' : 'pet') as MaterialType['category'];
          const defaultCo2 = category === 'aluminio' ? 0.22 : 0.18;
          const pointsPerUnit = Number(data.pointsPerUnit) > 0 ? Number(data.pointsPerUnit) : 2;
          const co2Factor = Number(data.co2eFactor ?? data.co2eAvoidedKgPerUnit) || defaultCo2;

          list.push({
            id: docSnap.id,
            name: data.name || (category === 'pet' ? 'Garrafa PET 2 L' : 'Lata de Alumínio'),
            category,
            description: data.description || '',
            unit: data.unit || 'unidade',
            pointsPerUnit,
            co2eAvoidedKgPerUnit: co2Factor,
            co2eFactor: co2Factor,
            active: Boolean(data.active ?? true),
          });
        }
      });

      return list;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao carregar materiais do Firestore:', err);
      throw err;
    }
  },
};
