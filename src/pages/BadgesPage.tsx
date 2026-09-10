import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Footprints,
  Trophy,
  Zap,
  Flame,
  Globe,
  Recycle,
  Target,
  Info,
  Clock,
  Filter,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatNumberPtBR } from '../utils/scoring';
import { Badge } from '../types';

export const BadgesPage: React.FC = () => {
  const { badges, challenges } = useEco();

  // Filtro de badges: 'all' | 'unlocked' | 'locked'
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Ícones mapeados com segurança
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return Footprints;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'Award':
        return Award;
      case 'Trophy':
        return Trophy;
      case 'Sparkles':
        return Sparkles;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Zap':
        return Zap;
      case 'PackageCheck':
        return PackageCheck;
      case 'Flame':
        return Flame;
      case 'Leaf':
        return Leaf;
      case 'Globe':
        return Globe;
      case 'Recycle':
        return Recycle;
      default:
        return Award;
    }
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const totalBadgesCount = badges.length;
  const generalProgressPercent = Math.round((unlockedBadgesCount / totalBadgesCount) * 100);

  const filteredBadges = badges.filter((badge) => {
    if (badgeFilter === 'unlocked') return badge.unlocked;
    if (badgeFilter === 'locked') return !badge.unlocked;
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Principal da Página */}
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs tracking-wider uppercase">
          <Award className="h-4 w-4" aria-hidden="true" />
          Reconhecimento & Sustentabilidade
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Desafios & Conquistas
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Acompanhe suas metas em andamento e celebre cada marco alcançado com as embalagens que você destina corretamente.
        </p>
      </header>

      {/* AVISO MANDATÓRIO: NÃO CONCEDER PONTOS POR GAMIFICAÇÃO */}
      <div
        id="notice-gamification-rules"
        className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3 shadow-xs"
        role="region"
        aria-label="Aviso sobre regras de pontos da gamificação"
      >
        <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-0.5">
          <strong className="block font-bold text-amber-900">
            Regra Fundamental do EcoRetorna:
          </strong>
          <p className="text-amber-900/90 leading-relaxed">
            Badges e desafios representam reconhecimento e motivação socioambiental. Não concedem pontuação adicional com equivalência financeira.
          </p>
        </div>
      </div>

      {/* Resumo do Progresso de Conquistas */}
      <section
        id="section-progress-summary"
        aria-label="Resumo do progresso em conquistas"
        className="rounded-3xl border border-emerald-200/90 bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-7 text-white shadow-md shadow-emerald-950/10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xs border border-white/20 shrink-0">
              <Trophy className="h-7 w-7 sm:h-8 sm:w-8 text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-200">
                Seu Desempenho Cidadão
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {unlockedBadgesCount} de {totalBadgesCount} Conquistas Alcançadas
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                Suas conquistas são calculadas automaticamente a partir dos registros reais de reciclagem entregues nos postos.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 shrink-0 rounded-2xl bg-emerald-900/40 p-4 border border-emerald-600/30">
            <div className="flex justify-between text-xs font-bold text-emerald-200 mb-1.5">
              <span>Taxa de Conclusão</span>
              <span className="text-white">{generalProgressPercent}%</span>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-emerald-950/60 p-0.5"
              role="progressbar"
              aria-valuenow={generalProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso geral de conquistas"
            >
              <div
                style={{ width: `${generalProgressPercent}%` }}
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-emerald-300 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 1: DESAFIOS EM ANDAMENTO */}
      {/* ========================================================================= */}
      <section
        id="section-desafios"
        aria-labelledby="heading-desafios"
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Target className="h-4 w-4" aria-hidden="true" />
              Metas Voluntárias
            </div>
            <h2 id="heading-desafios" className="text-xl sm:text-2xl font-black text-slate-900">
              Desafios em andamento
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Progresso contínuo com base nas suas entregas registradas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {challenges.map((challenge) => {
            const Icon = getBadgeIcon(challenge.iconName);
            const current = challenge.currentProgress;
            const target = challenge.targetProgress;
            const percent = Math.min(100, Math.round((current / target) * 100));
            const remaining = Math.max(0, target - current);

            return (
              <div
                key={challenge.id}
                id={`card-challenge-${challenge.id}`}
                className={`flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition ${
                  challenge.completed
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          challenge.completed
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          {challenge.category === 'volume'
                            ? 'Volume'
                            : challenge.category === 'material'
                            ? 'Material Específico'
                            : 'Impacto Climático'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {challenge.title}
                        </h3>
                      </div>
                    </div>

                    {challenge.completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Concluído
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 shrink-0">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        Em andamento
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {challenge.description}
                  </p>

                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Condição:</span> {challenge.condition}
                  </div>
                </div>

                {/* Barra de Progresso do Desafio */}
                <div className="mt-5 border-t border-slate-100 pt-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>
                      Progresso: {formatNumberPtBR(current, challenge.category === 'impacto' ? 1 : 0)} / {target} {challenge.unit}
                    </span>
                    <span className="text-emerald-700">{percent}%</span>
                  </div>

                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progresso do desafio ${challenge.title}`}
                  >
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        challenge.completed ? 'bg-emerald-600' : 'bg-emerald-600'
                      }`}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    {challenge.completed ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Meta alcançada!
                      </span>
                    ) : (
                      <span>
                        Faltam{' '}
                        <strong className="text-slate-800">
                          {formatNumberPtBR(remaining, challenge.category === 'impacto' ? 1 : 0)} {challenge.unit}
                        </strong>
                      </span>
                    )}
                    <span>Meta acumulada</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: CONQUISTAS */}
      {/* ========================================================================= */}
      <section
        id="section-conquistas"
        aria-labelledby="heading-conquistas"
        className="space-y-4 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Award className="h-4 w-4" aria-hidden="true" />
              Marcos Históricos
            </div>
            <h2 id="heading-conquistas" className="text-xl sm:text-2xl font-black text-slate-900">
              Conquistas
            </h2>
          </div>

          {/* Filtros de Conquistas */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                badgeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({badges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('unlocked')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                badgeFilter === 'unlocked'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alcançadas ({unlockedBadgesCount})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('locked')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                badgeFilter === 'locked'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em progresso ({totalBadgesCount - unlockedBadgesCount})
            </button>
          </div>
        </div>

        {/* Grid de Badges */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBadges.map((badge: Badge) => {
            const Icon = getBadgeIcon(badge.iconName);
            const current = badge.currentProgress || 0;
            const target = badge.targetProgress || 1;
            const progressPercent = Math.min(100, Math.round((current / target) * 100));

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition ${
                  badge.unlocked
                    ? 'border-amber-200 bg-white hover:border-amber-300 ring-1 ring-amber-100'
                    : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div>
                  {/* Topo do Card de Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        badge.unlocked
                          ? 'bg-amber-100 text-amber-800 shadow-xs border border-amber-200/70'
                          : 'bg-slate-200 text-slate-400 border border-slate-300/60'
                      }`}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>

                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-800 shadow-2xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        Conquista alcançada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-600">
                        <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                        Bloqueada
                      </span>
                    )}
                  </div>

                  {/* Detalhes do Badge */}
                  <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                    {badge.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="mt-3 rounded-xl bg-slate-100/70 p-2.5 text-xs text-slate-600 border border-slate-200/50">
                    <span className="font-semibold text-slate-700">Condição:</span> {badge.condition}
                  </div>
                </div>

                {/* Rodapé / Estado com base nas regras do prompt */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  {badge.unlocked ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                          Conquista alcançada
                        </span>
                        <span>100%</span>
                      </div>
                      {badge.unlockedAt && (
                        <span className="block text-[11px] text-slate-400">
                          Alcançada em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                        <span>
                          Progresso: {formatNumberPtBR(current, badge.category === 'impacto' ? 1 : 0)} / {target} {badge.unit || ''}
                        </span>
                        <span className="text-slate-600">{progressPercent}%</span>
                      </div>

                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progresso da conquista ${badge.title}`}
                      >
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rodapé Educativo */}
      <footer className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 flex items-start gap-3">
        <PackageCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          *Todas as conquistas e desafios utilizam estritamente o histórico de reciclagens registradas pelo participante. As simulações de embalagens realizadas na calculadora do sistema são apenas educativas e não contam para o desbloqueio de badges ou desafios.
        </p>
      </footer>
    </div>
  );
};
