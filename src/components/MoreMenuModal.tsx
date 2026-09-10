import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  History,
  BarChart3,
  MapPin,
  Trophy,
  Award,
  CalendarDays,
  User,
  ChevronRight,
} from 'lucide-react';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MORE_ITEMS = [
  {
    to: '/historico',
    label: 'Histórico',
    desc: 'Extrato de entregas e reciclagens',
    icon: History,
  },
  {
    to: '/estatisticas',
    label: 'Minhas Estatísticas',
    desc: 'Evolução mensal e comparativos',
    icon: BarChart3,
  },
  {
    to: '/postos',
    label: 'Postos & Mapa',
    desc: 'Localizar pontos de descarte',
    icon: MapPin,
  },
  {
    to: '/ranking',
    label: 'Ranking de Impacto',
    desc: 'Classificação por CO₂e evitado',
    icon: Trophy,
  },
  {
    to: '/conquistas',
    label: 'Desafios & Badges',
    desc: 'Conquistas e metas sustentáveis',
    icon: Award,
  },
  {
    to: '/eventos',
    label: 'Eventos & Alertas',
    desc: 'Mutirões e oficinas comunitárias',
    icon: CalendarDays,
  },
  {
    to: '/perfil',
    label: 'Perfil',
    desc: 'Dados cadastrais e preferências',
    icon: User,
  },
];

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-menu-title"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle visual e cabeçalho */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 id="more-menu-title" className="text-lg font-bold text-slate-900">
              Mais Opções
            </h2>
            <p className="text-xs text-slate-500">Acesse recursos adicionais do EcoRetorna</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-600"
            aria-label="Fechar menu de opções"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="divide-y divide-slate-100 pt-2" aria-label="Menu estendido móvel">
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3.5 px-2 transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold rounded-xl'
                      : 'text-slate-700 hover:bg-slate-50'
                  } focus-visible:outline-2 focus-visible:outline-emerald-600`
                }
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-emerald-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
