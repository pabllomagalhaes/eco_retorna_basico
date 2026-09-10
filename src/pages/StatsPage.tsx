import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PackageCheck,
  Leaf,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import {
  calculateTotalContainers,
  calculateTotalByMaterial,
  calculateEstimatedCO2,
  calculateEstimatedCO2FromCounts,
  groupRecordsByMonth,
  calculatePeriodComparison,
  environmentalFactors,
  MonthlyAggregate,
} from '../utils/environmental';
import { formatNumberPtBR } from '../utils/scoring';
import { RecyclingRecord } from '../types';

type PeriodFilter = '30days' | '3months' | '6months' | 'all';

interface FilterOption {
  id: PeriodFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: '30days', label: 'Últimos 30 dias' },
  { id: '3months', label: 'Últimos 3 meses' },
  { id: '6months', label: 'Últimos 6 meses' },
  { id: 'all', label: 'Todo o período' },
];

export const StatsPage: React.FC = () => {
  const { recyclingRecords } = useEco();

  // Estado do filtro de período
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');

  // Determina a data de referência baseada no registro mais recente ou data atual
  const referenceDate = useMemo(() => {
    if (!recyclingRecords.length) return new Date();
    const timestamps = recyclingRecords.map((r) => new Date(r.date).getTime());
    const latestTime = Math.max(...timestamps);
    const date = new Date(latestTime);
    // Fixa o fim do dia para comparações justas
    date.setHours(23, 59, 59, 999);
    return date;
  }, [recyclingRecords]);

  // Filtra os registros do período atual e calcula o período imediatamente anterior para comparação
  const { currentPeriodRecords, previousPeriodRecords } = useMemo(() => {
    if (selectedPeriod === 'all') {
      return {
        currentPeriodRecords: recyclingRecords,
        previousPeriodRecords: [] as RecyclingRecord[],
      };
    }

    let days = 30;
    if (selectedPeriod === '3months') days = 90;
    if (selectedPeriod === '6months') days = 180;

    const refTime = referenceDate.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const currentStartTime = refTime - days * oneDayMs;
    const previousStartTime = currentStartTime - days * oneDayMs;

    const current = recyclingRecords.filter((record) => {
      const time = new Date(record.date).getTime();
      return time >= currentStartTime && time <= refTime;
    });

    const previous = recyclingRecords.filter((record) => {
      const time = new Date(record.date).getTime();
      return time >= previousStartTime && time < currentStartTime;
    });

    return {
      currentPeriodRecords: current,
      previousPeriodRecords: previous,
    };
  }, [recyclingRecords, selectedPeriod, referenceDate]);

  // Cálculos do período selecionado
  const currentTotalContainers = useMemo(
    () => calculateTotalContainers(currentPeriodRecords),
    [currentPeriodRecords]
  );

  const currentPoints = useMemo(
    () => currentPeriodRecords.reduce((sum, r) => sum + (Number(r.pointsEarned) || 0), 0),
    [currentPeriodRecords]
  );

  const currentCO2e = useMemo(
    () => calculateEstimatedCO2(currentPeriodRecords),
    [currentPeriodRecords]
  );

  const currentMaterials = useMemo(
    () => calculateTotalByMaterial(currentPeriodRecords),
    [currentPeriodRecords]
  );

  // Comparação com período anterior
  const previousTotalContainers = useMemo(
    () => calculateTotalContainers(previousPeriodRecords),
    [previousPeriodRecords]
  );

  const comparison = useMemo(() => {
    if (selectedPeriod === 'all') {
      return {
        percent: null,
        text: 'Ainda não há dados suficientes para comparação.',
        hasData: false,
      };
    }
    return calculatePeriodComparison(currentTotalContainers, previousTotalContainers);
  }, [selectedPeriod, currentTotalContainers, previousTotalContainers]);

  // Agrupamento mensal do período selecionado
  const monthlyData: MonthlyAggregate[] = useMemo(() => {
    return groupRecordsByMonth(currentPeriodRecords);
  }, [currentPeriodRecords]);

  // Máximos para cálculo proporcional das alturas dos gráficos
  const maxContainers = useMemo(() => {
    if (!monthlyData.length) return 10;
    return Math.max(...monthlyData.map((d) => d.containers), 10);
  }, [monthlyData]);

  const maxCO2e = useMemo(() => {
    if (!monthlyData.length) return 5;
    return Math.max(...monthlyData.map((d) => d.co2e), 5);
  }, [monthlyData]);

  // Proporções de materiais
  const petPercentage =
    currentMaterials.total > 0
      ? Math.round((currentMaterials.pet / currentMaterials.total) * 100)
      : 0;
  const aluPercentage =
    currentMaterials.total > 0
      ? 100 - petPercentage
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Analítico */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Visão Analítica
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
            Minhas Estatísticas
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Acompanhe a evolução temporal das suas reciclagens e o impacto acumulado mês a mês.
          </p>
        </div>
      </div>

      {/* Barra de Filtros de Período */}
      <section
        aria-label="Filtros de Período"
        className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Calendar className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Filtrar por período:</span>
        </div>

        <div
          role="group"
          aria-label="Opções de período"
          className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap"
        >
          {FILTER_OPTIONS.map((option) => {
            const isSelected = selectedPeriod === option.id;
            return (
              <button
                key={option.id}
                type="button"
                id={`filter-btn-${option.id}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedPeriod(option.id)}
                className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Seção 6: RESUMO DO PERÍODO */}
      <section
        aria-labelledby="period-summary-heading"
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 id="period-summary-heading" className="text-base sm:text-lg font-bold text-slate-900">
            Resumo do Período (
            {FILTER_OPTIONS.find((f) => f.id === selectedPeriod)?.label}
            )
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Quantidade de embalagens */}
          <div
            id="stats-card-containers"
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Embalagens no período
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <PackageCheck className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900">
                {formatNumberPtBR(currentTotalContainers)}
              </div>
              <span className="text-xs text-slate-500">embalagens entregues</span>
            </div>
          </div>

          {/* Card 2: Pontos obtidos */}
          <div
            id="stats-card-points"
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pontos obtidos no período
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-amber-700">
                {formatNumberPtBR(currentPoints)}
              </div>
              <span className="text-xs text-slate-500">pontos acumulados</span>
            </div>
          </div>

          {/* Card 3: CO2e evitado estimado */}
          <div
            id="stats-card-co2"
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CO₂e evitado estimado
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1 text-3xl font-black text-teal-900">
                <span className="text-lg font-medium text-teal-600">≈</span>
                {formatNumberPtBR(currentCO2e, 1)}
                <span className="text-base font-bold text-teal-700">kg</span>
              </div>
              <span className="text-xs text-slate-500">emissões evitadas no período</span>
            </div>
          </div>
        </div>

        {/* Seção 10: Comparação com Período Anterior */}
        <div
          id="stats-comparison-banner"
          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                comparison.hasData && comparison.percent !== null && comparison.percent >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : comparison.hasData && comparison.percent !== null && comparison.percent < 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {comparison.hasData && comparison.percent !== null && comparison.percent >= 0 ? (
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              ) : comparison.hasData && comparison.percent !== null && comparison.percent < 0 ? (
                <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Info className="h-5 w-5" aria-hidden="true" />
              )}
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase">
                Comparação com período anterior
              </span>
              <span className="block text-sm font-semibold text-slate-900">
                {comparison.text}
              </span>
            </div>
          </div>

          {comparison.hasData && (
            <span className="text-xs text-slate-500 self-start sm:self-auto">
              Período anterior: {formatNumberPtBR(previousTotalContainers)} embalagens
            </span>
          )}
        </div>
      </section>

      {/* Seção 7: GRÁFICO DE EVOLUÇÃO DAS RECICLAGENS */}
      <section
        aria-labelledby="monthly-evolution-heading"
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="monthly-evolution-heading" className="text-lg font-bold text-slate-900">
              Evolução das reciclagens
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Eixo vertical: quantidade de embalagens
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Quantidade total de embalagens recolhidas por mês no período selecionado.
          </p>
        </div>

        {monthlyData.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Nenhum registro de reciclagem encontrado para o período selecionado.
          </div>
        ) : (
          <div className="mt-6">
            {/* Gráfico de Barras Acessível */}
            <div
              className="flex h-60 sm:h-72 items-end justify-around gap-2 sm:gap-4 border-b border-slate-200 px-2 pb-2"
              role="region"
              aria-label="Gráfico de barras da evolução mensal das reciclagens"
            >
              {monthlyData.map((item) => {
                const heightPercent = Math.max(12, Math.round((item.containers / maxContainers) * 100));

                return (
                  <div
                    key={`bar-containers-${item.monthKey}`}
                    className="flex flex-1 flex-col items-center justify-end h-full group"
                  >
                    {/* Valor numérico visível acima da barra */}
                    <span
                      className="mb-1.5 text-xs sm:text-sm font-black text-slate-800 group-hover:text-emerald-700 transition"
                      aria-hidden="true"
                    >
                      {item.containers}
                    </span>

                    {/* Barra visual proporcional */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[56px] rounded-t-xl bg-emerald-600 transition-all duration-300 group-hover:bg-emerald-700 shadow-2xs"
                      role="img"
                      aria-label={`${item.label}: ${item.containers} embalagens recicladas`}
                    />

                    {/* Eixo horizontal: rótulo do mês */}
                    <span className="mt-2 text-xs font-bold text-slate-700">
                      {item.shortLabel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.year}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tabela acessível alternativa para leitores de tela */}
            <details className="mt-4 text-xs text-slate-600">
              <summary className="cursor-pointer font-bold text-emerald-800 hover:underline">
                Visualizar tabela com os dados deste gráfico
              </summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-1 px-2 font-bold text-slate-700">Mês</th>
                      <th className="py-1 px-2 font-bold text-slate-700">Embalagens</th>
                      <th className="py-1 px-2 font-bold text-slate-700">PET</th>
                      <th className="py-1 px-2 font-bold text-slate-700">Alumínio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((item) => (
                      <tr key={`table-${item.monthKey}`} className="border-b border-slate-100">
                        <td className="py-1.5 px-2">{item.label}</td>
                        <td className="py-1.5 px-2 font-semibold">{item.containers}</td>
                        <td className="py-1.5 px-2">{item.pet}</td>
                        <td className="py-1.5 px-2">{item.aluminio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}
      </section>

      {/* Seção 8: DISTRIBUIÇÃO POR MATERIAL */}
      <section
        aria-labelledby="materials-distribution-heading"
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="border-b border-slate-100 pb-3">
          <h2 id="materials-distribution-heading" className="text-lg font-bold text-slate-900">
            Materiais reciclados
          </h2>
          <p className="text-xs text-slate-500">
            Proporção e contagem de cada tipo de material reciclado no período.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* Barra de Proporção Empilhada com Rótulos Visíveis */}
          <div
            className="h-7 w-full overflow-hidden rounded-full bg-slate-100 flex p-1 shadow-inner"
            role="progressbar"
            aria-valuenow={petPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Distribuição de materiais: ${petPercentage}% PET e ${aluPercentage}% Alumínio`}
          >
            {petPercentage > 0 && (
              <div
                style={{ width: `${petPercentage}%` }}
                className="h-full rounded-l-full bg-blue-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`PET: ${petPercentage}%`}
              >
                {petPercentage >= 15 ? `${petPercentage}%` : ''}
              </div>
            )}
            {aluPercentage > 0 && (
              <div
                style={{ width: `${aluPercentage}%` }}
                className="h-full rounded-r-full bg-amber-500 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`Alumínio: ${aluPercentage}%`}
              >
                {aluPercentage >= 15 ? `${aluPercentage}%` : ''}
              </div>
            )}
          </div>

          {/* Cards Detalhados dos Materiais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            {/* Bloco PET */}
            <div
              id="distribution-pet-card"
              className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-black text-slate-900">
                    PET
                  </span>
                  <span className="block text-xs text-slate-600">
                    Garrafas PET 2 L ({petPercentage}%)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-blue-950">
                  {formatNumberPtBR(currentMaterials.pet)}
                </span>
                <span className="block text-[11px] font-medium text-slate-500">unidades</span>
              </div>
            </div>

            {/* Bloco Alumínio */}
            <div
              id="distribution-aluminio-card"
              className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-black text-slate-900">
                    Alumínio
                  </span>
                  <span className="block text-xs text-slate-600">
                    Latas de alumínio ({aluPercentage}%)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-amber-950">
                  {formatNumberPtBR(currentMaterials.aluminio)}
                </span>
                <span className="block text-[11px] font-medium text-slate-500">unidades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 9: EVOLUÇÃO DO IMPACTO (CO2e POR MÊS) */}
      <section
        aria-labelledby="co2-evolution-heading"
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="co2-evolution-heading" className="text-lg font-bold text-slate-900">
              Impacto ambiental estimado
            </h2>
            <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 border border-teal-200/60">
              Valores estimados.
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Evolução mensal estimada de quilogramas de CO₂e evitados com base nos fatores centrais de reciclagem.
          </p>
        </div>

        {monthlyData.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Nenhum dado de impacto disponível para o período.
          </div>
        ) : (
          <div className="mt-6">
            <div
              className="flex h-60 sm:h-72 items-end justify-around gap-2 sm:gap-4 border-b border-slate-200 px-2 pb-2"
              role="region"
              aria-label="Gráfico da evolução mensal do impacto ambiental estimado em kg de CO2e"
            >
              {monthlyData.map((item) => {
                const heightPercent = Math.max(12, Math.round((item.co2e / maxCO2e) * 100));

                return (
                  <div
                    key={`bar-co2-${item.monthKey}`}
                    className="flex flex-1 flex-col items-center justify-end h-full group"
                  >
                    {/* Valor numérico visível em kg */}
                    <span
                      className="mb-1.5 text-xs sm:text-sm font-black text-teal-900 group-hover:text-teal-700 transition"
                      aria-hidden="true"
                    >
                      {formatNumberPtBR(item.co2e, 1)} kg
                    </span>

                    {/* Barra visual proporcional */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[56px] rounded-t-xl bg-teal-600 transition-all duration-300 group-hover:bg-teal-700 shadow-2xs"
                      role="img"
                      aria-label={`${item.label}: ≈ ${formatNumberPtBR(item.co2e, 1)} kg de CO2e evitados`}
                    />

                    {/* Eixo horizontal: rótulo do mês */}
                    <span className="mt-2 text-xs font-bold text-slate-700">
                      {item.shortLabel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.year}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Eixo horizontal: mês</span>
              <span>Eixo vertical: kg CO₂e evitado estimado</span>
            </div>
          </div>
        )}
      </section>

      {/* AVISO MANDATÓRIO */}
      <div
        role="note"
        aria-label="Nota de estimativa ambiental"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed"
      >
        <p className="font-medium text-slate-700">
          {environmentalFactors.disclaimer}
        </p>
      </div>
    </div>
  );
};
