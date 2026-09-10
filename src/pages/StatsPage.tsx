import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  PackageCheck,
  Leaf,
  Layers,
  Lock,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const StatsPage: React.FC = () => {
  const { recyclingRecords, totalContainers, petCount, aluminumCount, environmentalImpact } = useEco();

  // Filtro de visualização (6 meses ou todos)
  const [activeMetric, setActiveMetric] = useState<'embalagens' | 'co2e'>('embalagens');

  // Cálculo agrupado por mês a partir dos registros reais
  const monthlyData = useMemo(() => {
    // Mapeamento dos meses (Setembro 2026 até Abril 2026)
    const monthsMap: Record<
      string,
      { label: string; monthOrder: string; pet: number; alu: number; containers: number; co2e: number }
    > = {
      '2026-04': { label: 'Abr/26', monthOrder: '2026-04', pet: 0, alu: 0, containers: 0, co2e: 0 },
      '2026-05': { label: 'Mai/26', monthOrder: '2026-05', pet: 0, alu: 0, containers: 0, co2e: 0 },
      '2026-06': { label: 'Jun/26', monthOrder: '2026-06', pet: 0, alu: 0, containers: 0, co2e: 0 },
      '2026-07': { label: 'Jul/26', monthOrder: '2026-07', pet: 0, alu: 0, containers: 0, co2e: 0 },
      '2026-08': { label: 'Ago/26', monthOrder: '2026-08', pet: 0, alu: 0, containers: 0, co2e: 0 },
      '2026-09': { label: 'Set/26', monthOrder: '2026-09', pet: 0, alu: 0, containers: 0, co2e: 0 },
    };

    recyclingRecords.forEach((r) => {
      const ym = r.date.substring(0, 7);
      if (!monthsMap[ym]) {
        monthsMap[ym] = {
          label: ym,
          monthOrder: ym,
          pet: 0,
          alu: 0,
          containers: 0,
          co2e: 0,
        };
      }
      monthsMap[ym].containers += r.quantity;
      monthsMap[ym].co2e += r.co2eAvoidedKg;
      if (r.materialCategory === 'pet') monthsMap[ym].pet += r.quantity;
      if (r.materialCategory === 'aluminio') monthsMap[ym].alu += r.quantity;
    });

    return Object.values(monthsMap).sort((a, b) => a.monthOrder.localeCompare(b.monthOrder));
  }, [recyclingRecords]);

  // Comparação exata: Mês Atual (Setembro 2026) vs Mês Anterior (Agosto 2026)
  const currentMonthData = monthlyData.find((m) => m.monthOrder === '2026-09') || {
    containers: 34,
    co2e: 7.2,
  };
  const prevMonthData = monthlyData.find((m) => m.monthOrder === '2026-08') || {
    containers: 29,
    co2e: 6.3,
  };

  const percentChange = prevMonthData.containers > 0
    ? Math.round(((currentMonthData.containers - prevMonthData.containers) / prevMonthData.containers) * 100)
    : 0;

  // Altura máxima para gráficos
  const maxContainers = Math.max(...monthlyData.map((d) => d.containers), 45);
  const maxCo2e = Math.max(...monthlyData.map((d) => d.co2e), 10);

  const petPercentage = totalContainers > 0 ? Math.round((petCount / totalContainers) * 100) : 0;
  const aluPercentage = totalContainers > 0 ? 100 - petPercentage : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header com indicador de privacidade */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Dados Analíticos
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
            Minhas Estatísticas
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Acompanhamento detalhado da sua jornada de reciclagem ao longo dos meses.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>Painel Privado e Pessoal</span>
        </div>
      </div>

      {/* Cartão de Destaque: Comparativo Mês Atual vs Mês Anterior */}
      <section
        aria-labelledby="month-comparison-heading"
        className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-teal-50/40 to-white p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Desempenho no Mês Atual (Setembro)
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            +{percentChange}% vs mês anterior
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Embalagens no Mês */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs">
            <span className="block text-xs font-semibold text-slate-500">Embalagens Entregues</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">
                {currentMonthData.containers}
              </span>
              <span className="text-xs font-bold text-slate-600">embalagens</span>
            </div>
            <span className="mt-1 block text-[11px] text-slate-400">
              Mês anterior: {prevMonthData.containers} embalagens
            </span>
          </div>

          {/* CO2e no Mês */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs">
            <span className="block text-xs font-semibold text-slate-500">CO₂e Evitado no Mês</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-sm font-medium text-emerald-700">≈</span>
              <span className="text-3xl font-black text-emerald-700">
                {formatNumberPtBR(currentMonthData.co2e, 1)}
              </span>
              <span className="text-xs font-bold text-emerald-700">kg</span>
            </div>
            <span className="mt-1 block text-[11px] text-slate-400">
              Impacto direto em Setembro
            </span>
          </div>

          {/* Evolução percentual */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs">
            <span className="block text-xs font-semibold text-slate-500">Tendência Mensal</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-700">
                +{percentChange}%
              </span>
            </div>
            <span className="mt-1 block text-[11px] text-emerald-700 font-medium">
              Crescimento contínuo de entregas
            </span>
          </div>
        </div>
      </section>

      {/* Gráfico 1: Evolução Mensal */}
      <section
        aria-labelledby="monthly-evolution-heading"
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 id="monthly-evolution-heading" className="text-lg font-bold text-slate-900">
              Evolução Histórica Mensal
            </h3>
            <p className="text-xs text-slate-500">
              Distribuição de reciclagens e emissões evitadas nos últimos 6 meses
            </p>
          </div>

          {/* Seletor de Métrica */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMetric('embalagens')}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeMetric === 'embalagens'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              } focus-visible:outline-2 focus-visible:outline-emerald-600`}
            >
              Embalagens (un)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('co2e')}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeMetric === 'co2e'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              } focus-visible:outline-2 focus-visible:outline-emerald-600`}
            >
              CO₂e Evitado (kg)
            </button>
          </div>
        </div>

        {/* Gráfico de Barras Responsivo */}
        <div className="mt-6">
          <div className="flex h-56 sm:h-64 items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 px-2 pb-2">
            {monthlyData.map((item) => {
              const value = activeMetric === 'embalagens' ? item.containers : item.co2e;
              const max = activeMetric === 'embalagens' ? maxContainers : maxCo2e;
              const heightPercent = Math.max(12, Math.round((value / max) * 100));

              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip / Valor acima da barra */}
                  <span className="text-[11px] font-bold text-slate-700 transition group-hover:text-emerald-700">
                    {activeMetric === 'embalagens' ? value : formatNumberPtBR(value, 1)}
                    {activeMetric === 'co2e' ? 'k' : ''}
                  </span>

                  {/* Barra visual */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                      item.monthOrder === '2026-09'
                        ? 'bg-emerald-600 shadow-sm shadow-emerald-600/30'
                        : 'bg-emerald-200/80 hover:bg-emerald-300'
                    }`}
                    role="img"
                    aria-label={`${item.label}: ${value} ${activeMetric === 'embalagens' ? 'embalagens' : 'kg CO2e'}`}
                  />

                  {/* Label do Mês */}
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Abril de 2026</span>
            <span>Setembro de 2026 (Mês Atual em destaque)</span>
          </div>
        </div>
      </section>

      {/* Gráfico 2: Composição por Tipo de Material */}
      <section
        aria-labelledby="material-composition-heading"
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="border-b border-slate-100 pb-3">
          <h3 id="material-composition-heading" className="text-lg font-bold text-slate-900">
            Distribuição por Material
          </h3>
          <p className="text-xs text-slate-500">
            Proporção acumulada de cada material entregue nas estações de reciclagem
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* Barra de Proporção Empilhada */}
          <div className="h-6 w-full overflow-hidden rounded-full bg-slate-100 flex p-0.5" role="progressbar" aria-valuenow={petPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div
              style={{ width: `${petPercentage}%` }}
              className="h-full rounded-l-full bg-blue-600 transition-all"
              title={`PET: ${petPercentage}%`}
            />
            <div
              style={{ width: `${aluPercentage}%` }}
              className="h-full rounded-r-full bg-amber-500 transition-all"
              title={`Alumínio: ${aluPercentage}%`}
            />
          </div>

          {/* Legenda Detalhada dos Materiais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            {/* Bloco PET */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-blue-50/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-blue-600" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-bold text-slate-800">Garrafas PET 2L</span>
                  <span className="block text-xs text-slate-500">{petPercentage}% do volume total</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-lg font-black text-blue-950">
                  {formatNumberPtBR(petCount)}
                </span>
                <span className="block text-[11px] text-slate-500">unidades</span>
              </div>
            </div>

            {/* Bloco Alumínio */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-amber-50/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-amber-500" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-bold text-slate-800">Latas de Alumínio</span>
                  <span className="block text-xs text-slate-500">{aluPercentage}% do volume total</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-lg font-black text-amber-950">
                  {formatNumberPtBR(aluminumCount)}
                </span>
                <span className="block text-[11px] text-slate-500">unidades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nota Obrigatória de Estimativa */}
      <DisclaimerNotice />
    </div>
  );
};
