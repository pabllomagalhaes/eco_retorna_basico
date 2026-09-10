import React, { useState, useMemo } from 'react';
import {
  Gift,
  Coins,
  Heart,
  CheckCircle2,
  AlertCircle,
  Clock,
  Droplets,
  Trees,
  Waves,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  X,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { INITIATIVES } from '../data/mockData';
import { pointsToReais, formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';

interface CombinedOperation {
  id: string;
  date: string;
  type: 'Resgate' | 'Doação';
  initiativeName?: string;
  points: number;
  reaisValue: number;
  description: string;
}

export const BenefitsPage: React.FC = () => {
  const { pointsBalance, reaisEquivalent, redeemPoints, donatePoints, redemptions, donations } = useEco();

  // Tab ativa: 'resgate' ou 'doacao'
  const [activeTab, setActiveTab] = useState<'resgate' | 'doacao'>('resgate');

  // Estado Resgate Simulado
  const [redeemInput, setRedeemInput] = useState<number>(80);
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; message: string; submessage?: string } | null>(null);
  const [isConfirmingRedeem, setIsConfirmingRedeem] = useState<boolean>(false);

  // Estado Doação Simulada
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>(INITIATIVES[0].id);
  const [donationInput, setDonationInput] = useState<number>(50);
  const [donationFeedback, setDonationFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isConfirmingDonation, setIsConfirmingDonation] = useState<boolean>(false);

  // Iniciativa selecionada
  const selectedInitiative = useMemo(() => {
    return INITIATIVES.find((i) => i.id === selectedInitiativeId) || INITIATIVES[0];
  }, [selectedInitiativeId]);

  // Histórico unificado para a seção "Minhas operações"
  const combinedOperations = useMemo<CombinedOperation[]>(() => {
    const list: CombinedOperation[] = [];

    redemptions.forEach((r) => {
      list.push({
        id: r.id,
        date: r.date,
        type: 'Resgate',
        points: r.pointsSpent,
        reaisValue: r.reaisValue,
        description: r.description,
      });
    });

    donations.forEach((d) => {
      list.push({
        id: d.id,
        date: d.date,
        type: 'Doação',
        initiativeName: d.initiativeName,
        points: d.pointsDonated,
        reaisValue: d.reaisValue,
        description: `Doação para ${d.initiativeName}`,
      });
    });

    // Ordenar da mais recente para a mais antiga
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [redemptions, donations]);

  // Ícones das iniciativas
  const getInitiativeIcon = (name: string) => {
    switch (name) {
      case 'Droplets':
        return Droplets;
      case 'Trees':
        return Trees;
      case 'Waves':
        return Waves;
      default:
        return Heart;
    }
  };

  // Submissão do Resgate
  const handleOpenRedeemModal = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemFeedback(null);

    if (redeemInput <= 0) {
      setRedeemFeedback({
        success: false,
        message: 'Por favor, informe uma quantidade positiva de pontos para resgate.',
      });
      return;
    }

    if (redeemInput > pointsBalance) {
      setRedeemFeedback({
        success: false,
        message: 'Saldo de pontos insuficiente.',
      });
      return;
    }

    setIsConfirmingRedeem(true);
  };

  const handleExecuteRedeem = () => {
    setIsConfirmingRedeem(false);
    const result = redeemPoints(redeemInput, 'Resgate demonstrativo em créditos');
    if (result.success) {
      setRedeemFeedback({
        success: true,
        message: 'Resgate demonstrativo registrado.',
        submessage: 'Nenhuma transferência financeira real foi realizada.',
      });
    } else {
      setRedeemFeedback({
        success: false,
        message: result.message,
      });
    }
  };

  // Submissão da Doação
  const handleOpenDonationModal = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationFeedback(null);

    if (donationInput <= 0) {
      setDonationFeedback({
        success: false,
        message: 'Por favor, informe uma quantidade positiva de pontos para doar.',
      });
      return;
    }

    if (donationInput > pointsBalance) {
      setDonationFeedback({
        success: false,
        message: 'Saldo de pontos insuficiente.',
      });
      return;
    }

    setIsConfirmingDonation(true);
  };

  const handleExecuteDonation = () => {
    setIsConfirmingDonation(false);
    const result = donatePoints(selectedInitiative.id, selectedInitiative.name, donationInput);
    if (result.success) {
      setDonationFeedback({
        success: true,
        message: 'Doação demonstrativa registrada.',
      });
    } else {
      setDonationFeedback({
        success: false,
        message: result.message,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Principal da Página */}
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs tracking-wider uppercase">
          <Gift className="h-4 w-4" aria-hidden="true" />
          Retorno Social & Financeiro
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Benefícios
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Utilize seus pontos acumulados através da reciclagem para resgatar créditos demonstrativos ou apoiar causas socioambientais.
        </p>
      </header>

      {/* Saldo Atual de Destaque (Consistente com Dashboard e Header) */}
      <section
        id="section-current-balance"
        aria-label="Saldo atual de pontos e equivalência financeira"
        className="rounded-3xl border border-emerald-300 bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-7 text-white shadow-md shadow-emerald-950/10"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-200">
              Saldo Atual Disponível
            </span>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatNumberPtBR(pointsBalance)}
              </span>
              <span className="text-base font-bold text-emerald-200">pontos</span>
            </div>
            <p className="mt-1 text-xs text-emerald-100/90">
              Saldo real sincronizado diretamente com todas as telas do sistema.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-950/40 p-4 backdrop-blur-xs border border-emerald-600/40 sm:text-right">
            <span className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Equivalência Financeira Estimada
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              ≈ {formatCurrencyPtBR(reaisEquivalent)}
            </div>
            <span className="block text-[11px] text-emerald-200/90 font-medium mt-0.5">
              Regra central: 1 ponto = R$ 0,125 (2 pontos = R$ 0,25)
            </span>
          </div>
        </div>
      </section>

      {/* Seletor de Abas para as Duas Ações Principais */}
      <div
        className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200"
        role="tablist"
        aria-label="Ações principais de benefícios"
      >
        <button
          type="button"
          id="tab-resgate"
          role="tab"
          aria-selected={activeTab === 'resgate'}
          aria-controls="panel-resgate"
          onClick={() => {
            setActiveTab('resgate');
            setRedeemFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'resgate'
              ? 'bg-white text-emerald-900 shadow-sm border border-emerald-200/60'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Coins className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          Simular resgate
        </button>

        <button
          type="button"
          id="tab-doacao"
          role="tab"
          aria-selected={activeTab === 'doacao'}
          aria-controls="panel-doacao"
          onClick={() => {
            setActiveTab('doacao');
            setDonationFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'doacao'
              ? 'bg-white text-emerald-900 shadow-sm border border-emerald-200/60'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Heart className="h-4 w-4 text-rose-600" aria-hidden="true" />
          Doar pontos
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: RESGATAR PONTOS (SIMULAR RESGATE) */}
      {/* ========================================================================= */}
      {activeTab === 'resgate' && (
        <section
          id="panel-resgate"
          role="tabpanel"
          aria-labelledby="tab-resgate"
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Simular resgate de pontos
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Informe a quantidade de pontos que deseja converter. Esta simulação demonstrativa atualiza seu saldo no sistema sem envolver transferências financeiras reais.
            </p>
          </div>

          <form onSubmit={handleOpenRedeemModal} className="space-y-6">
            {/* Input de Quantidade */}
            <div>
              <label
                htmlFor="redeem-points-field"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Quantidade de pontos para resgatar:
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    id="redeem-points-field"
                    type="number"
                    min="1"
                    max={pointsBalance}
                    value={redeemInput || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setRedeemInput(isNaN(val) ? 0 : Math.max(0, val));
                      setRedeemFeedback(null);
                    }}
                    className="w-44 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none min-h-[44px]"
                    aria-describedby="redeem-helper"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    pontos
                  </span>
                </div>

                {/* Botões Rápidos */}
                <div className="flex flex-wrap items-center gap-2">
                  {[40, 80, 160, 240].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setRedeemInput(val);
                        setRedeemFeedback(null);
                      }}
                      className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                        redeemInput === val
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val} pts
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setRedeemInput(pointsBalance);
                      setRedeemFeedback(null);
                    }}
                    disabled={pointsBalance <= 0}
                    className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Tudo ({pointsBalance} pts)
                  </button>
                </div>
              </div>

              <span id="redeem-helper" className="mt-1.5 block text-xs text-slate-500">
                Saldo disponível atual: <strong>{pointsBalance} pontos</strong>
              </span>
            </div>

            {/* Exibição em Tempo Real da Conversão */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Valor Equivalente em Reais (Tempo Real)
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {redeemInput} pontos
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-800">
                    ≈ {formatCurrencyPtBR(pointsToReais(redeemInput))}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                  Fórmula: {redeemInput} pts × R$ 0,125
                </span>
              </div>

              <button
                type="submit"
                id="btn-simulate-redeem"
                disabled={redeemInput <= 0 || redeemInput > pointsBalance}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-2 focus-visible:outline-emerald-900"
              >
                Simular resgate
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Feedback Textual de Erro / Validação */}
            {redeemFeedback && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-2xl border p-4 text-xs sm:text-sm flex items-start gap-3 ${
                  redeemFeedback.success
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : 'border-rose-200 bg-rose-50 text-rose-950'
                }`}
              >
                {redeemFeedback.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <strong className="block font-bold">
                    {redeemFeedback.message}
                  </strong>
                  {redeemFeedback.submessage && (
                    <span className="mt-0.5 block text-slate-700">
                      {redeemFeedback.submessage}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Nota de Caráter Demonstrativo */}
            <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 border border-slate-200 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                *Esta operação é demonstrativa. Nenhuma transferência financeira real será realizada. O sistema não solicita nem armazena dados de chave Pix, CPF, contas bancárias ou senhas.
              </p>
            </div>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: DOAR PONTOS */}
      {/* ========================================================================= */}
      {activeTab === 'doacao' && (
        <section
          id="panel-doacao"
          role="tabpanel"
          aria-labelledby="tab-doacao"
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Doar pontos para causas ambientais
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direcione seus pontos para apoiar projetos socioambientais didáticos. A doação é totalmente demonstrativa.
            </p>
          </div>

          <form onSubmit={handleOpenDonationModal} className="space-y-6">
            {/* 1. Escolha da Iniciativa Fictícia */}
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                1. Escolha a iniciativa fictícia beneficiada:
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {INITIATIVES.map((init) => {
                  const Icon = getInitiativeIcon(init.iconName);
                  const isSelected = init.id === selectedInitiativeId;

                  return (
                    <button
                      key={init.id}
                      type="button"
                      onClick={() => {
                        setSelectedInitiativeId(init.id);
                        setDonationFeedback(null);
                      }}
                      className={`text-left rounded-2xl border p-4 transition min-h-[44px] ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      } focus-visible:outline-2 focus-visible:outline-emerald-600`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-2.5">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        {init.cause}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {init.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {init.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Quantidade de Pontos */}
            <div>
              <label
                htmlFor="donation-points-field"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                2. Quantidade de pontos para doar:
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    id="donation-points-field"
                    type="number"
                    min="1"
                    max={pointsBalance}
                    value={donationInput || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setDonationInput(isNaN(val) ? 0 : Math.max(0, val));
                      setDonationFeedback(null);
                    }}
                    className="w-44 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none min-h-[44px]"
                    aria-describedby="donation-helper"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    pontos
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[25, 50, 100, 200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setDonationInput(val);
                        setDonationFeedback(null);
                      }}
                      className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                        donationInput === val
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val} pts
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setDonationInput(pointsBalance);
                      setDonationFeedback(null);
                    }}
                    disabled={pointsBalance <= 0}
                    className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Tudo ({pointsBalance} pts)
                  </button>
                </div>
              </div>

              <span id="donation-helper" className="mt-1.5 block text-xs text-slate-500">
                Saldo disponível atual: <strong>{pointsBalance} pontos</strong>
              </span>
            </div>

            {/* Prévia da Doação */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Equivalente da doação para {selectedInitiative.name}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-teal-950">
                    {donationInput} pontos
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-teal-800">
                    ≈ {formatCurrencyPtBR(pointsToReais(donationInput))}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-confirm-donation"
                disabled={donationInput <= 0 || donationInput > pointsBalance}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-2 focus-visible:outline-teal-900"
              >
                Doar pontos
                <Heart className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Feedback da Doação */}
            {donationFeedback && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-2xl border p-4 text-xs sm:text-sm flex items-start gap-3 ${
                  donationFeedback.success
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : 'border-rose-200 bg-rose-50 text-rose-950'
                }`}
              >
                {donationFeedback.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <strong className="block font-bold">
                    {donationFeedback.message}
                  </strong>
                </div>
              </div>
            )}

            {/* Aviso Obrigatório */}
            <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 border border-slate-200 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                *Esta doação possui caráter demonstrativo. As organizações apresentadas são iniciativas didáticas simuladas para demonstrar o modelo de destinação socioambiental do EcoRetorna.
              </p>
            </div>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEÇÃO MANDATÓRIA: "Minhas operações" */}
      {/* ========================================================================= */}
      <section
        id="section-minhas-operacoes"
        aria-labelledby="heading-minhas-operacoes"
        className="space-y-4 pt-2"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 id="heading-minhas-operacoes" className="text-xl sm:text-2xl font-black text-slate-900">
              Minhas operações
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Histórico consolidado de resgates simulados e doações realizadas nesta conta
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {combinedOperations.length} registros
          </span>
        </div>

        {combinedOperations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            <Clock className="h-8 w-8 mx-auto text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-700">
              Nenhuma operação de resgate ou doação realizada até o momento.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Utilize as abas acima para simular um resgate de pontos ou apoiar uma iniciativa com sua pontuação de reciclagem.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            {/* Visão em Tabela Responsiva */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Data</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Tipo</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Iniciativa / Detalhe</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">Pontos Utilizados</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">Equivalente Financeiro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {combinedOperations.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/70 transition">
                      {/* Data */}
                      <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          {new Date(op.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                        {op.type === 'Resgate' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            <Coins className="h-3 w-3" aria-hidden="true" />
                            Resgate
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-900">
                            <Heart className="h-3 w-3" aria-hidden="true" />
                            Doação
                          </span>
                        )}
                      </td>

                      {/* Iniciativa / Detalhe */}
                      <td className="px-4 sm:px-6 py-3.5 font-semibold text-slate-800">
                        {op.initiativeName ? op.initiativeName : op.description}
                      </td>

                      {/* Pontos Utilizados */}
                      <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-rose-600 whitespace-nowrap">
                        -{op.points} pontos
                      </td>

                      {/* Equivalente Financeiro */}
                      <td className="px-4 sm:px-6 py-3.5 text-right font-extrabold text-slate-700 whitespace-nowrap">
                        ≈ {formatCurrencyPtBR(op.reaisValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* MODAL DE PRÉ-CONFIRMAÇÃO DO RESGATE */}
      {/* ========================================================================= */}
      {isConfirmingRedeem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-redeem-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Coins className="h-6 w-6" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmingRedeem(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar confirmação"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <h3 id="modal-redeem-title" className="mt-4 text-xl font-bold text-slate-900">
              Confirmar Resgate Demonstrativo
            </h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Pontos a descontar:</span>
                <strong className="text-slate-900">{redeemInput} pontos</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Equivalência financeira:</span>
                <strong className="text-emerald-700 font-extrabold">
                  ≈ {formatCurrencyPtBR(pointsToReais(redeemInput))}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Novo saldo resultante:</span>
                <span className="font-bold text-slate-800">
                  {pointsBalance - redeemInput} pontos
                </span>
              </div>
            </div>

            {/* Aviso Obrigatório do Resgate */}
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed font-medium">
                Esta operação é demonstrativa. Nenhuma transferência financeira real será realizada.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingRedeem(false)}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteRedeem}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-xs min-h-[44px] focus-visible:outline-2 focus-visible:outline-emerald-800"
              >
                Confirmar Resgate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE PRÉ-CONFIRMAÇÃO DA DOAÇÃO */}
      {/* ========================================================================= */}
      {isConfirmingDonation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-donation-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <Heart className="h-6 w-6" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmingDonation(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar confirmação"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <h3 id="modal-donation-title" className="mt-4 text-xl font-bold text-slate-900">
              Confirmar Doação Demonstrativa
            </h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Iniciativa beneficiada:</span>
                <strong className="text-slate-900">{selectedInitiative.name}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Pontos a doar:</span>
                <strong className="text-slate-900">{donationInput} pontos</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Equivalência financeira:</span>
                <strong className="text-teal-700 font-extrabold">
                  ≈ {formatCurrencyPtBR(pointsToReais(donationInput))}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Novo saldo resultante:</span>
                <span className="font-bold text-slate-800">
                  {pointsBalance - donationInput} pontos
                </span>
              </div>
            </div>

            {/* Aviso Obrigatório da Doação */}
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed font-medium">
                Esta doação possui caráter demonstrativo.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingDonation(false)}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDonation}
                className="flex-1 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800 transition shadow-xs min-h-[44px] focus-visible:outline-2 focus-visible:outline-teal-900"
              >
                Confirmar Doação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
