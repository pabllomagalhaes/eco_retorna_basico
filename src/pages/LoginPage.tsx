import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useEco } from '../context/EcoContext';

export const LoginPage: React.FC = () => {
  const { login, participant } = useEco();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState(participant.email);
  const [accessCode, setAccessCode] = useState('1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  const handleQuickLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20">
          <Leaf className="h-8 w-8" aria-hidden="true" />
        </div>

        <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-slate-900">
          EcoRetorna
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500 font-medium">
          Plataforma de incentivo à reciclagem de embalagens
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-900">
            <span className="block font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Acesso Demonstrativo do Participante
            </span>
            Este ambiente acadêmico simula o perfil do usuário final. Não é necessário cadastro real ou senha complexa.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                E-mail do Participante
              </label>
              <input
                id="login-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="login-code" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Código de Acesso Fictício
              </label>
              <input
                id="login-code"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800"
            >
              Entrar na Plataforma
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {/* Atalho de Um Clique */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100/70"
            >
              <UserCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              Entrar direto como {participant.name} (Demo)
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Ambiente de uso exclusivo do participante. Nenhum painel administrativo está disponível.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
