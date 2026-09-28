import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Sparkles, UserCheck, AlertCircle, LockKeyhole, HelpCircle, ChevronLeft } from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { AuthService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const { login, participant, isUsingFirebase } = useEco();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState(
    isUsingFirebase ? '' : (participant.email || 'camila.ribeiro@exemplo.ecoretorna.com.br')
  );
  const [passwordInput, setPasswordInput] = useState(isUsingFirebase ? '' : '1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login(emailInput, passwordInput);
      if (res.success) {
        navigate('/app');
      } else {
        setErrorMessage(res.message || 'Falha ao autenticar.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado ao tentar entrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login(emailInput, passwordInput);
      if (res.success) {
        navigate('/app');
      } else {
        setErrorMessage(res.message || 'Falha ao autenticar.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado ao tentar entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMessage('Informe seu e-mail no campo acima para receber as instruções de recuperação.');
      return;
    }
    const res = await AuthService.resetPassword(emailInput);
    if (res.success) {
      setInfoMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Botão de retorno à página pública */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-2">
        <Link
          to="/"
          id="btn-back-home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar para a página pública</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20">
          <Leaf className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="mt-4 text-center text-3xl font-black tracking-tight text-slate-900">
          EcoRetorna
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500 font-medium">
          Acesso do participante à plataforma de reciclagem
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-900">
            <span className="block font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              {isUsingFirebase ? 'Acesso do Participante (Firebase Auth)' : 'Acesso Demonstrativo do Participante'}
            </span>
            {isUsingFirebase
              ? 'Ambiente conectado ao Firebase Authentication. Informe seu e-mail e senha cadastrados.'
              : 'Este ambiente acadêmico simula o perfil do usuário final. Você pode usar as credenciais demonstrativas.'}
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div
              role="status"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-3.5 text-xs font-semibold text-blue-800 flex items-start gap-2.5"
            >
              <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-relaxed">{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none disabled:opacity-60"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
                >
                  Esqueci minha senha
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none disabled:opacity-60"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-login"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800 disabled:opacity-60 cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? 'Verificando acesso...' : 'Entrar'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="text-center text-xs text-slate-600 pt-1">
            <span>Ainda não possui conta? </span>
            <Link
              to="/cadastro"
              id="link-go-to-register"
              className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
            >
              Cadastre-se
            </Link>
          </div>

          {/* Atalho de Um Clique (Demo) - apenas no modo local sem Firebase */}
          {!isUsingFirebase && (
            <div className="border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleQuickLogin}
                disabled={isSubmitting}
                id="btn-quick-login"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100/70 disabled:opacity-60 cursor-pointer min-h-[44px]"
              >
                <UserCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                Entrar direto como {participant.name || 'Camila Ribeiro'} (Demo)
              </button>
            </div>
          )}

          {/* Separação Visual e Acesso Administrativo Reservado */}
          <div className="border-t border-slate-200/80 pt-4 text-center space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operadores do Sistema
            </span>
            <Link
              to="/admin/login"
              id="link-admin-login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition focus-visible:outline-2 focus-visible:outline-emerald-600 min-h-[44px]"
            >
              <LockKeyhole className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Área administrativa</span>
            </Link>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Ambiente de uso do participante. O acesso de operadores e operadores de pesagem será disponibilizado na próxima etapa.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
