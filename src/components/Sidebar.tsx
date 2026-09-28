import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calculator,
  History,
  TrendingUp,
  BarChart3,
  Trophy,
  Award,
  MapPin,
  CalendarDays,
  Gift,
  User,
  Leaf,
  Info,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: string | boolean }>;
  badgeText?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'PRINCIPAL',
    items: [
      { to: '/app', label: 'Início', icon: Home },
      { to: '/simular', label: 'Simular', icon: Calculator },
      { to: '/historico', label: 'Histórico', icon: History },
    ],
  },
  {
    groupTitle: 'MEU IMPACTO',
    items: [
      { to: '/impacto', label: 'Impacto', icon: TrendingUp },
      { to: '/estatisticas', label: 'Minhas Estatísticas', icon: BarChart3 },
      { to: '/ranking', label: 'Ranking de Impacto', icon: Trophy },
      { to: '/conquistas', label: 'Desafios & Badges', icon: Award },
    ],
  },
  {
    groupTitle: 'EXPLORAR',
    items: [
      { to: '/postos', label: 'Postos & Mapa', icon: MapPin },
      { to: '/eventos', label: 'Eventos & Alertas', icon: CalendarDays },
    ],
  },
  {
    groupTitle: 'BENEFÍCIOS',
    items: [
      { to: '/beneficios', label: 'Benefícios', icon: Gift },
    ],
  },
  {
    groupTitle: 'CONTA',
    items: [
      { to: '/perfil', label: 'Perfil', icon: User },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside
      id="desktop-sidebar"
      className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white lg:flex min-h-screen"
      aria-label="Navegação principal da plataforma"
    >
      {/* Logotipo e Descrição */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-800/20">
          <Leaf className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-emerald-950">EcoRetorna</span>
          <span className="block text-[11px] font-medium text-emerald-700">Reciclagem com Propósito</span>
        </div>
      </div>

      {/* Lista de Grupos de Navegação */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6" aria-label="Menu lateral">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.groupTitle}
            </h2>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/app' || item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      } focus-visible:outline-2 focus-visible:outline-emerald-600`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Nota de rodapé da sidebar */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-200/60 flex items-start gap-2">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            Plataforma para participante. Registros de coleta são demonstrativos para fins de incentivo à reciclagem.
          </p>
        </div>
      </div>
    </aside>
  );
};
