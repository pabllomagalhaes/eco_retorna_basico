import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar para desktop */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto"
        >
          <Outlet />
        </main>

        {/* Navegação inferior mobile */}
        <BottomNav />
      </div>
    </div>
  );
};
