import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EcoProvider, useEco } from './context/EcoContext';
import { AppLayout } from './layouts/AppLayout';
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
import { LoginPage } from './pages/LoginPage';

// Guarda de rota para login demonstrativo simples
const ProtectedApp: React.FC = () => {
  const { isLoggedIn } = useEco();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
};

export default function App() {
  return (
    <EcoProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota de Login Simples */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas do Participante */}
          <Route element={<ProtectedApp />}>
            <Route path="/" element={<DashboardPage />} />
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

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EcoProvider>
  );
}
