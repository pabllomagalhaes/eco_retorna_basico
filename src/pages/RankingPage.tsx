import React from 'react';
import { Trophy, Medal, Leaf, PackageCheck } from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { RANKING_PARTICIPANTS } from '../data/mockData';
import { formatNumberPtBR } from '../utils/scoring';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const RankingPage: React.FC = () => {
  const { participant, environmentalImpact, totalContainers } = useEco();

  // Garante que os dados da participante Camila no ranking usem os valores em tempo real da mesma fonte
  const updatedRanking = RANKING_PARTICIPANTS.map((item) => {
    if (item.isCurrentUser || item.name.includes(participant.name)) {
      return {
        ...item,
        co2eAvoidedKg: environmentalImpact.co2eAvoidedKg,
        containersCount: totalContainers,
        isCurrentUser: true,
      };
    }
    return item;
  }).sort((a, b) => b.co2eAvoidedKg - a.co2eAvoidedKg);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          Classificação Comunitária
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Ranking de Impacto
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Reconhecimento comunitário baseado exclusivamente na quantidade estimada de emissões de CO₂e evitadas.
        </p>
      </div>

      {/* Card da Posição do Participante Atual */}
      <div className="rounded-3xl border-2 border-emerald-500 bg-linear-to-r from-emerald-800 to-teal-800 p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-800 font-black text-xl shadow-xs">
              1º
            </div>
            <div>
              <span className="inline-block rounded-full bg-emerald-600/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100 border border-emerald-400/30">
                Sua Posição Atual
              </span>
              <h3 className="text-xl font-bold text-white">{participant.name}</h3>
              <p className="text-xs text-emerald-200">
                Liderança no ranking sustentável do EcoRetorna
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t border-emerald-700/60 pt-3 sm:border-t-0 sm:pt-0">
            <div>
              <span className="block text-[11px] font-semibold text-emerald-300 uppercase">Impacto Evitado</span>
              <div className="text-2xl font-black text-white">
                ≈ {formatNumberPtBR(environmentalImpact.co2eAvoidedKg, 1)} kg
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-emerald-300 uppercase">Embalagens</span>
              <div className="text-2xl font-black text-white">
                {formatNumberPtBR(totalContainers)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela / Lista do Ranking */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Membros Mais Ativos por CO₂e Evitado
        </h3>

        <div className="divide-y divide-slate-100" role="list" aria-label="Lista do ranking de impacto">
          {updatedRanking.map((person, index) => {
            const pos = index + 1;
            const isTop3 = pos <= 3;

            return (
              <div
                key={person.id}
                className={`flex items-center justify-between py-4 px-2 rounded-xl transition ${
                  person.isCurrentUser ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                }`}
                role="listitem"
              >
                <div className="flex items-center gap-3.5">
                  {/* Badge de Posição */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                      pos === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : pos === 2
                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : pos === 3
                        ? 'bg-amber-800/10 text-amber-900 border border-amber-600/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isTop3 ? (
                      <span className="flex items-center gap-0.5">
                        <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                        {pos}º
                      </span>
                    ) : (
                      `${pos}º`
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{person.name}</span>
                      {person.isCurrentUser && (
                        <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                          Você
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{person.containersCount} embalagens entregues</span>
                    </div>
                  </div>
                </div>

                {/* Impacto CO2e (EXCLUSIVAMENTE CO2e, NENHUM PONTO OU VALOR EM REAIS) */}
                <div className="text-right">
                  <span className="flex items-center justify-end gap-1 text-sm sm:text-base font-black text-emerald-800">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    ≈ {formatNumberPtBR(person.co2eAvoidedKg, 1)} kg
                  </span>
                  <span className="block text-[11px] text-slate-500 font-medium">
                    CO₂e evitados
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nota Obrigatória de Estimativa */}
      <DisclaimerNotice customText="*Os valores apresentados são estimativas baseadas nos registros de reciclagem." />
    </div>
  );
};
