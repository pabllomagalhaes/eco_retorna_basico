import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  Recycle,
  LineChart,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Info,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';

export const PublicHomePage: React.FC = () => {
  const { isLoggedIn } = useEco();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ============================================================ */}
      {/* TOPO / NAVEGAÇÃO PÚBLICA                                      */}
      {/* ============================================================ */}
      <header
        id="public-header"
        className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8"
        role="banner"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logotipo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-extrabold text-slate-900 transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-xl"
            aria-label="EcoRetorna - Página Inicial"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-emerald-950">
                EcoRetorna
              </span>
              <span className="text-[10px] font-medium text-emerald-700 tracking-wide">
                Reciclagem Cidadã
              </span>
            </div>
          </Link>

          {/* Ações de Topo */}
          <nav className="flex items-center gap-2.5 sm:gap-4" aria-label="Navegação rápida">
            {isLoggedIn ? (
              <Link
                to="/app"
                id="btn-nav-dashboard"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  id="btn-nav-login"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  id="btn-nav-register"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  Cadastre-se
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ============================================================ */}
        {/* HERO SECTION                                                 */}
        {/* ============================================================ */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            {/* Tag sustentável */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>Incentivo à Economia Circular</span>
            </div>

            {/* Título Principal */}
            <h1
              id="hero-title"
              className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.15]"
            >
              Reciclar transforma.
            </h1>

            {/* Texto Descritivo */}
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              O <strong>EcoRetorna</strong> ajuda você a acompanhar suas reciclagens, visualizar seu impacto
              ambiental e transformar atitudes sustentáveis em benefícios para você e sua comunidade.
            </p>

            {/* Botões de Ação do Hero */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
              <Link
                to="/cadastro"
                id="hero-btn-start"
                className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-sm shadow-emerald-700/20 transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800"
              >
                <span>Começar agora</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                id="hero-btn-login"
                className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm sm:text-base font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Já tenho uma conta
              </Link>
            </div>

            {/* Indicador de confiança / Acadêmico */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                Sem custos ou cobranças
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                Foco no participante cidadão
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                Dados transparentes
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SEÇÃO 1: POR QUE RECICLAR?                                   */}
        {/* ============================================================ */}
        <section
          id="por-que-reciclar"
          aria-labelledby="why-recycle-title"
          className="border-t border-slate-200/70 bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Sustentabilidade com Propósito
              </span>
              <h2
                id="why-recycle-title"
                className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
              >
                Por que reciclar?
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Cada embalagem que deixa de ir para aterros sanitários e rios alivia a pressão sobre os recursos
                naturais e fortalece o ciclo de reaproveitamento.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Item 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-white shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Recycle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Redução de resíduos</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Diminui o volume de descartes acumulados em aterros e áreas urbanas, prolongando a vida útil de espaços públicos.
                </p>
              </div>

              {/* Item 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-white shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Leaf className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Reaproveitamento</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Materiais como alumínio e PET retornam à indústria como matéria-prima de qualidade, poupando energia na fabricação.
                </p>
              </div>

              {/* Item 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-white shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Menos descarte incorreto</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Evita a poluição de córregos, bueiros e solos, prevenindo enchentes e contaminações biológicas.
                </p>
              </div>

              {/* Item 4 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-white shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Consciência coletiva</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Incentiva hábitos ambientais positivos na família e no bairro, mobilizando a comunidade em prol da sustentabilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SEÇÃO 2: COMO FUNCIONA (3 PASSOS)                            */}
        {/* ============================================================ */}
        <section
          id="como-funciona"
          aria-labelledby="how-it-works-title"
          className="border-t border-slate-200/70 bg-slate-50/60 py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Simples e Transparente
              </span>
              <h2
                id="how-it-works-title"
                className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
              >
                Como funciona
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Entenda o fluxo básico para participar e valorizar o descarte de suas embalagens recicláveis.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
              {/* Passo 1 */}
              <div className="flex flex-col items-center text-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-sm shadow-emerald-700/20">
                  1
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">Recicle</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Leve seus materiais (garrafas PET e latas de alumínio) a um ponto de coleta credenciado mais próximo.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="flex flex-col items-center text-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white font-black text-xl shadow-sm shadow-emerald-800/20">
                  2
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">Acompanhe</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Veja suas reciclagens registradas e o impacto ambiental estimado em emissões de gases de efeito estufa evitadas.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="flex flex-col items-center text-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white font-black text-xl shadow-sm shadow-teal-800/20">
                  3
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">Evolua</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Ganhe pontos por cada embalagem entregue, desbloqueie conquistas na plataforma e troque por benefícios reais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SEÇÃO 3: SEU IMPACTO IMPORTA                                 */}
        {/* ============================================================ */}
        <section
          id="seu-impacto"
          aria-labelledby="impact-title"
          className="border-t border-slate-200/70 bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Award className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Atitude Sustentável
                </span>
                <h2 id="impact-title" className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Seu impacto importa.
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Pequenas ações individuais, somadas em comunidade, resultam em transformações expressivas.
                  Cada garrafa e lata reciclada é um passo tangível para a conservação do nosso planeta.
                </p>
                <div className="pt-2">
                  <Link
                    to="/cadastro"
                    id="impact-cta-btn"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800"
                  >
                    <span>Criar conta de participante</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Card ilustrativo de métrica */}
              <div className="rounded-2xl border border-emerald-200/70 bg-white/90 p-5 shadow-xs shrink-0 self-start md:self-center w-full md:w-64 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Economia Estimada
                  </span>
                  <LineChart className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1 text-2xl font-black text-emerald-950">
                    <span>≈ 0,16 a 0,22</span>
                    <span className="text-xs font-bold text-emerald-700">kg CO₂e</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    evitados por embalagem reciclada
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                  Valores calculados com base em fatores médios de ciclo de vida.
                </div>
              </div>
            </div>

            {/* Aviso ético/metodológico de estimativa */}
            <div
              role="note"
              className="mt-8 rounded-xl border border-slate-200/80 bg-white/80 p-3.5 text-xs text-slate-500 flex items-start gap-2.5 leading-relaxed"
            >
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Aviso de transparência:</strong> Os indicadores ambientais apresentados na plataforma são
                estimativas baseadas em fatores médios de literatura científica e têm caráter educativo e motivacional.
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* RODAPÉ PÚBLICO                                               */}
      {/* ============================================================ */}
      <footer
        id="public-footer"
        className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8 text-xs text-slate-500"
        role="contentinfo"
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-slate-800">EcoRetorna</span> — Projeto acadêmico de incentivo à reciclagem.
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#por-que-reciclar"
              className="transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
            >
              Sobre
            </a>
            <Link
              to="/login"
              className="transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
            >
              Cadastre-se
            </Link>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-slate-700 transition focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm text-[11px]"
              title="Acesso reservado aos operadores do sistema"
            >
              Área Administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
