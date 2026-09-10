import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  PackageCheck,
  Leaf,
  Calculator,
  Gift,
  ArrowRight,
  Award,
  Sparkles,
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
    badges,
  } = useEco();

  // Últimas 3 reciclagens
  const recentRecycles = recyclingRecords.slice(0, 3);
  // Conquista recente desbloqueada
  const recentBadge = badges.find((b) => b.unlocked && b.id === 'badge_green_guardian') || badges[0];

  return (
    <div className="space-y-6">
      {/* Banner de Saudação Agradável */}
      <section
        id="welcome-banner"
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-md shadow-emerald-950/10"
        aria-labelledby="welcome-heading"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/60 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-xs border border-emerald-400/20">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Participante Consciente
          </span>
          <h2 id="welcome-heading" className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            Olá, {participant.name.split(' ')[0]} 👋
          </h2>
          <p className="mt-1 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Bem-vinda ao EcoRetorna! Cada embalagem entregue nos postos gera pontos para você e reduz emissões para o meio ambiente.
          </p>

          {/* Atalhos Rápidos no Banner */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/simular"
              id="dash-btn-simulate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-white"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Simular Reciclagem
            </Link>
            <Link
              to="/beneficios"
              id="dash-btn-benefits"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/60 px-4 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-xs border border-emerald-400/30 transition hover:bg-emerald-900/80 focus-visible:outline-2 focus-visible:outline-white"
            >
              <Gift className="h-4 w-4" aria-hidden="true" />
              Ver Benefícios
            </Link>
          </div>
        </div>

        {/* Detalhe de fundo suave */}
        <div
          className="pointer-events-none absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-2xl"
          aria-hidden="true"
        />
      </section>

      {/* Grid de Métricas Principais Resumidas */}
      <section
        id="summary-metrics"
        aria-label="Resumo do participante"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Card Saldo & Reais */}
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Disponível</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatNumberPtBR(pointsBalance)}
                </span>
                <span className="text-sm font-semibold text-slate-600">pontos</span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <Coins className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-medium">Equivalente estimado:</span>
            <span className="font-bold text-emerald-700 text-sm">
              ≈ {formatCurrencyPtBR(reaisEquivalent)}
            </span>
          </div>
        </div>

        {/* Card Embalagens Recicladas */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reciclado</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatNumberPtBR(totalContainers)}
                </span>
                <span className="text-sm font-semibold text-slate-600">embalagens</span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/50">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>{formatNumberPtBR(environmentalImpact.petCount)} PET</span>
            <span>•</span>
            <span>{formatNumberPtBR(environmentalImpact.aluminumCount)} Alumínio</span>
          </div>
        </div>

        {/* Card Impacto CO2e Evitado */}
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-xs transition hover:shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Impacto Ambiental</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-emerald-700">≈</span>
                <span className="text-3xl font-extrabold text-emerald-950">
                  {formatNumberPtBR(environmentalImpact.co2eAvoidedKg, 1)}
                </span>
                <span className="text-sm font-bold text-emerald-800">kg CO₂e</span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-emerald-200/50 pt-3 text-xs">
            <span className="text-emerald-800">Evitados na atmosfera</span>
            <Link
              to="/impacto"
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
            >
              Ver detalhes <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seções em Grid: Últimas Reciclagens e Conquista Recente */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista das Últimas Reciclagens */}
        <section
          id="recent-recycling-section"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2"
          aria-labelledby="recent-recycling-heading"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 id="recent-recycling-heading" className="text-base font-bold text-slate-900">
                Últimas Reciclagens
              </h3>
              <p className="text-xs text-slate-500">Entregas recentes registradas nos postos de coleta</p>
            </div>
            <Link
              to="/historico"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              Ver todo o histórico <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 pt-1">
            {recentRecycles.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      rec.materialCategory === 'pet'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <PackageCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">
                      {rec.materialName}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {new Date(rec.date).toLocaleDateString('pt-BR')} • {rec.collectionPointName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-sm font-bold text-emerald-700">
                    +{rec.pointsEarned} pts
                  </span>
                  <span className="block text-xs text-slate-500">
                    {rec.quantity} unidades
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conquista Recente & Dica */}
        <section
          id="recent-badge-section"
          className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          aria-labelledby="recent-badge-heading"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 id="recent-badge-heading" className="text-base font-bold text-slate-900">
                Conquista Recente
              </h3>
              <Link
                to="/conquistas"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Todas
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-xs">
                <Award className="h-8 w-8" aria-hidden="true" />
              </div>
              <h4 className="mt-2 text-sm font-bold text-slate-900">{recentBadge.title}</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {recentBadge.description}
              </p>
              <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                Desbloqueada
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              to="/conquistas"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Explorar Desafios Sustentáveis
            </Link>
          </div>
        </section>
      </div>

      {/* Nota de Estimativa */}
      <DisclaimerNotice />
    </div>
  );
};
