import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  PackageCheck,
  Award,
  Settings,
  RotateCcw,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';

export const ProfilePage: React.FC = () => {
  const { participant, totalContainers, badges, updateProfile, resetToDemoData } = useEco();

  // Formulário editável de dados básicos
  const [nameInput, setNameInput] = useState(participant.name);
  const [neighborhoodInput, setNeighborhoodInput] = useState(participant.neighborhood);
  const [cityInput, setCityInput] = useState(participant.city);
  const [notificationsEnabled, setNotificationsEnabled] = useState(participant.notificationsEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || participant.name,
      neighborhood: neighborhoodInput.trim() || participant.neighborhood,
      city: cityInput.trim() || participant.city,
      notificationsEnabled,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDemo = () => {
    if (window.confirm('Deseja realmente restaurar todos os dados iniciais do protótipo EcoRetorna?')) {
      resetToDemoData();
      setNameInput('Camila Ribeiro');
      setNeighborhoodInput('Batel');
      setCityInput('Curitiba');
      setNotificationsEnabled(true);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const unlockedBadges = badges.filter((b) => b.unlocked);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <User className="h-4 w-4" aria-hidden="true" />
          Perfil do Participante
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Minha Conta
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Gerencie suas informações cadastrais, consulte seus marcos e configure preferências locais.
        </p>
      </div>

      {/* Cartão de Apresentação do Participante */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-xs">
            {participant.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{participant.name}</h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{participant.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Cadastrado em {new Date(participant.registeredAt).toLocaleDateString('pt-BR')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {participant.neighborhood}, {participant.city}
              </span>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
          <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100 min-w-[100px]">
            <span className="block text-xl font-black text-slate-900">
              {formatNumberPtBR(totalContainers)}
            </span>
            <span className="block text-[11px] text-slate-500">reciclagens</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100 min-w-[100px]">
            <span className="block text-xl font-black text-amber-700">
              {unlockedBadges.length}
            </span>
            <span className="block text-[11px] text-slate-500">badges</span>
          </div>
        </div>
      </div>

      {/* Formulário de Edição de Dados Básicos */}
      <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900">Dados Básicos Cadastrais</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nome */}
          <div>
            <label htmlFor="input-profile-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome do Participante
            </label>
            <input
              id="input-profile-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* E-mail (somente leitura para integridade) */}
          <div>
            <label htmlFor="input-profile-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              E-mail Fictício
            </label>
            <input
              id="input-profile-email"
              type="email"
              value={participant.email}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Bairro */}
          <div>
            <label htmlFor="input-profile-neighborhood" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bairro
            </label>
            <input
              id="input-profile-neighborhood"
              type="text"
              value={neighborhoodInput}
              onChange={(e) => setNeighborhoodInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Cidade */}
          <div>
            <label htmlFor="input-profile-city" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Cidade / Estado
            </label>
            <input
              id="input-profile-city"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Preferências Simples */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Preferências</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700">
              Receber comunicados sobre eventos e alertas ecológicos
            </span>
          </label>
        </div>

        {/* Botão Salvar e Alerta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar Alterações
          </button>

          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Alterações salvas com sucesso no seu dispositivo!
            </span>
          )}
        </div>
      </form>

      {/* Conquistas Desbloqueadas */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="h-4 w-4 text-amber-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900">
            Conquistas e Selos Ativos ({unlockedBadges.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {unlockedBadges.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-amber-50/40 p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
                ★
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{b.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Restauração de Dados de Demonstração */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Zona de Demonstração e Testes
        </div>
        <p className="text-xs text-rose-900/80 leading-relaxed">
          Se desejar redefinir os dados deste protótipo para o estado original (Camila Ribeiro com 480 pontos e 218 embalagens), clique no botão abaixo.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-rose-300 px-4 py-2 text-xs font-bold text-rose-700 shadow-xs hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restaurar Dados Padrão de Demonstração
          </button>

          {resetSuccess && (
            <span className="text-xs font-bold text-emerald-700">
              Dados restaurados com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
