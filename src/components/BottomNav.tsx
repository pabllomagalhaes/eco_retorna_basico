import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calculator, TrendingUp, Gift, Menu } from 'lucide-react';
import { MoreMenuModal } from './MoreMenuModal';

const MORE_ROUTES = [
  '/historico',
  '/estatisticas',
  '/postos',
  '/ranking',
  '/conquistas',
  '/eventos',
  '/perfil',
];

export const BottomNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const isMoreActive = MORE_ROUTES.includes(location.pathname);

  return (
    <>
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-md lg:hidden"
        role="navigation"
        aria-label="Navegação inferior mobile"
      >
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            } focus-visible:outline-2 focus-visible:outline-emerald-600`
          }
          aria-label="Página Inicial"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] mt-0.5">Início</span>
        </NavLink>

        <NavLink
          to="/simular"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            } focus-visible:outline-2 focus-visible:outline-emerald-600`
          }
          aria-label="Simular reciclagem"
        >
          <Calculator className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] mt-0.5">Simular</span>
        </NavLink>

        <NavLink
          to="/impacto"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            } focus-visible:outline-2 focus-visible:outline-emerald-600`
          }
          aria-label="Meu impacto ambiental"
        >
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] mt-0.5">Impacto</span>
        </NavLink>

        <NavLink
          to="/beneficios"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            } focus-visible:outline-2 focus-visible:outline-emerald-600`
          }
          aria-label="Benefícios e resgates"
        >
          <Gift className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] mt-0.5">Benefícios</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
            isMoreActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          } focus-visible:outline-2 focus-visible:outline-emerald-600`}
          aria-label="Abrir mais opções do menu"
          aria-expanded={isMoreOpen}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] mt-0.5">Mais</span>
        </button>
      </nav>

      <MoreMenuModal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};
