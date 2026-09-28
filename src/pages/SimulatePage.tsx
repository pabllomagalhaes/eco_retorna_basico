import React, { useState, useMemo } from 'react';
import {
  Calculator,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Coins,
  Package,
  Plus,
  Minus,
  Info,
  Tag,
  Loader2,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { CampaignService } from '../services/campaignService';
import {
  calcularValorEmReais,
  formatCurrencyPtBR,
  formatNumberPtBR,
} from '../utils/scoring';

export const SimulatePage: React.FC = () => {
  const {
    materials,
    campaigns,
    settings,
    isMaterialsLoading,
    materialsError,
  } = useEco();

  // Quantidades locais da simulação (estritamente efêmeras - não tocam saldo ou histórico)
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleInputChange = (id: string, valueStr: string) => {
    const parsed = parseInt(valueStr, 10);
    const safeValue = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    setQuantities((prev) => ({
      ...prev,
      [id]: safeValue,
    }));
  };

  const handleReset = () => {
    setQuantities({});
  };

  // Filtra apenas materiais ativos
  const activeMaterials = useMemo(() => {
    return materials.filter((m) => m.active !== false);
  }, [materials]);

  // Cálculos dinâmicos em tempo real com aplicação de campanhas
  const simulationResults = useMemo(() => {
    let totalContainers = 0;
    let totalBasePoints = 0;
    let totalBonusPoints = 0;

    const items = activeMaterials.map((mat) => {
      const qty = Math.max(0, quantities[mat.id] || 0);
      const activeCampaign = CampaignService.findActiveCampaignForMaterial(mat.id, campaigns);
      const bonusCalc = CampaignService.calculateBonus(mat, qty, activeCampaign);
      const basePoints = Math.round(qty * mat.pointsPerUnit);

      totalContainers += qty;
      totalBasePoints += basePoints;
      totalBonusPoints += bonusCalc.bonusPoints;

      return {
        material: mat,
        quantity: qty,
        basePoints,
        bonusPoints: bonusCalc.bonusPoints,
        totalPoints: bonusCalc.totalPoints,
        appliedCampaign: bonusCalc.appliedCampaign,
        explanation: bonusCalc.explanation,
        activeCampaign,
      };
    });

    const totalPoints = totalBasePoints + totalBonusPoints;
    const totalReais = calcularValorEmReais(totalPoints, settings.pointValueBRL);

    return {
      items,
      totalContainers,
      totalBasePoints,
      totalBonusPoints,
      totalPoints,
      totalReais,
    };
  }, [activeMaterials, quantities, campaigns, settings.pointValueBRL]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          Calculadora de Embalagens
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Simule sua reciclagem
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Descubra quantos pontos suas embalagens podem valer.
        </p>
      </div>

      {/* AVISO MANDATÓRIO EM DESTAQUE */}
      <div
        role="alert"
        aria-live="polite"
        className="flex items-start gap-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5 text-amber-950 shadow-xs"
      >
        <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="font-bold text-sm sm:text-base text-amber-950">
            Atenção: Modo Simulação
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-amber-900 leading-relaxed">
            Esta é apenas uma simulação. Nenhum ponto será adicionado ao seu saldo.
          </p>
        </div>
      </div>

      {/* Feedback de Erro de Conexão */}
      {materialsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          {materialsError}
        </div>
      )}

      {/* Estado de Carregamento */}
      {isMaterialsLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-600">Carregando embalagens disponíveis...</p>
        </div>
      )}

      {/* Estado Vazio de Materiais */}
      {!isMaterialsLoading && activeMaterials.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" aria-hidden="true" />
          <h3 className="text-lg font-bold text-slate-900">Nenhum material disponível no momento</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Não há materiais cadastrados ou ativos para reciclagem no momento. Volte em breve para simular novas embalagens.
          </p>
        </div>
      )}

      {/* Cards de Controles de Embalagens */}
      {!isMaterialsLoading && activeMaterials.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {simulationResults.items.map((item) => {
            const mat = item.material;
            const count = item.quantity;
            const isPet = mat.category === 'pet';
            const isAlu = mat.category === 'aluminio';

            const decrAriaLabel = `Diminuir quantidade de ${mat.name}`;
            const incrAriaLabel = `Aumentar quantidade de ${mat.name}`;
            const inputAriaLabel = `Quantidade de ${mat.name}`;

            // Dica de quantidade mínima para ganhar bônus
            const showMinimumQuantityHint =
              item.activeCampaign?.type === 'quantity_bonus' &&
              item.activeCampaign.minimumQuantity &&
              count > 0 &&
              count % item.activeCampaign.minimumQuantity !== 0;

            const remainingForBonus = item.activeCampaign?.minimumQuantity
              ? item.activeCampaign.minimumQuantity - (count % item.activeCampaign.minimumQuantity)
              : 0;

            return (
              <div
                key={mat.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isPet
                          ? 'bg-blue-100 text-blue-800'
                          : isAlu
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {mat.name}
                    </span>

                    <span className="text-xs font-bold text-emerald-700">
                      {mat.pointsPerUnit} {mat.pointsPerUnit === 1 ? 'ponto' : 'pontos'} por unidade
                    </span>
                  </div>

                  {/* Badge de Campanha Promocional Ativa */}
                  {item.activeCampaign && (
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300/60 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                        {item.activeCampaign.type === 'multiplier' ? (
                          <>
                            <Sparkles className="h-3 w-3 text-amber-700" aria-hidden="true" />
                            {item.activeCampaign.multiplier === 2
                              ? 'Pontos em Dobro'
                              : `${item.activeCampaign.multiplier}x Pontos`}
                          </>
                        ) : (
                          <>
                            <Tag className="h-3 w-3 text-amber-700" aria-hidden="true" />
                            +{item.activeCampaign.bonusPoints} pts a cada {item.activeCampaign.minimumQuantity} un
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-medium text-amber-900 truncate">
                        {item.activeCampaign.title}
                      </span>
                    </div>
                  )}

                  <h3 className="mt-3 text-lg font-bold text-slate-900">{mat.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{mat.description}</p>
                </div>

                {/* Feedback de Bônus ou Dica de Quantidade */}
                <div className="mt-3">
                  {item.bonusPoints > 0 && item.explanation && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">
                      ✓ {item.explanation}
                    </div>
                  )}

                  {showMinimumQuantityHint && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] font-medium text-amber-900">
                      💡 Adicione mais {remainingForBonus} {remainingForBonus === 1 ? 'unidade' : 'unidades'} para ganhar +{item.activeCampaign?.bonusPoints} pontos de bônus!
                    </div>
                  )}
                </div>

                {/* Controles de Quantidade: [-] quantidade [+] */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-600">Quantidade:</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(mat.id, -1)}
                      disabled={count <= 0}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                      aria-label={decrAriaLabel}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <input
                      type="number"
                      min="0"
                      max="9999"
                      value={count}
                      onChange={(e) => handleInputChange(mat.id, e.target.value)}
                      className="h-11 w-16 text-center text-base font-bold text-slate-900 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                      aria-label={inputAriaLabel}
                    />

                    <button
                      type="button"
                      onClick={() => updateQuantity(mat.id, 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                      aria-label={incrAriaLabel}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumo da Simulação em Tempo Real */}
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-teal-50/40 to-emerald-100/30 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <Sparkles className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h3 className="text-base sm:text-lg">Resumo da Simulação</h3>
          </div>

          <button
            type="button"
            id="btn-clear-simulation"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
            aria-label="Limpar simulação e zerar todas as quantidades"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            Limpar simulação
          </button>
        </div>

        {/* Três Métricas Centrais */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Quantidade total de embalagens */}
          <div className="rounded-2xl border border-white/90 bg-white/95 p-4 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Package className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total de Embalagens
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatNumberPtBR(simulationResults.totalContainers)}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {simulationResults.totalContainers === 1 ? 'embalagem' : 'embalagens'}
              </span>
            </div>
          </div>

          {/* Pontos estimados com discriminação de bônus */}
          <div className="rounded-2xl border border-white/90 bg-white/95 p-4 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pontos Estimados
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                {formatNumberPtBR(simulationResults.totalPoints)}
              </span>
              <span className="text-xs font-semibold text-emerald-600">pontos</span>
            </div>
            {simulationResults.totalBonusPoints > 0 && (
              <span className="mt-1 block text-[11px] font-bold text-emerald-800">
                {simulationResults.totalBasePoints} base + {simulationResults.totalBonusPoints} bônus
              </span>
            )}
          </div>

          {/* Equivalente em reais com base na taxa configurada */}
          <div className="rounded-2xl border border-white/90 bg-white/95 p-4 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Coins className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Equivalente em Reais
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
              ≈ {formatCurrencyPtBR(simulationResults.totalReais)}
            </div>
            <span className="mt-1 block text-[11px] font-medium text-slate-500">
              1 ponto = {formatCurrencyPtBR(settings.pointValueBRL)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-emerald-800">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Os valores atualizam imediatamente ao alterar qualquer controle.</span>
        </div>
      </div>
    </div>
  );
};

