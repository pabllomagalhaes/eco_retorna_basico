import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  BarChart3,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import {
  calculateTotalContainers,
  calculateTotalByMaterial,
  calculateEstimatedCO2,
  environmentalFactors,
} from '../utils/environmental';
import { formatNumberPtBR } from '../utils/scoring';

export const ImpactPage: React.FC = () => {
  const { recyclingRecords } = useEco();

  // Cálculos dinâmicos derivados diretamente da lista de registros
  const totalContainers = calculateTotalContainers(recyclingRecords);
  const { pet, aluminio } = calculateTotalByMaterial(recyclingRecords);
  const co2eAvoided = calculateEstimatedCO2(recyclingRecords);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Leaf className="h-4 w-4" aria-hidden="true" />
          Sustentabilidade & Meio Ambiente
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Meu Impacto
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Acompanhe como as suas entregas de recicláveis ajudam a preservar os recursos do nosso planeta.
        </p>
      </div>

      {/* Hero Card Visual e Motivacional */}
      <section
        id="impact-hero-card"
        aria-labelledby="impact-hero-heading"
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-10 text-white shadow-md shadow-emerald-950/10"
      >
        <div className="relative z-10 max-w-2xl">
          {/* Mensagem motivacional curta */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/70 px-3.5 py-1 text-xs font-bold text-emerald-100 backdrop-blur-xs border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-200" aria-hidden="true" />
            <span>Cada embalagem conta.</span>
          </div>

          <h2
            id="impact-hero-heading"
            className="mt-4 text-xl sm:text-2xl font-bold text-emerald-100"
          >
            Você já reciclou
          </h2>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              {formatNumberPtBR(totalContainers)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-200">
              embalagens
            </span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
            Sua atitude cidadã garante que resíduos nobres retornem para a cadeia produtiva, reduzindo o consumo de energia e a extração de recursos naturais.
          </p>
        </div>

        {/* Efeito decorativo sutil de fundo */}
        <div
          className="pointer-events-none absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
          aria-hidden="true"
        />
      </section>

      {/* Grid de Materiais Reciclados */}
      <section
        id="impact-materials-section"
        aria-label="Detalhamento por material reciclado"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Card PET */}
        <div
          id="impact-card-pet"
          className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:border-blue-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                PET
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                {formatNumberPtBR(pet)} <span className="text-base font-semibold text-slate-600">unidades</span>
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Garrafas PET 2 L entregues nos pontos parceiros
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PackageCheck className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span>Fator estimado: </span>
            <strong className="text-slate-800">0,18 kg CO₂e evitado por garrafa</strong>
          </div>
        </div>

        {/* Card Alumínio */}
        <div
          id="impact-card-aluminio"
          className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:border-amber-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                Alumínio
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                {formatNumberPtBR(aluminio)} <span className="text-base font-semibold text-slate-600">unidades</span>
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Latas de alumínio encaminhadas à reciclagem
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span>Fator estimado: </span>
            <strong className="text-slate-800">0,22 kg CO₂e evitado por lata</strong>
          </div>
        </div>
      </section>

      {/* Card de Impacto Ambiental Estimado */}
      <section
        id="impact-co2-card"
        aria-labelledby="impact-co2-heading"
        className="rounded-3xl border-2 border-emerald-500/40 bg-linear-to-br from-emerald-50 via-teal-50/40 to-emerald-100/30 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Impacto ambiental estimado
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-medium text-emerald-700">≈</span>
              <span className="text-3xl sm:text-5xl font-black text-emerald-950">
                {formatNumberPtBR(co2eAvoided, 1)}
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-emerald-800">
                kg de CO₂e evitados
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-emerald-900/80 leading-relaxed max-w-xl">
              Equivalente à quantidade estimada de gases causadores do efeito estufa que deixaram de ser emitidos na produção primária destes materiais.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20 self-start sm:self-center">
            <Leaf className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>

        {/* Link motivacional para Estatísticas */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200/70 pt-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 font-medium">
            <HeartHandshake className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Obrigada por fazer sua parte na economia circular!</span>
          </div>

          <Link
            to="/estatisticas"
            id="impact-link-to-stats"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <BarChart3 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Ver evolução analítica <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* AVISO MANDATÓRIO DE ESTIMATIVA */}
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
