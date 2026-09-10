import React, { useState } from 'react';
import {
  Calculator,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Coins,
  Package,
  Plus,
  Minus,
} from 'lucide-react';
import { calculatePoints, pointsToReais, formatCurrencyPtBR, formatNumberPtBR, STANDARD_MATERIALS } from '../utils/scoring';
import { environmentalFactors } from '../utils/environmental';

export const SimulatePage: React.FC = () => {
  // Quantidades locais da simulação (puramente efêmeras)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    pet_2l: 10,
    lata_aluminio: 6,
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleInputChange = (id: string, valueStr: string) => {
    const val = parseInt(valueStr, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(val) || val < 0 ? 0 : val,
    }));
  };

  const handleReset = () => {
    setQuantities({
      pet_2l: 0,
      lata_aluminio: 0,
    });
  };

  // Cálculos centrais
  const petQty = quantities['pet_2l'] || 0;
  const aluQty = quantities['lata_aluminio'] || 0;

  const petPoints = calculatePoints(petQty, 2);
  const aluPoints = calculatePoints(aluQty, 2);

  const totalContainers = petQty + aluQty;
  const totalPoints = petPoints + aluPoints;
  const totalReais = pointsToReais(totalPoints);

  // Estimativa ambiental da simulação
  const simulatedCo2e = Number(
    (petQty * environmentalFactors.co2eKg.pet + aluQty * environmentalFactors.co2eKg.aluminio).toFixed(1)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho de Introdução */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          Calculadora Educativa
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Simular sua reciclagem
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Descubra quantos pontos e qual valor equivalente suas embalagens recicláveis gerariam nos pontos de coleta do EcoRetorna.
        </p>
      </div>

      {/* AVISO MANDATÓRIO EM DESTAQUE */}
      <div
        role="alert"
        className="flex items-start gap-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5 text-amber-900 shadow-xs"
      >
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="font-bold text-sm sm:text-base text-amber-950">
            Atenção: Modo Simulação
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-amber-800 leading-relaxed">
            Esta é apenas uma simulação. Nenhum ponto será adicionado ao seu saldo e nenhum registro será criado no histórico.
          </p>
        </div>
      </div>

      {/* Seção de Seleção de Embalagens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STANDARD_MATERIALS.map((mat) => {
          const count = quantities[mat.id] || 0;
          const isPet = mat.category === 'pet';

          return (
            <div
              key={mat.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isPet ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isPet ? 'Plástico PET' : 'Metal / Alumínio'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {mat.pointsPerUnit} pontos / {mat.unit}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900">{mat.name}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{mat.description}</p>
              </div>

              {/* Controles de Quantidade */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-600">Quantidade:</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(mat.id, -1)}
                    disabled={count <= 0}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-emerald-600"
                    aria-label={`Diminuir quantidade de ${mat.name}`}
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
                    aria-label={`Quantidade de ${mat.name}`}
                  />

                  <button
                    type="button"
                    onClick={() => updateQuantity(mat.id, 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
                    aria-label={`Aumentar quantidade de ${mat.name}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card de Resultado da Simulação */}
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50/50 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 className="text-base sm:text-lg">Resultado da Simulação</h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-white/60 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
            aria-label="Zerar campos da simulação"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Zerar
          </button>
        </div>

        {/* Três Métricas Centrais */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Embalagens */}
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Package className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase">Embalagens</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatNumberPtBR(totalContainers)}
            </span>
            <span className="block text-[11px] text-slate-500">itens simulados</span>
          </div>

          {/* Pontos */}
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase">Pontos</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {formatNumberPtBR(totalPoints)}
            </span>
            <span className="block text-[11px] text-emerald-600">pontos potenciais</span>
          </div>

          {/* Valor Equivalente */}
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Coins className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-2 block text-xs font-bold text-slate-500 uppercase">Equivalência</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrencyPtBR(totalReais)}
            </span>
            <span className="block text-[11px] text-slate-500">1 ponto = R$ 0,125</span>
          </div>
        </div>

        {/* Estimativa adicional */}
        <div className="mt-4 rounded-xl bg-white/70 p-3 text-center text-xs text-emerald-800">
          Impacto ambiental estimado se recicladas: <strong>≈ {formatNumberPtBR(simulatedCo2e, 1)} kg de CO₂e evitados</strong>.
        </div>
      </div>
    </div>
  );
};
