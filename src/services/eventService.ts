import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { EcoEventAlert, EcoItemType } from '../types';
import { ECO_EVENTS_AND_ALERTS } from '../data/mockData';

export const EventService = {
  /**
   * Retorna os eventos e alertas ativos.
   * Quando Firebase estiver configurado, lê diretamente da coleção 'events'.
   * Se a coleção estiver vazia, retorna [].
   * Se ocorrer erro no Firestore, propaga a exceção (não mascara com mock silencioso).
   * Quando Firebase NÃO estiver configurado, retorna ECO_EVENTS_AND_ALERTS como fallback demonstrativo.
   */
  async getEventsAndAlerts(): Promise<EcoEventAlert[]> {
    if (!isFirebaseConfigured || !db) {
      return [...ECO_EVENTS_AND_ALERTS];
    }

    try {
      const colRef = collection(db, 'events');
      const snap = await getDocs(colRef);

      if (snap.empty) {
        return [];
      }

      const items: EcoEventAlert[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.active !== false) {
          items.push({
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            fullDescription: data.fullDescription || data.description || '',
            date: data.date || '',
            time: data.time || '',
            location: data.location || '',
            category: data.category || 'Reciclagem',
            type: (data.type as EcoItemType) || 'evento',
            active: Boolean(data.active ?? true),
            severity: data.severity || 'info',
          });
        }
      });

      return items;
    } catch (err) {
      console.warn('[EcoRetorna] Erro ao buscar eventos no Firestore:', err);
      throw err;
    }
  },
};
