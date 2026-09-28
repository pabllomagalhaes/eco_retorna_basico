import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { CollectionPoint } from '../types';
import { COLLECTION_POINTS } from '../data/mockData';

export const CollectionPointService = {
  /**
   * Retorna os pontos de coleta ativos.
   * Quando Firebase estiver configurado, lê diretamente da coleção 'collectionPoints'.
   * Se a coleção estiver vazia, retorna [].
   * Se ocorrer erro no Firestore, propaga a exceção (não mascara com mock silencioso).
   * Quando Firebase NÃO estiver configurado, retorna COLLECTION_POINTS como fallback demonstrativo.
   */
  async getCollectionPoints(): Promise<CollectionPoint[]> {
    if (!isFirebaseConfigured || !db) {
      return [...COLLECTION_POINTS];
    }

    try {
      const colRef = collection(db, 'collectionPoints');
      const snap = await getDocs(colRef);

      if (snap.empty) {
        return [];
      }

      const points: CollectionPoint[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.active !== false) {
          const lat = Number(data.latitude);
          const lng = Number(data.longitude);
          points.push({
            id: d.id,
            name: data.name || '',
            address: data.address || '',
            neighborhood: data.neighborhood || '',
            city: data.city || 'Fraiburgo - SC',
            operatingHours: data.operatingHours || data.openingHours || '08:00 às 18:00',
            acceptedMaterials: data.acceptedMaterials || ['PET', 'Alumínio'],
            latitude: isNaN(lat) ? 0 : lat,
            longitude: isNaN(lng) ? 0 : lng,
            description: data.description || '',
            active: Boolean(data.active ?? true),
            notes: data.notes || '',
          });
        }
      });
      return points;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao buscar pontos de coleta no Firestore:', err);
      throw err;
    }
  },
};
