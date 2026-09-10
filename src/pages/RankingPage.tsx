import React, { useMemo } from 'react';
import { Trophy, Medal, Leaf, PackageCheck, HeartHandshake, User } from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { COMMUNITY_PARTICIPANTS_RAW } from '../data/mockData';
import {
  calculateTotalContainers,
  calculateEstimatedCO2,
  calculateEstimatedCO2FromCounts,
} from '../utils/environmental';
import { formatNumberPtBR } from '../utils/scoring';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const RankingPage: React.FC = () => {
  const { participant, recyclingRecords } = useEco();

  // Calcula valores reais e dinâmicos para Camila Ribeiro a partir da mesma fonte de registros
  const userContainers = useMemo(
    () => calculateTotalContainers(recyclingRecords),
    [recyclingRecords]
  );

  const userCO2e = useMemo(
    () => calculateEstimatedCO2(recyclingRecords),
    [recyclingRecords]
  );

  // Constrói e ordena o ranking completo exclusivamente por CO₂e evitado estimado
  const fullRanking = useMemo(() => {
    const communityList = COMMUNITY_PARTICIPANTS_RAW.map((cp) => ({
      id: cp.id,
      name: cp.name,
      containersCount: cp.petCount + cp.aluminumCount,
      co2eAvoidedKg: calculateEstimatedCO2FromCounts(cp.petCount, cp.aluminumCount),
      isCurrentUser: false,
    }));

    const userEntry = {
      id: participant.id || 'usr_camila_01',
      name: participant.name || 'Camila Ribeiro',
      containersCount: userContainers,
      co2eAvoidedKg: userCO2e,
      isCurrentUser: true,
    };

    const combined = [userEntry, ...communityList];

    // Ordenação estritamente do maior para o menor CO₂e evitado estimado
    combined.sort((a, b) => {
      if (b.co2eAvoidedKg !== a.co2eAvoidedKg) {
        return b.co2eAvoidedKg - a.co2eAvoidedKg;
      }
      return b.containersCount - a.containersCount;
    });

    return combined.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }, [participant.id, participant.name, userContainers, userCO2e]);

  // Identificação da posição do participante atual
  const currentUserItem = fullRanking.find((item) => item.isCurrentUser) || {
    position: 1,
    name: participant.name,
    containersCount: userContainers,
    co2eAvoidedKg: userCO2e,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          Reconhecimento Comunitário
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Ranking de Impacto
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Classificação baseada exclusivamente na estimativa de CO₂e evitado com a reciclagem de embalagens.
        </p>
      </div>

      {/* Mensagem Positiva de Engajamento */}
      <div
        id="banner-mensagem-positiva"
        className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
          <HeartHandshake className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-950">
            O impacto cresce quando todo mundo participa.
          </h3>
          <p className="mt-0.5 text-xs text-emerald-800/90 leading-relaxed">
            Cada embalagem entregue no EcoRetorna contribui diretamente para a redução do impacto ambiental da nossa cidade.
          </p>
        </div>
      </div>

      {/* Card em Destaque: Posição do Participante Atual */}
      <section
        id="card-posicao-participante"
        aria-label="Sua posição atual no ranking de impacto"
        className="rounded-3xl border-2 border-emerald-500 bg-linear-to-r from-emerald-800 to-teal-800 p-5 sm:p-6 text-white shadow-md shadow-emerald-950/10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-900 font-black text-2xl shadow-xs"
              aria-label={`Sua posição: ${currentUserItem.position}º lugar`}
            >
              {currentUserItem.position}º
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100 border border-emerald-400/30">
                  Sua posição
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                  Você
                </span>
              </div>
              <h3 className="mt-1 text-lg sm:text-xl font-black text-white">
                {participant.name}
              </h3>
              <p className="text-xs text-emerald-200">
                Classificação calculada com os mesmos fatores de Meu Impacto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t border-emerald-700/60 pt-3 sm:border-t-0 sm:pt-0">
            <div>
              <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Impacto Estimado
              </span>
              <div className="text-2xl font-black text-white">
                ≈ {formatNumberPtBR(currentUserItem.co2eAvoidedKg, 1)} kg
              </div>
              <span className="text-[11px] text-emerald-200">CO₂e evitados</span>
            </div>
            <div className="border-l border-emerald-700/60 pl-5">
              <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Embalagens
              </span>
              <div className="text-2xl font-black text-white">
                {formatNumberPtBR(currentUserItem.containersCount)}
              </div>
              <span className="text-[11px] text-emerald-200">entregues</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lista do Ranking de Impacto */}
      <section
        id="secao-lista-ranking"
        aria-label="Tabela do ranking comunitário de impacto"
        className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Participantes Mais Ativos por CO₂e Evitado
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {fullRanking.length} participantes
          </span>
        </div>

        <div className="divide-y divide-slate-100" role="list" aria-label="Classificação por CO2e evitado">
          {fullRanking.map((person) => {
            const isTop3 = person.position <= 3;

            return (
              <div
                key={person.id}
                id={`ranking-row-${person.id}`}
                className={`flex items-center justify-between py-3.5 px-3 rounded-2xl transition ${
                  person.isCurrentUser
                    ? 'bg-emerald-50/80 border border-emerald-200 shadow-2xs'
                    : 'hover:bg-slate-50'
                }`}
                role="listitem"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Badge de Posição */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                      person.position === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : person.position === 2
                        ? 'bg-slate-200 text-slate-800 border border-slate-300'
                        : person.position === 3
                        ? 'bg-amber-800/10 text-amber-900 border border-amber-600/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                    aria-label={`Posição ${person.position}`}
                  >
                    {isTop3 ? (
                      <span className="flex items-center gap-0.5">
                        <Medal className="h-3.5 w-3.5" aria-hidden="true" />
                        {person.position}º
                      </span>
                    ) : (
                      `${person.position}º`
                    )}
                  </div>

                  {/* Avatar Genérico */}
                  <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </div>

                  {/* Nome e Total de Embalagens */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {person.name}
                      </span>
                      {person.isCurrentUser && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-black text-emerald-900">
                          Você
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <PackageCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{formatNumberPtBR(person.containersCount)} embalagens</span>
                    </div>
                  </div>
                </div>

                {/* Impacto Ambiental Estimado (EXCLUSIVAMENTE CO2e, NENHUM DADO FINANCEIRO) */}
                <div className="text-right shrink-0 pl-2">
                  <div className="flex items-center justify-end gap-1 text-sm sm:text-base font-black text-emerald-800">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    ≈ {formatNumberPtBR(person.co2eAvoidedKg, 1)} kg
                  </div>
                  <span className="block text-[11px] text-slate-500 font-medium">
                    de CO₂e evitados
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nota Legal e Disclaimer de Estimativa Obrigatório */}
      <DisclaimerNotice customText="*Os valores apresentados são estimativas baseadas nos registros de reciclagem." />
    </div>
  );
};

