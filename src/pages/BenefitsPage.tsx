import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Package,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { pointsToReais, formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';
import { BenefitService } from '../services/benefitService';
import { Benefit } from '../types';

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
  const { pointsBalance, reaisEquivalent, redeemPoints, donatePoints, redemptions, donations, settings } = useEco();

  // Tab ativa: 'resgate' ou 'doacao'
  const [activeTab, setActiveTab] = useState<'resgate' | 'doacao'>('resgate');

  // Catálogo de benefícios remotos / locais
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState<boolean>(true);
  const [benefitsError, setBenefitsError] = useState<string | null>(null);

  // Benefício selecionado para modal de resgate
  const [selectedBenefitForRedeem, setSelectedBenefitForRedeem] = useState<Benefit | null>(null);
  const [isSubmittingRedeem, setIsSubmittingRedeem] = useState<boolean>(false);

  // Benefício selecionado para modal de doação
  const [selectedBenefitForDonation, setSelectedBenefitForDonation] = useState<Benefit | null>(null);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState<boolean>(false);

  // Feedback geral de operações
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; message: string; submessage?: string } | null>(null);

  // Carregar catálogo de benefícios
  const loadBenefits = useCallback(async () => {
    setIsLoadingBenefits(true);
    setBenefitsError(null);
    try {
      const list = await BenefitService.getActiveBenefits();
      setBenefits(list);
    } catch (err: any) {
      console.warn('[EcoRetorna] Erro ao carregar benefícios:', err);
      setBenefitsError('Não foi possível carregar o catálogo de benefícios no momento.');
      setBenefits([]);
    } finally {
      setIsLoadingBenefits(false);
    }
  }, []);

  useEffect(() => {
    loadBenefits();
  }, [loadBenefits]);

  // Benefícios separados por categoria
  const redeemableBenefits = useMemo(() => {
    return benefits.filter((b) => b.category !== 'donation');
  }, [benefits]);

  const donationBenefits = useMemo(() => {
    return benefits.filter((b) => b.category === 'donation');
  }, [benefits]);

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
        description: r.benefitTitle || r.description,
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

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [redemptions, donations]);

  // Ícones de causas
  const getCauseIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('água') || lower.includes('rio') || lower.includes('oceano')) return Droplets;
    if (lower.includes('mata') || lower.includes('árvore') || lower.includes('floresta') || lower.includes('verde')) return Trees;
    if (lower.includes('mar') || lower.includes('praia') || lower.includes('onda')) return Waves;
    return Heart;
  };

  // Execução de Resgate de Benefício com valor fixo oficial
  const handleExecuteBenefitRedeem = async () => {
    if (!selectedBenefitForRedeem) return;

    if (pointsBalance < selectedBenefitForRedeem.pointsRequired) {
      setActionFeedback({
        success: false,
        message: 'Saldo de pontos insuficiente para resgatar este benefício.',
      });
      setSelectedBenefitForRedeem(null);
      return;
    }

    setIsSubmittingRedeem(true);
    setActionFeedback(null);

    const result = await redeemPoints(
      selectedBenefitForRedeem.pointsRequired,
      selectedBenefitForRedeem.description,
      selectedBenefitForRedeem.id,
      selectedBenefitForRedeem.title
    );

    setIsSubmittingRedeem(false);
    setSelectedBenefitForRedeem(null);

    if (result.success) {
      setActionFeedback({
        success: true,
        message: `Resgate demonstrativo de "${selectedBenefitForRedeem.title}" realizado com sucesso!`,
        submessage: 'Nenhum pagamento ou entrega física real acontece. Esta operação possui caráter acadêmico.',
      });
    } else {
      setActionFeedback({
        success: false,
        message: result.message || 'Falha ao registrar resgate no servidor. Tente novamente mais tarde.',
      });
    }
  };

  // Execução de Doação de Benefício com valor fixo oficial
  const handleExecuteBenefitDonation = async () => {
    if (!selectedBenefitForDonation) return;

    if (pointsBalance < selectedBenefitForDonation.pointsRequired) {
      setActionFeedback({
        success: false,
        message: 'Saldo de pontos insuficiente para apoiar esta iniciativa.',
      });
      setSelectedBenefitForDonation(null);
      return;
    }

    setIsSubmittingDonation(true);
    setActionFeedback(null);

    const result = await donatePoints(
      selectedBenefitForDonation.id,
      selectedBenefitForDonation.title,
      selectedBenefitForDonation.pointsRequired
    );

    setIsSubmittingDonation(false);
    setSelectedBenefitForDonation(null);

    if (result.success) {
      setActionFeedback({
        success: true,
        message: `Doação demonstrativa para "${selectedBenefitForDonation.title}" registrada com sucesso!`,
        submessage: 'Obrigado por incentivar o modelo de retorno socioambiental do EcoRetorna.',
      });
    } else {
      setActionFeedback({
        success: false,
        message: result.message || 'Falha ao registrar doação no servidor. Tente novamente mais tarde.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Principal da Página */}
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs tracking-wider uppercase">
          <Gift className="h-4 w-4" aria-hidden="true" />
          Retorno Social & Recompensas
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Benefícios
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Utilize seus pontos acumulados através da reciclagem para resgatar brindes ecológicos ou apoiar causas socioambientais.
        </p>
      </header>

      {/* Saldo Atual de Destaque */}
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
              Regra central: 1 ponto = {formatCurrencyPtBR(settings.pointValueBRL)}
            </span>
          </div>
        </div>
      </section>

      {/* Feedback de Operação (Sucesso ou Erro) */}
      {actionFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-2xl border p-4 text-xs sm:text-sm flex items-start gap-3 transition-all ${
            actionFeedback.success
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-rose-200 bg-rose-50 text-rose-950'
          }`}
        >
          {actionFeedback.success ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div className="flex-1">
            <strong className="block font-bold">
              {actionFeedback.message}
            </strong>
            {actionFeedback.submessage && (
              <span className="mt-0.5 block text-slate-700">
                {actionFeedback.submessage}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Fechar alerta"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Seletor de Abas */}
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
            setActionFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'resgate'
              ? 'bg-white text-emerald-900 shadow-sm border border-emerald-200/60'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Gift className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          Brindes & Recompensas ({redeemableBenefits.length})
        </button>

        <button
          type="button"
          id="tab-doacao"
          role="tab"
          aria-selected={activeTab === 'doacao'}
          aria-controls="panel-doacao"
          onClick={() => {
            setActiveTab('doacao');
            setActionFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition min-h-[44px] ${
            activeTab === 'doacao'
              ? 'bg-white text-emerald-900 shadow-sm border border-emerald-200/60'
              : 'text-slate-600 hover:text-slate-900'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
        >
          <Heart className="h-4 w-4 text-rose-600" aria-hidden="true" />
          Doar pontos ({donationBenefits.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: RESGATAR BENEFÍCIOS (BRINDES & RECOMPENSAS) */}
      {/* ========================================================================= */}
      {activeTab === 'resgate' && (
        <section
          id="panel-resgate"
          role="tabpanel"
          aria-labelledby="tab-resgate"
          className="space-y-6"
        >
          {/* Card Descritivo */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Catálogo de Brindes & Recompensas
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Troque seus pontos acumulados por produtos ecológicos certificados. Cada item utiliza a pontuação exata cadastrada.
                </p>
              </div>
              <button
                type="button"
                onClick={loadBenefits}
                disabled={isLoadingBenefits}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition self-start sm:self-auto min-h-[40px]"
                title="Atualizar catálogo de benefícios"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingBenefits ? 'animate-spin' : ''}`} aria-hidden="true" />
                Atualizar
              </button>
            </div>
          </div>

          {/* Estado de Carregamento */}
          {isLoadingBenefits && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <Loader2 className="h-8 w-8 mx-auto text-emerald-600 animate-spin mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-700">Carregando catálogo de benefícios...</p>
              <p className="text-xs text-slate-400 mt-1">Sincronizando com o catálogo oficial.</p>
            </div>
          )}

          {/* Estado de Erro Amigável */}
          {!isLoadingBenefits && benefitsError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 text-center text-rose-900">
              <AlertCircle className="h-8 w-8 mx-auto text-rose-600 mb-2" aria-hidden="true" />
              <h3 className="text-sm font-bold">{benefitsError}</h3>
              <p className="text-xs text-rose-700 mt-1">Verifique sua conexão ou tente novamente.</p>
              <button
                type="button"
                onClick={loadBenefits}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Tentar novamente
              </button>
            </div>
          )}

          {/* Estado Vazio Amigável */}
          {!isLoadingBenefits && !benefitsError && redeemableBenefits.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              <Package className="h-10 w-10 mx-auto text-slate-400 mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-800">
                Nenhum benefício disponível no momento
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                Novas opções de recompensas e brindes ecológicos serão disponibilizadas em breve pelos administradores.
              </p>
            </div>
          )}

          {/* Grid de Cards de Benefícios */}
          {!isLoadingBenefits && !benefitsError && redeemableBenefits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemableBenefits.map((benefit) => {
                const isOutOfStock = benefit.stock === 0;
                const hasSufficientPoints = pointsBalance >= benefit.pointsRequired;
                const reaisValue = pointsToReais(benefit.pointsRequired, settings.pointValueBRL);

                return (
                  <div
                    key={benefit.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60">
                          <Gift className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                          {benefit.category === 'other' ? 'Experiência' : 'Brinde Ecológico'}
                        </span>

                        {isOutOfStock ? (
                          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            Esgotado
                          </span>
                        ) : benefit.stock !== null ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {benefit.stock} un. em estoque
                          </span>
                        ) : (
                          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                            Disponível
                          </span>
                        )}
                      </div>

                      {/* Título & Descrição */}
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {benefit.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {benefit.description}
                      </p>
                    </div>

                    {/* Preço em Pontos & Botão de Resgate */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Custo
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-emerald-900">
                            {benefit.pointsRequired}
                          </span>
                          <span className="text-xs font-bold text-emerald-700">pts</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ≈ {formatCurrencyPtBR(reaisValue)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBenefitForRedeem(benefit)}
                        disabled={isOutOfStock || !hasSufficientPoints}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition min-h-[44px] ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : !hasSufficientPoints
                            ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-900'
                        }`}
                        title={
                          isOutOfStock
                            ? 'Produto temporariamente sem estoque'
                            : !hasSufficientPoints
                            ? 'Você não possui pontos suficientes para este resgate'
                            : `Resgatar ${benefit.title}`
                        }
                      >
                        {isOutOfStock ? (
                          'Esgotado'
                        ) : !hasSufficientPoints ? (
                          'Pontos insuficientes'
                        ) : (
                          <>
                            Resgatar
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          className="space-y-6"
        >
          {/* Card Descritivo */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Doar pontos para causas socioambientais
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direcione sua pontuação de reciclagem para apoiar iniciativas que regeneram a natureza. Cada projeto possui o valor demonstrativo exato cadastrado.
                </p>
              </div>
              <button
                type="button"
                onClick={loadBenefits}
                disabled={isLoadingBenefits}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition self-start sm:self-auto min-h-[40px]"
                title="Atualizar iniciativas"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingBenefits ? 'animate-spin' : ''}`} aria-hidden="true" />
                Atualizar
              </button>
            </div>
          </div>

          {/* Estado de Carregamento */}
          {isLoadingBenefits && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <Loader2 className="h-8 w-8 mx-auto text-teal-600 animate-spin mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-700">Carregando projetos disponíveis...</p>
            </div>
          )}

          {/* Estado de Erro Amigável */}
          {!isLoadingBenefits && benefitsError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 text-center text-rose-900">
              <AlertCircle className="h-8 w-8 mx-auto text-rose-600 mb-2" aria-hidden="true" />
              <h3 className="text-sm font-bold">{benefitsError}</h3>
              <button
                type="button"
                onClick={loadBenefits}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Tentar novamente
              </button>
            </div>
          )}

          {/* Quando existirem benefícios com category == 'donation' */}
          {!isLoadingBenefits && !benefitsError && donationBenefits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donationBenefits.map((benefit) => {
                const Icon = getCauseIcon(benefit.title);
                const hasSufficientPoints = pointsBalance >= benefit.pointsRequired;
                const reaisValue = pointsToReais(benefit.pointsRequired, settings.pointValueBRL);

                return (
                  <div
                    key={benefit.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-teal-300 hover:shadow-sm transition"
                  >
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 mb-3 border border-teal-200/60">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>

                      <span className="inline-block text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                        Causa Socioambiental
                      </span>

                      <h3 className="text-base font-black text-slate-900 mt-1">
                        {benefit.title}
                      </h3>

                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Valor da Doação
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-teal-950">
                            {benefit.pointsRequired}
                          </span>
                          <span className="text-xs font-bold text-teal-800">pts</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ≈ {formatCurrencyPtBR(reaisValue)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBenefitForDonation(benefit)}
                        disabled={!hasSufficientPoints}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition min-h-[44px] ${
                          !hasSufficientPoints
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-teal-700 text-white hover:bg-teal-800 shadow-xs focus-visible:outline-2 focus-visible:outline-teal-900'
                        }`}
                        title={
                          !hasSufficientPoints
                            ? 'Você não possui pontos suficientes para esta doação'
                            : `Apoiar ${benefit.title}`
                        }
                      >
                        {!hasSufficientPoints ? (
                          'Pontos insuficientes'
                        ) : (
                          <>
                            Doar pontos
                            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Se a coleção 'benefits' não tiver itens de doação cadastrados pelo Admin */}
          {!isLoadingBenefits && !benefitsError && donationBenefits.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              <Heart className="h-10 w-10 mx-auto text-slate-400 mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-800">
                Nenhuma causa de doação cadastrada no momento
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                As causas ambientais cadastradas no catálogo do painel administrativo aparecerão aqui para os participantes.
              </p>
            </div>
          )}

          {/* Aviso Obrigatório */}
          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 border border-slate-200 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              *Esta operação é demonstrativa para fins didáticos. Nenhuma transferência financeira real será realizada. O sistema não solicita nem armazena dados de chave Pix, CPF, contas bancárias ou senhas.
            </p>
          </div>
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
              Utilize as abas acima para simular um resgate de brindes ou apoiar uma causa socioambiental.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Data</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Tipo</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5">Iniciativa / Benefício</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">Pontos Utilizados</th>
                    <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">Equivalente Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {combinedOperations.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          {new Date(op.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </td>

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

                      <td className="px-4 sm:px-6 py-3.5 font-semibold text-slate-800">
                        {op.initiativeName || op.description}
                      </td>

                      <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-rose-600 whitespace-nowrap">
                        -{op.points} pontos
                      </td>

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
      {/* MODAL DE CONFIRMAÇÃO DE RESGATE DE BENEFÍCIO DO CATÁLOGO */}
      {/* ========================================================================= */}
      {selectedBenefitForRedeem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-redeem-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Gift className="h-6 w-6" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setSelectedBenefitForRedeem(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar confirmação"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <h3 id="modal-redeem-title" className="mt-4 text-xl font-bold text-slate-900">
              Confirmar Resgate do Benefício
            </h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Item escolhido:</span>
                <strong className="text-slate-900 text-right">{selectedBenefitForRedeem.title}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Pontos necessários:</span>
                <strong className="text-emerald-700 font-extrabold">
                  {selectedBenefitForRedeem.pointsRequired} pontos
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Equivalência financeira:</span>
                <strong className="text-slate-700">
                  ≈ {formatCurrencyPtBR(pointsToReais(selectedBenefitForRedeem.pointsRequired, settings.pointValueBRL))}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Saldo após operação:</span>
                <span className="font-bold text-slate-800">
                  {pointsBalance - selectedBenefitForRedeem.pointsRequired} pontos
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed font-medium">
                Esta operação é estritamente demonstrativa para fins acadêmicos. Nenhum pagamento ou entrega física real será realizada.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setSelectedBenefitForRedeem(null)}
                disabled={isSubmittingRedeem}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteBenefitRedeem}
                disabled={isSubmittingRedeem}
                className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition shadow-xs min-h-[44px] flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-emerald-900"
              >
                {isSubmittingRedeem ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Registrando...
                  </>
                ) : (
                  'Confirmar Resgate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO DE DOAÇÃO DE BENEFÍCIO DO CATÁLOGO */}
      {/* ========================================================================= */}
      {selectedBenefitForDonation && (
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
                onClick={() => setSelectedBenefitForDonation(null)}
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
                <span className="text-slate-500">Causa beneficiada:</span>
                <strong className="text-slate-900 text-right">{selectedBenefitForDonation.title}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Pontos a doar:</span>
                <strong className="text-teal-700 font-extrabold">
                  {selectedBenefitForDonation.pointsRequired} pontos
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Equivalência financeira:</span>
                <strong className="text-slate-700">
                  ≈ {formatCurrencyPtBR(pointsToReais(selectedBenefitForDonation.pointsRequired, settings.pointValueBRL))}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Saldo após operação:</span>
                <span className="font-bold text-slate-800">
                  {pointsBalance - selectedBenefitForDonation.pointsRequired} pontos
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed font-medium">
                Esta doação possui caráter demonstrativo para fins didáticos. Nenhuma transferência financeira real será executada.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setSelectedBenefitForDonation(null)}
                disabled={isSubmittingDonation}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteBenefitDonation}
                disabled={isSubmittingDonation}
                className="flex-1 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800 transition shadow-xs min-h-[44px] flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-teal-900"
              >
                {isSubmittingDonation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Registrando...
                  </>
                ) : (
                  'Confirmar Doação'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
