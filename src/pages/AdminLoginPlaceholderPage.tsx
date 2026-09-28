import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockKeyhole, ArrowLeft, ShieldCheck, Leaf, ExternalLink } from 'lucide-react';

export const AdminLoginPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-100/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Ícone de Gestão / Admin */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg shadow-slate-900/20">
          <LockKeyhole className="h-7 w-7 text-emerald-400" aria-hidden="true" />
        </div>

        <h1 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Área Administrativa do EcoRetorna
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Aplicação complementar dedicada à gestão operacional da plataforma
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex items-start gap-3 text-left">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="block font-bold text-emerald-950 mb-0.5">Aplicação Complementar Separada</span>
              O <strong>EcoRetorna Admin</strong> opera como uma aplicação web independente, compartilhando a mesma base de dados Firebase Authentication e Cloud Firestore com o EcoRetorna Participante.
            </div>
          </div>

          <div className="py-2 space-y-2 text-xs text-slate-600 leading-relaxed text-left">
            <p>
              O painel administrativo é responsável pela gestão global dos seguintes recursos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li><strong>Materiais:</strong> cadastro de itens recicláveis, pontuações e fatores de CO₂e;</li>
              <li><strong>Campanhas:</strong> regras de incentivo, bônus e multiplicadores de pontos;</li>
              <li><strong>Benefícios:</strong> catálogo de recompensas e iniciativas comunitárias de doação;</li>
              <li><strong>Eventos:</strong> agenda comunitária, mutirões e comunicados ambientais;</li>
              <li><strong>Ecopontos:</strong> locais de coleta, horários e geolocalização no mapa;</li>
              <li><strong>Indicadores gerais:</strong> monitoramento do volume global reciclado e métricas ecológicas.</li>
            </ul>
          </div>

          {/* Link para o Repositório do Admin */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 flex items-center justify-between text-left">
            <div>
              <span className="block font-bold text-slate-800">Repositório do EcoRetorna Admin:</span>
              <span className="text-[11px] text-slate-500 break-all">github.com/pabllomagalhaes/eco-retorna-admin</span>
            </div>
            <a
              href="https://github.com/pabllomagalhaes/eco-retorna-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition shrink-0 ml-2"
              aria-label="Abrir repositório do EcoRetorna Admin em nova aba"
            >
              <span>Acessar</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            </a>
          </div>

          {/* Botão Voltar */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-admin-placeholder-back"
              onClick={handleBack}
              className="w-full inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-slate-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Voltar</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
            >
              <Leaf className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>Ir para a Página Inicial Pública</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
