import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EcoProvider } from './context/EcoContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas Públicas e de Acesso
import { PublicHomePage } from './pages/PublicHomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPlaceholderPage } from './pages/AdminLoginPlaceholderPage';

// Páginas Internas do Participante (MVP)
import { DashboardPage } from './pages/DashboardPage';
import { SimulatePage } from './pages/SimulatePage';
import { HistoryPage } from './pages/HistoryPage';
import { ImpactPage } from './pages/ImpactPage';
import { StatsPage } from './pages/StatsPage';
import { CollectionPointsPage } from './pages/CollectionPointsPage';
import { RankingPage } from './pages/RankingPage';
import { BadgesPage } from './pages/BadgesPage';
import { BenefitsPage } from './pages/BenefitsPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <EcoProvider>
      <BrowserRouter>
        <Routes>
          {/* ============================================================ */}
          {/* ROTAS PÚBLICAS                                               */}
          {/* ============================================================ */}
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPlaceholderPage />} />

          {/* ============================================================ */}
          {/* ROTAS PROTEGIDAS DO PARTICIPANTE (PAINEL INTERNO)            */}
          {/* ============================================================ */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard principal */}
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />

            {/* Funcionalidades do participante */}
            <Route path="/simular" element={<SimulatePage />} />
            <Route path="/historico" element={<HistoryPage />} />
            <Route path="/impacto" element={<ImpactPage />} />
            <Route path="/estatisticas" element={<StatsPage />} />
            <Route path="/postos" element={<CollectionPointsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/ranking-de-impacto" element={<Navigate to="/ranking" replace />} />
            <Route path="/conquistas" element={<BadgesPage />} />
            <Route path="/desafios" element={<Navigate to="/conquistas" replace />} />
            <Route path="/badges" element={<Navigate to="/conquistas" replace />} />
            <Route path="/beneficios" element={<BenefitsPage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/alertas" element={<Navigate to="/eventos" replace />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/minhas-estatisticas" element={<Navigate to="/estatisticas" replace />} />
            <Route path="/mapa" element={<Navigate to="/postos" replace />} />
          </Route>

          {/* ============================================================ */}
          {/* REDIRECIONAMENTO PADRÃO                                      */}
          {/* ============================================================ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EcoProvider>
  );
}
