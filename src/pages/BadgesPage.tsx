import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Footprints,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';

export const BadgesPage: React.FC = () => {
  const { badges, totalContainers, aluminumCount, environmentalImpact } = useEco();

  // Mapear ícones
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return Footprints;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Leaf':
        return Leaf;
      case 'Sparkles':
        return Sparkles;
      default:
        return Award;
    }
  };

  // Dinamizar o progresso baseado no estado do participante
  const dynamicBadges = badges.map((b) => {
    let current = b.currentProgress || 0;
    let unlocked = b.unlocked;

    if (b.id === 'badge_first_step') {
      current = Math.min(1, totalContainers);
      unlocked = totalContainers >= 1;
    } else if (b.id === 'badge_recycler_50') {
      current = totalContainers;
      unlocked = totalContainers >= 50;
    } else if (b.id === 'badge_aluminum_friend') {
      current = aluminumCount;
      unlocked = aluminumCount >= 25;
    } else if (b.id === 'badge_green_guardian') {
      current = environmentalImpact.co2eAvoidedKg;
      unlocked = environmentalImpact.co2eAvoidedKg >= 40;
    } else if (b.id === 'badge_recycler_300') {
      current = totalContainers;
      unlocked = totalContainers >= 300;
    } else if (b.id === 'badge_centurion_aluminum') {
      current = aluminumCount;
      unlocked = aluminumCount >= 100;
    }

    return { ...b, currentProgress: current, unlocked };
  });

  const unlockedCount = dynamicBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Award className="h-4 w-4" aria-hidden="true" />
          Gamificação Consciente
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Desafios & Badges
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Celebre seus marcos de sustentabilidade. Conquistas têm caráter exclusivamente motivacional e não geram bonificação financeira.
        </p>
      </div>

      {/* Resumo de Progresso do Participante */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50/40 to-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
            <Award className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase">Seu Desempenho</span>
            <h3 className="text-xl font-black text-slate-900">
              {unlockedCount} de {dynamicBadges.length} Conquistas Desbloqueadas
            </h3>
            <p className="text-xs text-slate-500">
              Continue entregando embalagens nos postos para desbloquear novos marcos.
            </p>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Progresso Geral</span>
            <span>{Math.round((unlockedCount / dynamicBadges.length) * 100)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              style={{ width: `${(unlockedCount / dynamicBadges.length) * 100}%` }}
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Grid de Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dynamicBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.iconName);
          const current = badge.currentProgress || 0;
          const target = badge.targetProgress || 1;
          const progressPercent = Math.min(100, Math.round((current / target) * 100));

          return (
            <div
              key={badge.id}
              className={`flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition ${
                badge.unlocked
                  ? 'border-amber-200 bg-white hover:border-amber-300'
                  : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      badge.unlocked
                        ? 'bg-amber-100 text-amber-700 shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Conquistada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      Bloqueada
                    </span>
                  )}
                </div>

                <h4 className="mt-4 text-base font-bold text-slate-900">{badge.title}</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{badge.description}</p>
              </div>

              {/* Barra de Progresso da Conquista */}
              <div className="mt-5 border-t border-slate-100 pt-3">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>
                    Progresso: {formatNumberPtBR(current, 1)} / {target}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      badge.unlocked ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                  />
                </div>
                {badge.unlockedAt && (
                  <span className="mt-2 block text-[10px] text-slate-400">
                    Desbloqueada em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota educativa de gamificação */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 flex items-start gap-2.5">
        <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          As medalhas são conquistas honoríficas baseadas no seu histórico de descarte. O EcoRetorna não premia acessos diários, streaks ou cliques, valorizando a atitude real de destinação correta dos resíduos.
        </p>
      </div>
    </div>
  );
};
