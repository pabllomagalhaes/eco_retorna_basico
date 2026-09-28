import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
  errorCode?: string;
}

/**
 * Mapeamento de erros comuns do Firebase Auth para mensagens amigáveis em português.
 */
function mapAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/invalid-login-credentials':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/user-not-found':
      return 'Nenhuma conta de participante encontrada com este e-mail.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado na plataforma.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas malsucedidas. Aguarde alguns instantes e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com os servidores de autenticação. Verifique sua internet.';
    default:
      return 'Ocorreu um erro no processamento do acesso. Tente novamente.';
  }
}

/**
 * Serviço de Autenticação desacoplado.
 * Fornece interface limpa para as páginas e contexto, isolando detalhes do Firebase Auth.
 * Quando o Firebase NÃO estiver configurado, provê comportamento demonstrativo seguro
 * sem armazenar senhas no localStorage.
 */
export const AuthService = {
  isConfigured(): boolean {
    return isFirebaseConfigured && auth !== null;
  },

  getCurrentUser(): AuthUser | null {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      return {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
      };
    }
    return null;
  },

  async login({ email, password }: AuthCredentials): Promise<AuthResult> {
    // 1. Modo Local / Fallback Demonstrativo
    if (!isFirebaseConfigured || !auth) {
      return {
        success: true,
        user: {
          uid: 'usr_camila_01',
          email: email || 'camila.ribeiro@exemplo.ecoretorna.com.br',
          displayName: 'Camila Ribeiro',
        },
      };
    }

    // 2. Modo Firebase Auth Real
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      if (!db) {
        await signOut(auth);
        return {
          success: false,
          message: 'Banco de dados não disponível.',
        };
      }

      // Validação obrigatória da autorização e perfil do participante
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        return {
          success: false,
          message: 'Perfil de participante não encontrado.',
        };
      }

      const userData = userSnap.data();

      // Validação de role estrita: somente "participant"
      if (userData?.role !== 'participant') {
        await signOut(auth);
        return {
          success: false,
          message: 'Esta conta não possui acesso à área do participante.',
        };
      }

      // Validação de status ativo
      if (userData?.active !== true) {
        await signOut(auth);
        return {
          success: false,
          message: 'Esta conta de participante está inativa.',
        };
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.name || user.displayName,
        },
      };
    } catch (err: any) {
      if (auth && auth.currentUser) {
        try {
          await signOut(auth);
        } catch {
          // ignore
        }
      }

      return {
        success: false,
        message: mapAuthError(err),
        errorCode: err?.code,
      };
    }
  },

  async validateParticipant(uid: string): Promise<{ valid: boolean; message?: string }> {
    if (!isFirebaseConfigured || !db) {
      return { valid: true };
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        return {
          valid: false,
          message: 'Perfil de participante não encontrado.',
        };
      }

      const userData = userSnap.data();

      if (userData?.role !== 'participant') {
        return {
          valid: false,
          message: 'Esta conta não possui acesso à área do participante.',
        };
      }

      if (userData?.active !== true) {
        return {
          valid: false,
          message: 'Esta conta de participante está inativa.',
        };
      }

      return { valid: true };
    } catch (err: any) {
      return {
        valid: false,
        message: err?.message || 'Erro ao validar perfil do participante.',
      };
    }
  },

  async register({ name, email, password }: RegisterData): Promise<AuthResult> {
    // 1. Modo Local / Fallback Preparatório
    // REGRA DE SEGURANÇA: NUNCA armazenar senhas em localStorage ou texto puro.
    if (!isFirebaseConfigured || !auth) {
      return {
        success: true,
        message: 'Cadastro preparado com sucesso. A autenticação será ativada com o Firebase.',
        user: {
          uid: `demo_${Date.now()}`,
          email,
          displayName: name,
        },
      };
    }

    // 2. Modo Firebase Auth Real
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      // Atualiza o nome de exibição no Firebase Auth
      if (name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch (e) {
          console.warn('[EcoRetorna] Aviso ao atualizar displayName no Firebase Auth:', e);
        }
      }

      // Cria o documento users/{uid} no Firestore com o perfil do novo participante
      if (db) {
        const userDocRef = doc(db, 'users', user.uid);
        const now = new Date().toISOString();
        await setDoc(userDocRef, {
          name: name.trim(),
          email: email.trim(),
          role: 'participant',
          active: true,
          createdAt: now,
          updatedAt: now,
          city: '',
          neighborhood: '',
          avatarUrl: '',
          preferences: {
            notificationsEnabled: true,
            motivationalMessages: true,
            highContrastMode: false,
          },
        });
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: name.trim(),
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: mapAuthError(err),
        errorCode: err?.code,
      };
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('[EcoRetorna] Erro ao deslogar do Firebase Auth:', err);
      }
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Informe um e-mail válido para redefinição de senha.',
      };
    }

    if (!isFirebaseConfigured || !auth) {
      return {
        success: true,
        message: `Instruções demonstrativas de recuperação enviadas para ${email}.`,
      };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: `Instruções de redefinição de senha enviadas para ${email}. Verifique sua caixa de entrada.`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: mapAuthError(err),
      };
    }
  },

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    if (!isFirebaseConfigured || !auth) {
      return () => {};
    }

    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        callback(null);
      }
    });
  },
};
