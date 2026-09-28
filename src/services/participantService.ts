import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { Participant } from '../types';
import { StorageService } from './storage';
import { INITIAL_PARTICIPANT } from '../data/mockData';

export const ParticipantService = {
  async getParticipant(userId: string = 'usr_camila_01'): Promise<Participant> {
    if (!isFirebaseConfigured || !db) {
      return StorageService.loadState().participant;
    }

    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error('Perfil de participante não encontrado.');
    }

    const data = snap.data();
    if (data?.role !== 'participant') {
      throw new Error('Esta conta não possui acesso à área do participante.');
    }

    if (data?.active !== true) {
      throw new Error('Esta conta de participante está inativa.');
    }

    const preferences = data.preferences || {};
    return {
      id: userId,
      name: data.name || 'Participante EcoRetorna',
      email: data.email || '',
      registeredAt: data.createdAt ?? data.registeredAt ?? new Date().toISOString(),
      city: data.city || '',
      neighborhood: data.neighborhood || '',
      avatarUrl: data.avatarUrl || '',
      notificationsEnabled: preferences.notificationsEnabled ?? data.notificationsEnabled ?? true,
      motivationalMessages: preferences.motivationalMessages ?? data.motivationalMessages ?? true,
      highContrastMode: preferences.highContrastMode ?? data.highContrastMode ?? false,
      active: true,
    };
  },

  async updateParticipant(userId: string, updated: Partial<Participant>): Promise<void> {
    // 1. Atualizar imediatamente no armazenamento local para garantir reatividade e cache
    const currentLocal = StorageService.loadState().participant;
    const merged = { ...currentLocal, ...updated };
    StorageService.saveParticipant(merged);

    // 2. Se o Firebase estiver configurado, sincronizar com o Firestore
    if (!isFirebaseConfigured || !db) {
      return;
    }

    try {
      const docRef = doc(db, 'users', userId);
      const payload: Record<string, any> = {};

      if (updated.name !== undefined) payload.name = updated.name;
      if (updated.email !== undefined) payload.email = updated.email;
      if (updated.city !== undefined) payload.city = updated.city;
      if (updated.neighborhood !== undefined) payload.neighborhood = updated.neighborhood;
      if (updated.avatarUrl !== undefined) payload.avatarUrl = updated.avatarUrl;

      // Preferências agrupadas conforme modelo de coleção do Firestore
      const preferences: Record<string, any> = {};
      if (updated.notificationsEnabled !== undefined) preferences.notificationsEnabled = updated.notificationsEnabled;
      if (updated.motivationalMessages !== undefined) preferences.motivationalMessages = updated.motivationalMessages;
      if (updated.highContrastMode !== undefined) preferences.highContrastMode = updated.highContrastMode;

      if (Object.keys(preferences).length > 0) {
        payload.preferences = preferences;
      }

      if (Object.keys(payload).length > 0) {
        await updateDoc(docRef, payload);
      }
    } catch (err) {
      console.warn('[EcoRetorna] Falha ao sincronizar atualização de participante no Firestore:', err);
    }
  },
};
