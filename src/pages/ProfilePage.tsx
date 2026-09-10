import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  PackageCheck,
  Award,
  Settings,
  LogOut,
  RotateCcw,
  CheckCircle2,
  Save,
  AlertCircle,
  Bell,
  Sparkles,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';

export const ProfilePage: React.FC = () => {
  const {
    participant,
    totalContainers,
    badges,
    pointsBalance,
    environmentalImpact,
    updateProfile,
    logout,
    resetToDemoData,
  } = useEco();

  const navigate = useNavigate();

  // Estados dos campos de edição
  const [nameInput, setNameInput] = useState(participant.name);
  const [emailInput, setEmailInput] = useState(participant.email);
  const [neighborhoodInput, setNeighborhoodInput] = useState(participant.neighborhood);
  const [cityInput, setCityInput] = useState(participant.city);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    participant.notificationsEnabled
  );
  const [motivationalMessages, setMotivationalMessages] = useState(
    participant.motivationalMessages ?? true
  );

  // Estados de controle e validação
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Conquistas desbloqueadas derivadas estritamente do sistema de badges
  const unlockedBadges = badges.filter((b) => b.unlocked);

  // Validação dos campos
  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!nameInput.trim()) {
      newErrors.name = 'Informe um nome.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim()) {
      newErrors.email = 'Informe um e-mail.';
    } else if (!emailPattern.test(emailInput.trim())) {
      newErrors.email = 'Informe um e-mail válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar alterações
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      neighborhood: neighborhoodInput.trim() || participant.neighborhood,
      city: cityInput.trim() || participant.city,
      notificationsEnabled,
      motivationalMessages,
    });

    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Cancelar edição
  const handleCancel = () => {
    setNameInput(participant.name);
    setEmailInput(participant.email);
    setNeighborhoodInput(participant.neighborhood);
    setCityInput(participant.city);
    setNotificationsEnabled(participant.notificationsEnabled);
    setMotivationalMessages(participant.motivationalMessages ?? true);
    setErrors({});
    setIsEditing(false);
  };

  // Alteração direta das preferências com salvamento imediato
  const handleTogglePreference = (key: 'notificationsEnabled' | 'motivationalMessages', value: boolean) => {
    if (key === 'notificationsEnabled') {
      setNotificationsEnabled(value);
      updateProfile({ notificationsEnabled: value });
    } else {
      setMotivationalMessages(value);
      updateProfile({ motivationalMessages: value });
    }
  };

  // Encerrar sessão (Sair)
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Restaurar dados padrão de demonstração
  const handleResetDemo = () => {
    if (
      window.confirm(
        'Deseja restaurar os dados originais deste protótipo (Camila Ribeiro, 480 pontos e 218 embalagens)?'
      )
    ) {
      resetToDemoData();
      setNameInput('Camila Ribeiro');
      setEmailInput('camila.ribeiro@ecoretorna.demo');
      setNeighborhoodInput('Batel');
      setCityInput('Curitiba');
      setNotificationsEnabled(true);
      setMotivationalMessages(true);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  // Data formatada de cadastro
  const formattedRegistrationDate = (() => {
    try {
      return new Date(participant.registeredAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '12/10/2025';
    }
  })();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <User className="h-4 w-4" aria-hidden="true" />
          Minha Conta
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Meu Perfil
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Configurações, dados cadastrais e preferências de uso do participante.
        </p>
      </div>

      {/* Alerta de Sucesso Global */}
      {saveSuccess && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 flex items-center gap-3 shadow-xs"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
          <div>
            <span className="block font-bold text-sm">Perfil atualizado com sucesso!</span>
            <span className="text-xs text-emerald-800">
              O novo nome e preferências já foram atualizados em todo o sistema.
            </span>
          </div>
        </div>
      )}

      {/* 1. SEÇÃO DE IDENTIFICAÇÃO PESSOAL */}
      <section
        id="personal-info-card"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="personal-info-heading"
      >
        <div className="flex items-center gap-4">
          {/* Avatar com Iniciais */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-sm shadow-emerald-700/20"
            aria-hidden="true"
          >
            {participant.name ? participant.name.slice(0, 2).toUpperCase() : 'CR'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id="personal-info-heading" className="text-xl font-bold text-slate-900">
                {participant.name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Participante Ativo
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              {participant.email}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Participante desde: {formattedRegistrationDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {participant.neighborhood}, {participant.city}
              </span>
            </div>
          </div>
        </div>

        {/* Botão para ativar modo edição rápida */}
        {!isEditing && (
          <button
            type="button"
            id="btn-trigger-edit"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Edit3 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Editar Perfil
          </button>
        )}
      </section>

      {/* 2. SEÇÃO DE ESTATÍSTICAS RESUMIDAS (DERIVADAS ESTREITAMENTE DO HISTÓRICO) */}
      <section
        id="stats-summary-card"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
        aria-labelledby="stats-summary-heading"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h3 id="stats-summary-heading" className="text-base font-bold text-slate-900">
              Estatísticas e Marcos Consolidados
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Valores baseados no histórico
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100">
            <span className="block text-2xl font-black text-emerald-950">
              {formatNumberPtBR(totalContainers)}
            </span>
            <span className="block text-xs font-medium text-emerald-800 mt-0.5">
              embalagens recicladas
            </span>
          </div>

          <div className="rounded-2xl bg-amber-50/60 p-3.5 border border-amber-100">
            <span className="block text-2xl font-black text-amber-950">
              {unlockedBadges.length}
            </span>
            <span className="block text-xs font-medium text-amber-800 mt-0.5">
              conquistas desbloqueadas
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="block text-2xl font-black text-slate-900">
              {formatNumberPtBR(pointsBalance)}
            </span>
            <span className="block text-xs font-medium text-slate-600 mt-0.5">
              saldo atual (pts)
            </span>
          </div>

          <div className="rounded-2xl bg-teal-50/60 p-3.5 border border-teal-100">
            <span className="block text-2xl font-black text-teal-950">
              {environmentalImpact.co2eAvoidedKg.toFixed(1).replace('.', ',')} kg
            </span>
            <span className="block text-xs font-medium text-teal-800 mt-0.5">
              CO₂e evitado estimado
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          *Estes indicadores são calculados a partir das suas entregas em postos de coleta.
          Saldo, histórico, impacto e badges não podem ser editados manualmente para garantir a integridade dos dados.
        </p>
      </section>

      {/* 3. SEÇÃO EDITAR PERFIL */}
      <section
        id="edit-profile-section"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5"
        aria-labelledby="edit-profile-heading"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h3 id="edit-profile-heading" className="text-base font-bold text-slate-900">
              Editar Perfil
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Campos marcados com * são obrigatórios
          </span>
        </div>

        <form onSubmit={handleSave} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo Nome */}
            <div>
              <label
                htmlFor="input-profile-name"
                className="block text-xs font-bold text-slate-700 uppercase mb-1"
              >
                Nome do Participante *
              </label>
              <input
                id="input-profile-name"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error-msg' : undefined}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none ${
                  errors.name
                    ? 'border-rose-500 bg-rose-50/20 text-slate-900 focus:border-rose-600'
                    : 'border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
                placeholder="Ex: Camila R. Ribeiro"
              />
              {errors.name && (
                <p
                  id="name-error-msg"
                  className="mt-1 flex items-center gap-1 text-xs font-bold text-rose-600"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Campo E-mail */}
            <div>
              <label
                htmlFor="input-profile-email"
                className="block text-xs font-bold text-slate-700 uppercase mb-1"
              >
                E-mail Demonstrativo *
              </label>
              <input
                id="input-profile-email"
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error-msg' : undefined}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none ${
                  errors.email
                    ? 'border-rose-500 bg-rose-50/20 text-slate-900 focus:border-rose-600'
                    : 'border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
                placeholder="nome@dominio.demo"
              />
              {errors.email && (
                <p
                  id="email-error-msg"
                  className="mt-1 flex items-center gap-1 text-xs font-bold text-rose-600"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Bairro */}
            <div>
              <label
                htmlFor="input-profile-neighborhood"
                className="block text-xs font-bold text-slate-700 uppercase mb-1"
              >
                Bairro de Referência
              </label>
              <input
                id="input-profile-neighborhood"
                type="text"
                value={neighborhoodInput}
                onChange={(e) => setNeighborhoodInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                placeholder="Ex: Batel"
              />
            </div>

            {/* Campo Cidade */}
            <div>
              <label
                htmlFor="input-profile-city"
                className="block text-xs font-bold text-slate-700 uppercase mb-1"
              >
                Cidade
              </label>
              <input
                id="input-profile-city"
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                placeholder="Ex: Curitiba"
              />
            </div>
          </div>

          {/* Botões de Ação do Formulário */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Ao salvar, seu novo nome será refletido automaticamente no Dashboard e em todo o aplicativo.
            </span>

            <div className="flex items-center gap-2.5">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                id="btn-save-profile"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 4. SEÇÃO DE PREFERÊNCIAS */}
      <section
        id="preferences-section"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
        aria-labelledby="preferences-heading"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h3 id="preferences-heading" className="text-base font-bold text-slate-900">
              Preferências do Participante
            </h3>
          </div>
          <span className="text-xs text-slate-400">Opções locais</span>
        </div>

        <div className="space-y-4">
          {/* Alertas na interface */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="pref-notifications"
              checked={notificationsEnabled}
              onChange={(e) =>
                handleTogglePreference('notificationsEnabled', e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="block text-sm font-bold text-slate-800">
                Receber alertas na interface
              </span>
              <span className="block text-xs text-slate-500">
                Apresenta comunicados sobre novos postos, campanhas ecológicas e atualizações de conquistas.
              </span>
            </div>
          </label>

          {/* Mensagens motivacionais */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="pref-motivational"
              checked={motivationalMessages}
              onChange={(e) =>
                handleTogglePreference('motivationalMessages', e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="block text-sm font-bold text-slate-800">
                Exibir mensagens motivacionais
              </span>
              <span className="block text-xs text-slate-500">
                Exibe dicas sustentáveis e incentivos à reciclagem na página inicial do participante.
              </span>
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-500 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            Essas opções têm caráter demonstrativo e são salvas no armazenamento local do navegador.
            Não há envio de e-mails nem mensagens SMS pelo sistema.
          </p>
        </div>
      </section>

      {/* 5. SEÇÃO DE CONQUISTAS ATIVAS */}
      <section
        id="badges-preview-section"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
        aria-labelledby="badges-preview-heading"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <h3 id="badges-preview-heading" className="text-base font-bold text-slate-900">
              Conquistas Desbloqueadas ({unlockedBadges.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate('/conquistas')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Ver todos os desafios
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {unlockedBadges.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-amber-50/40 p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-black text-sm">
                ★
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SEÇÃO SAIR (ENCERRAR SESSÃO DEMONSTRATIVA) */}
      <section
        id="logout-section"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        aria-labelledby="logout-heading"
      >
        <div>
          <h3 id="logout-heading" className="text-base font-bold text-slate-900">
            Encerrar Sessão
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ao sair, você retornará à tela de acesso demonstrativo. Seus pontos, saldo e histórico permanecerão salvos neste navegador.
          </p>
        </div>

        <button
          type="button"
          id="btn-logout"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-100 transition focus-visible:outline-2 focus-visible:outline-rose-600 shrink-0"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair da Conta
        </button>
      </section>

      {/* 7. ZONA DE DEMONSTRAÇÃO E RESTAURAÇÃO */}
      <section
        id="demo-zone-section"
        className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-xs space-y-3"
        aria-labelledby="demo-zone-heading"
      >
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <RotateCcw className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <h3 id="demo-zone-heading">Zona de Demonstração e Testes Acadêmicos</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Para restaurar os valores padrão da avaliação (Camila Ribeiro com 480 pontos iniciais, 218 embalagens registradas e 4 conquistas), clique no botão abaixo.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            id="btn-reset-demo"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition focus-visible:outline-2 focus-visible:outline-slate-600"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            Restaurar Dados Padrão de Demonstração
          </button>

          {resetSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Dados padrão restaurados!
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
