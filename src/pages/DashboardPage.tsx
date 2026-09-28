import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  PackageCheck,
  Leaf,
  Calculator,
  History,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const DashboardPage: React.FC = () => {
  const {
    participant,
    pointsBalance,
    reaisEquivalent,
    totalContainers,
    environmentalImpact,
    recyclingRecords,
    campaigns,
  } = useEco();

  // Últimas reciclagens realizadas (ex: as 3 mais recentes)
  const recentRecycles = recyclingRecords.slice(0, 3);

  // Primeiro nome para a saudação
  const firstName = participant.name ? participant.name.split(' ')[0] : 'Participante';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Saudação no Topo */}
      <section
        id="welcome-section"
        className="rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-md shadow-emerald-950/10"
        aria-labelledby="welcome-heading"
      >
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/60 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-xs border border-emerald-400/20">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            EcoRetorna • Reciclagem Cidadã
          </span>

          <h1 id="welcome-heading" className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            Olá, {participant.name || 'Participante'} 👋
          </h1>

          <p className="mt-1.5 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Acompanhe aqui o saldo gerado pelas suas entregas em pontos de coleta e simule o valor de novas embalagens.
          </p>

          {/* Acessos Rápidos Obrigatórios: Simular e Histórico */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/simular"
              id="dash-quick-simulate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-white"
            >
              <Calculator className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              Simular Reciclagem
            </Link>

            <Link
              to="/historico"
              id="dash-quick-history"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/60 px-4 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-xs border border-emerald-400/30 transition hover:bg-emerald-900/80 focus-visible:outline-2 focus-visible:outline-white"
            >
              <History className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              Acessar Histórico
            </Link>
          </div>
        </div>
      </section>

      {/* Campanhas Promocionais Ativas (exibido apenas quando houver campanhas vigentes) */}
      {campaigns.length > 0 && (
        <section
          id="active-campaigns-section"
          aria-label="Campanhas promocionais ativas"
          className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 via-orange-50/40 to-amber-50/80 p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                  Campanha Promocional
                </span>
                <span className="text-xs font-semibold text-amber-800">
                  {campaigns.length === 1 ? '1 campanha ativa' : `${campaigns.length} campanhas ativas`}
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-white/90 p-3.5 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Tag className="h-3.5 w-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                        <span>{camp.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-amber-100/60 pt-2 text-[11px] font-semibold text-amber-900">
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200/60 font-bold">
                        {camp.type === 'multiplier'
                          ? `${camp.multiplier}x Pontos`
                          : `+${camp.bonusPoints} pts a cada ${camp.minimumQuantity} un`}
                      </span>
                      <Link
                        to="/simular"
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        Simular <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cards de Métricas Principais */}
      <section
        id="dashboard-metrics"
        aria-label="Resumo do saldo e total reciclado"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* CARD PRINCIPAL: SALDO CALCULADO */}
        <div
          id="card-saldo-principal"
          className="flex flex-col justify-between rounded-2xl border-2 border-emerald-500/30 bg-white p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saldo
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {formatNumberPtBR(pointsBalance)}
                </span>
                <span className="text-base font-bold text-slate-600">pontos</span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <Coins className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <span className="block text-xs font-medium text-slate-500">Equivalência financeira estimada:</span>
            <span className="text-lg font-extrabold text-emerald-700">
              ≈ {formatCurrencyPtBR(reaisEquivalent)}
            </span>
          </div>
        </div>

        {/* TOTAL DE EMBALAGENS RECICLADAS */}
        <div
          id="card-total-reciclado"
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Reciclado
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {formatNumberPtBR(totalContainers)}
                </span>
                <span className="text-base font-bold text-slate-600">embalagens</span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/50">
              <PackageCheck className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
            <span>{environmentalImpact.petCount} garrafas PET</span>
            <span>•</span>
            <span>{environmentalImpact.aluminumCount} latas alumínio</span>
          </div>
        </div>

        {/* IMPACTO AMBIENTAL (PLACEHOLDER ESTIMATIVO) */}
        <div
          id="card-impacto-placeholder"
          className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 sm:p-6 shadow-xs sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Impacto Ambiental
                </span>
                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Estimativa
                </span>
              </div>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-base font-medium text-emerald-700">≈</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-950">
                  {formatNumberPtBR(environmentalImpact.co2eAvoidedKg, 1)}
                </span>
                <span className="text-base font-bold text-emerald-800">kg CO₂e</span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <Leaf className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-emerald-200/50 pt-3 text-xs text-emerald-800 font-medium">
            <span>Evitados na atmosfera</span>
            <Link
              to="/impacto"
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900"
            >
              Ver detalhes <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção: Últimas Reciclagens */}
      <section
        id="recent-recyclings-section"
        aria-labelledby="recent-recyclings-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 id="recent-recyclings-heading" className="text-lg font-bold text-slate-900">
              Últimas reciclagens
            </h2>
            <p className="text-xs text-slate-500">
              Registros mais recentes de embalagens entregues
            </p>
          </div>

          <Link
            to="/historico"
            id="dash-link-all-history"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            Ver histórico completo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {recentRecycles.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <PackageCheck className="mx-auto h-10 w-10 text-slate-300 mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-700">Você ainda não possui reciclagens registradas.</p>
            <p className="text-xs text-slate-500 mt-1">Entregue suas embalagens em um ecoponto parceiro para começar a pontuar!</p>
            <div className="mt-4">
              <Link
                to="/postos"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
              >
                Encontrar ecopontos parceiros
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 pt-1">
            {recentRecycles.map((rec) => {
              const isPet = rec.materialCategory === 'pet';
              const materialDisplay = isPet ? 'PET 2 L' : 'Lata de alumínio';
              const [year, month, day] = rec.date.split('-');
              const displayDate = year && month && day ? `${day}/${month}/${year}` : rec.date;

              return (
                <div key={rec.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isPet ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <PackageCheck className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{materialDisplay}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{displayDate}</span>
                      </div>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        {rec.quantity} {rec.quantity === 1 ? 'unidade' : 'unidades'} • {rec.collectionPointName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm sm:text-base font-extrabold text-emerald-700">
                      +{rec.pointsEarned} pontos
                    </span>
                    <span className="block text-xs font-medium text-slate-500">
                      ≈ {formatCurrencyPtBR(rec.reaisEquivalent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Nota Legal e Educativa */}
      <DisclaimerNotice />
    </div>
  );
};
