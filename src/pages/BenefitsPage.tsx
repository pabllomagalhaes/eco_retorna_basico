import React, { useState } from 'react';
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
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { INITIATIVES } from '../data/mockData';
import { calculatePoints, pointsToReais, formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';

export const BenefitsPage: React.FC = () => {
  const { pointsBalance, reaisEquivalent, redeemPoints, donatePoints, redemptions, donations } = useEco();

  // Tab ativa: 'resgate' ou 'doacao'
  const [activeTab, setActiveTab] = useState<'resgate' | 'doacao'>('resgate');

  // Estado A: Simular Resgate
  const [redeemInput, setRedeemInput] = useState<number>(80);
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Estado B: Doar Pontos
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>(INITIATIVES[0].id);
  const [donationInput, setDonationInput] = useState<number>(50);
  const [donationFeedback, setDonationFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Handlers
  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemFeedback(null);
    const result = redeemPoints(redeemInput, 'Resgate demonstrativo em créditos');
    setRedeemFeedback(result);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationFeedback(null);
    const initiative = INITIATIVES.find((i) => i.id === selectedInitiativeId) || INITIATIVES[0];
    const result = donatePoints(initiative.id, initiative.name, donationInput);
    setDonationFeedback(result);
  };

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Gift className="h-4 w-4" aria-hidden="true" />
          Retorno Social & Financeiro
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Benefícios & Destinações
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Utilize seu saldo de pontos acumulados com a reciclagem para resgates demonstrativos ou apoio a iniciativas ecológicas.
        </p>
      </div>

      {/* Saldo Atual de Destaque */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-800 to-teal-800 p-6 text-white shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
            Seu Saldo Disponível
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {formatNumberPtBR(pointsBalance)}
            </span>
            <span className="text-sm font-semibold text-emerald-200">pontos</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
          <span className="block text-[11px] font-semibold text-emerald-200 uppercase">
            Equivalente em Reais
          </span>
          <span className="text-2xl font-black text-emerald-300">
            ≈ {formatCurrencyPtBR(reaisEquivalent)}
          </span>
          <span className="block text-[10px] text-emerald-200/80">Regra: 1 ponto = R$ 0,125</span>
        </div>
      </div>

      {/* Seletor de Abas (A: Resgate | B: Doação) */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1.5" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'resgate'}
          onClick={() => {
            setActiveTab('resgate');
            setRedeemFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'resgate'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Coins className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          A) Simular Resgate
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'doacao'}
          onClick={() => {
            setActiveTab('doacao');
            setDonationFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === 'doacao'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Heart className="h-4 w-4 text-rose-600" aria-hidden="true" />
          B) Doar Pontos
        </button>
      </div>

      {/* CONTEÚDO DA ABA A: SIMULAR RESGATE */}
      {activeTab === 'resgate' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Resgate Simulado de Pontos</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Converta seus pontos em créditos demonstrativos. Nenhuma informação financeira (como Pix ou conta bancária) é solicitada.
            </p>
          </div>

          <form onSubmit={handleRedeemSubmit} className="space-y-5">
            <div>
              <label htmlFor="redeem-points-input" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantidade de Pontos para Resgatar
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="redeem-points-input"
                  type="number"
                  min="1"
                  max={pointsBalance}
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-40 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />

                {/* Botões Rápidos */}
                <div className="flex flex-wrap gap-2">
                  {[40, 80, 160, 240].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRedeemInput(val)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
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
                    onClick={() => setRedeemInput(pointsBalance)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Tudo ({pointsBalance} pts)
                  </button>
                </div>
              </div>
            </div>

            {/* Prévia do Resgate */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-emerald-800 uppercase">
                  Valor Convertido
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {redeemInput} pontos
                  </span>
                  <span className="text-base sm:text-lg font-bold text-emerald-800">
                    ≈ {formatCurrencyPtBR(pointsToReais(redeemInput))}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={redeemInput <= 0 || redeemInput > pointsBalance}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-emerald-800"
              >
                Confirmar Operação
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Feedback da Operação */}
            {redeemFeedback && (
              <div
                role="status"
                className={`rounded-2xl border p-4 text-xs sm:text-sm flex items-start gap-3 ${
                  redeemFeedback.success
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
                }`}
              >
                {redeemFeedback.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <strong className="block font-bold">
                    {redeemFeedback.success ? 'Resgate demonstrativo registrado.' : 'Operação não autorizada'}
                  </strong>
                  <span className="mt-0.5 block">{redeemFeedback.message}</span>
                </div>
              </div>
            )}
          </form>

          {/* Aviso Obrigatório */}
          <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500 border border-slate-200/70 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              *Nenhuma transferência financeira real foi realizada. Não solicitamos dados de cartão, conta bancária, chave Pix ou CPF nesta plataforma de incentivo à reciclagem.
            </p>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA B: DOAR PONTOS */}
      {activeTab === 'doacao' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Doar Pontos para Iniciativas Ambientais</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Apoie projetos socioambientais fictícios direcionando seus pontos acumulados.
            </p>
          </div>

          <form onSubmit={handleDonationSubmit} className="space-y-6">
            {/* Escolha da Iniciativa Fictícia */}
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                1. Selecione a Organização Fictícia:
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {INITIATIVES.map((init) => {
                  const Icon = getInitiativeIcon(init.iconName);
                  const isSelected = init.id === selectedInitiativeId;

                  return (
                    <button
                      key={init.id}
                      type="button"
                      onClick={() => setSelectedInitiativeId(init.id)}
                      className={`text-left rounded-2xl border p-4 transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      } focus-visible:outline-2 focus-visible:outline-emerald-600`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-2">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{init.name}</h4>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{init.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantidade de Pontos */}
            <div>
              <label htmlFor="donation-points-input" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                2. Quantidade de Pontos para Doar:
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="donation-points-input"
                  type="number"
                  min="1"
                  max={pointsBalance}
                  value={donationInput}
                  onChange={(e) => setDonationInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-40 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />

                <div className="flex flex-wrap gap-2">
                  {[25, 50, 100, 200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDonationInput(val)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        donationInput === val
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val} pts
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prévia da Doação */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-teal-800 uppercase">
                  Equivalência da Doação
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-teal-950">
                    {donationInput} pontos
                  </span>
                  <span className="text-base sm:text-lg font-bold text-teal-800">
                    ≈ {formatCurrencyPtBR(pointsToReais(donationInput))}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={donationInput <= 0 || donationInput > pointsBalance}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-teal-900"
              >
                Confirmar Doação
                <Heart className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Feedback da Doação */}
            {donationFeedback && (
              <div
                role="status"
                className={`rounded-2xl border p-4 text-xs sm:text-sm flex items-start gap-3 ${
                  donationFeedback.success
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
                }`}
              >
                {donationFeedback.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <strong className="block font-bold">
                    {donationFeedback.success ? 'Doação demonstrativa registrada.' : 'Operação não autorizada'}
                  </strong>
                  <span className="mt-0.5 block">{donationFeedback.message}</span>
                </div>
              </div>
            )}
          </form>

          {/* Aviso Obrigatório */}
          <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500 border border-slate-200/70 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              *Esta operação não representa transferência financeira real. As organizações apresentadas são iniciativas didáticas simuladas para demonstrar o modelo de destinação social.
            </p>
          </div>
        </div>
      )}

      {/* Histórico Recente de Resgates e Doações Realizados */}
      {(redemptions.length > 0 || donations.length > 0) && (
        <section aria-labelledby="benefits-history-heading" className="space-y-3">
          <h3 id="benefits-history-heading" className="text-base font-bold text-slate-900">
            Histórico das Operações Realizadas
          </h3>

          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
            {redemptions.map((red) => (
              <div key={red.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Coins className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">
                      Resgate Demonstrativo
                    </span>
                    <span className="block text-xs text-slate-400">
                      {new Date(red.date).toLocaleDateString('pt-BR')} • {red.description}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-sm font-bold text-rose-600">
                    -{red.pointsSpent} pts
                  </span>
                  <span className="block text-xs text-slate-500">
                    ≈ {formatCurrencyPtBR(red.reaisValue)}
                  </span>
                </div>
              </div>
            ))}

            {donations.map((don) => (
              <div key={don.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">
                      Doação: {don.initiativeName}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {new Date(don.date).toLocaleDateString('pt-BR')} • Iniciativa socioambiental
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-sm font-bold text-teal-700">
                    -{don.pointsDonated} pts
                  </span>
                  <span className="block text-xs text-slate-500">
                    ≈ {formatCurrencyPtBR(don.reaisValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
