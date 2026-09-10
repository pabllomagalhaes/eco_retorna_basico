import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Coins, UserCircle } from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Início', subtitle: 'Painel do Participante' },
  '/simular': { title: 'Simule sua reciclagem', subtitle: 'Descubra quantos pontos suas embalagens podem valer' },
  '/historico': { title: 'Meu Histórico', subtitle: 'Registros de reciclagens realizadas' },
  '/impacto': { title: 'Meu Impacto', subtitle: 'Estimativa de benefícios ambientais' },
  '/estatisticas': { title: 'Minhas Estatísticas', subtitle: 'Análise pessoal de evolução' },
  '/postos': { title: 'Postos & Mapa', subtitle: 'Encontre locais onde você pode destinar suas embalagens recicláveis' },
  '/ranking': { title: 'Ranking de Impacto', subtitle: 'Classificação comunitária por CO₂e evitado estimado' },
  '/conquistas': { title: 'Desafios & Badges', subtitle: 'Conquistas e marcos alcançados' },
  '/beneficios': { title: 'Benefícios', subtitle: 'Resgate e doação de pontos' },
  '/eventos': { title: 'Eventos & Alertas', subtitle: 'Ações e campanhas comunitárias' },
  '/perfil': { title: 'Meu Perfil', subtitle: 'Configurações e dados do participante' },
};

export const Header: React.FC = () => {
  const { participant, pointsBalance, reaisEquivalent } = useEco();
  const location = useLocation();
  const current = PAGE_TITLES[location.pathname] || { title: 'EcoRetorna' };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-100/70 bg-white/95 px-4 py-3 backdrop-blur-md transition-colors lg:px-8"
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* Marca EcoRetorna no mobile e título de página no desktop */}
        <Link
          to="/"
          id="header-brand-link"
          className="flex items-center gap-2 font-bold text-emerald-800 transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-emerald-600 lg:hidden"
          aria-label="Ir para página inicial do EcoRetorna"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight font-extrabold text-emerald-900">EcoRetorna</span>
        </Link>

        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">{current.title}</h1>
          {current.subtitle && (
            <p className="text-xs text-slate-500">{current.subtitle}</p>
          )}
        </div>
      </div>

      {/* Saldo e Identificação do Participante */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Pílula de Saldo Resumido */}
        <Link
          to="/beneficios"
          id="header-balance-pill"
          className="group flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100/80 focus-visible:outline-2 focus-visible:outline-emerald-600"
          title="Ver benefícios e resgates disponíveis"
          aria-label={`Saldo de ${formatNumberPtBR(pointsBalance)} pontos, equivalente a ${formatCurrencyPtBR(reaisEquivalent)}`}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Coins className="h-3 w-3" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-emerald-900">{formatNumberPtBR(pointsBalance)} pts</span>
            <span className="hidden text-emerald-700/80 sm:inline">≈ {formatCurrencyPtBR(reaisEquivalent)}</span>
          </div>
        </Link>

        {/* Perfil rápido */}
        <Link
          to="/perfil"
          id="header-profile-link"
          className="flex items-center gap-2 rounded-full p-1 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
          aria-label={`Perfil de ${participant.name}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
            {participant.name ? participant.name.slice(0, 2).toUpperCase() : 'CR'}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">
            {participant.name ? participant.name.split(' ')[0] : 'Camila'}
          </span>
        </Link>
      </div>
    </header>
  );
};
