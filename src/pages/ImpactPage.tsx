import React from 'react';
import {
  TrendingUp,
  Leaf,
  Droplets,
  Zap,
  Trees,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const ImpactPage: React.FC = () => {
  const { totalContainers, petCount, aluminumCount, environmentalImpact } = useEco();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Motivacional */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          Sustentabilidade & Meio Ambiente
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Meu Impacto Ambiental
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Acompanhe os benefícios reais que o descarte correto das suas embalagens proporciona para a conservação dos recursos naturais.
        </p>
      </div>

      {/* Hero Card Inspirador */}
      <section
        id="impact-hero"
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-teal-800 to-emerald-900 p-6 sm:p-10 text-white shadow-md"
        aria-labelledby="impact-hero-title"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 px-3.5 py-1 text-xs font-bold text-emerald-100 backdrop-blur-xs border border-emerald-400/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            Compromisso Sustentável
          </span>

          <h3 id="impact-hero-title" className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Você já ajudou a dar um novo destino a{' '}
            <span className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-4">
              {formatNumberPtBR(totalContainers)} embalagens
            </span>
            .
          </h3>

          <div className="mt-6 flex flex-wrap items-baseline gap-2 rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur-xs border border-white/10">
            <span className="text-lg sm:text-xl font-medium text-emerald-200">≈</span>
            <span className="text-4xl sm:text-5xl font-black text-white">
              {formatNumberPtBR(environmentalImpact.co2eAvoidedKg, 1)}
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-200">
              kg de CO₂e evitados
            </span>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Esse volume de dióxido de carbono equivalente deixou de ser emitido no ciclo produtivo primário graças à sua participação ativa na reciclagem.
          </p>
        </div>

        {/* Círculos de luz de fundo */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl"
          aria-hidden="true"
        />
      </section>

      {/* Grid de Materiais Reciclados */}
      <section aria-labelledby="materials-impact-heading" className="space-y-3">
        <h3 id="materials-impact-heading" className="text-base sm:text-lg font-bold text-slate-900">
          Distribuição de Embalagens Recicladas
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card PET */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                  Polímero Reciclado
                </span>
                <h4 className="mt-2 text-xl font-black text-slate-900">
                  {formatNumberPtBR(petCount)} Garrafas PET 2L
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Redução de petróleo virgem e reaproveitamento de resina termoplástica.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <PackageCheck className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600 flex justify-between">
              <span>Estimativa de CO₂e evitado:</span>
              <span className="font-bold text-slate-900">
                ≈ {formatNumberPtBR(petCount * 0.18, 1)} kg
              </span>
            </div>
          </div>

          {/* Card Alumínio */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  Metal Infinitamente Reciclável
                </span>
                <h4 className="mt-2 text-xl font-black text-slate-900">
                  {formatNumberPtBR(aluminumCount)} Latas de Alumínio
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Economia de até 95% de energia em comparação com a extração de bauxita.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600 flex justify-between">
              <span>Estimativa de CO₂e evitado:</span>
              <span className="font-bold text-slate-900">
                ≈ {formatNumberPtBR(aluminumCount * 0.22, 1)} kg
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Indicadores Ambientais Complementares */}
      <section aria-labelledby="resources-impact-heading" className="space-y-3">
        <h3 id="resources-impact-heading" className="text-base sm:text-lg font-bold text-slate-900">
          Preservação Estimada de Recursos Naturais
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Água */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Droplets className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Água Poupada</span>
                <div className="text-2xl font-black text-slate-900">
                  ≈ {formatNumberPtBR(environmentalImpact.waterSavedLiters, 0)} L
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Volume equivalente de água conservado nas cadeias de lavagem e resfriamento industrial.
            </p>
          </div>

          {/* Energia */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Energia Elétrica</span>
                <div className="text-2xl font-black text-slate-900">
                  ≈ {formatNumberPtBR(environmentalImpact.energySavedKwh, 1)} kWh
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Energia poupada pelo processo de fundição de sucata e reprocessamento mecânico.
            </p>
          </div>

          {/* Árvores equivalentes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Trees className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Equivalência Arbórea</span>
                <div className="text-2xl font-black text-slate-900">
                  ≈ {formatNumberPtBR(environmentalImpact.equivalentTreesPlanted, 1)} árvores
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Estimativa de absorção anual de carbono correspondente ao CO₂e evitado.
            </p>
          </div>
        </div>
      </section>

      {/* AVISO LEGAL CLARO - NADA DE CRÉDITOS DE CARBONO OU COMPENSAÇÃO OFICIAL */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Leaf className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          Nota sobre os Indicadores Ambientais
        </div>
        <p className="leading-relaxed">
          *Os valores ambientais são estimativas baseadas no tipo e na quantidade de materiais reciclados informados.
          Esta plataforma acadêmica e demonstrativa <strong>não emite créditos de carbono</strong>, <strong>não constitui certificação regulatória</strong> e <strong>não opera como mecanismo oficial de compensação ambiental</strong>.
        </p>
      </div>
    </div>
  );
};
