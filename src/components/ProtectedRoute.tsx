import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEco } from '../context/EcoContext';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * Guarda de rota protegida para participantes autenticados.
 * Redireciona usuários não autenticados para a página de login.
 * Mantém o modo demonstrativo funcional durante o desenvolvimento sem Firebase.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
  children,
}) => {
  const { isLoggedIn, isLoading } = useEco();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-600">Carregando painel do participante...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
