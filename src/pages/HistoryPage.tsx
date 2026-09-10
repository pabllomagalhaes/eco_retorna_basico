import React, { useMemo, useState } from 'react';
import {
  History,
  Filter,
  Calendar,
  PackageCheck,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';

type MaterialFilterType = 'all' | 'pet' | 'aluminio';
type PeriodFilterType = 'all' | '7days' | '30days';

export const HistoryPage: React.FC = () => {
  const { recyclingRecords } = useEco();

  const [materialFilter, setMaterialFilter] = useState<MaterialFilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem e ordenação (mais recente primeiro)
  const filteredRecords = useMemo(() => {
    let list = [...recyclingRecords];

    // Ordenar do mais recente para o mais antigo
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filtro por Material
    if (materialFilter !== 'all') {
      list = list.filter((item) => item.materialCategory === materialFilter);
    }

    // Filtro por Período
    if (periodFilter !== 'all') {
      // Data de referência baseada na data mais recente ou data atual
      const baseDate = new Date('2026-09-09T23:59:59');
      const baseTime = baseDate.getTime();

      list = list.filter((item) => {
        // Formato YYYY-MM-DD
        const itemDate = new Date(`${item.date}T12:00:00`);
        const diffDays = (baseTime - itemDate.getTime()) / (1000 * 3600 * 24);

        if (periodFilter === '7days') {
          return diffDays >= 0 && diffDays <= 7;
        }
        if (periodFilter === '30days') {
          return diffDays >= 0 && diffDays <= 30;
        }
        return true;
      });
    }

    // Busca textual opcional por posto ou material
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.materialName.toLowerCase().includes(q) ||
          item.collectionPointName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [recyclingRecords, materialFilter, periodFilter, searchQuery]);

  // Totais calculados dinamicamente sobre a lista filtrada
  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, item) => ({
        containers: acc.containers + item.quantity,
        points: acc.points + item.pointsEarned,
        reais: acc.reais + item.reaisEquivalent,
      }),
      { containers: 0, points: 0, reais: 0 }
    );
  }, [filteredRecords]);

  // Função para formatar data em DD/MM/YYYY
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleResetFilters = () => {
    setMaterialFilter('all');
    setPeriodFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Título da Página */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <History className="h-4 w-4" aria-hidden="true" />
          Extrato do Participante
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Meu Histórico
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Consulte todas as entregas de embalagens realizadas nos postos de reciclagem.
        </p>
      </div>

      {/* Barra de Filtros */}
      <section
        aria-label="Filtros do histórico"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filtro por Material */}
          <div>
            <label
              htmlFor="filter-material-select"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <Filter className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              Material
            </label>
            <select
              id="filter-material-select"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value as MaterialFilterType)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 transition focus:border-emerald-600 focus:bg-white focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="pet">PET</option>
              <option value="aluminio">Alumínio</option>
            </select>
          </div>

          {/* Filtro por Período */}
          <div>
            <label
              htmlFor="filter-period-select"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              Período
            </label>
            <select
              id="filter-period-select"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as PeriodFilterType)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 transition focus:border-emerald-600 focus:bg-white focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
            </select>
          </div>

          {/* Campo de Busca Livre (opcional) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="filter-search-input"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              Buscar por posto
            </label>
            <div className="relative">
              <input
                id="filter-search-input"
                type="text"
                placeholder="Ex: Praça, Central..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Limpar busca textual"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resumo da consulta com botão de reset se ativo */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div>
            Exibindo <strong>{filteredRecords.length}</strong> entrega(s)
            {filteredRecords.length > 0 && (
              <span>
                {' '}• Total: <strong>{formatNumberPtBR(totals.containers)}</strong> embalagens (+
                <strong>{formatNumberPtBR(totals.points)}</strong> pts /{' '}
                <strong>{formatCurrencyPtBR(totals.reais)}</strong>)
              </span>
            )}
          </div>

          {(materialFilter !== 'all' || periodFilter !== 'all' || searchQuery !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de Registros ou Estado Vazio */}
      {filteredRecords.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center"
        >
          <PackageCheck className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            Nenhuma reciclagem encontrada para este filtro.
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Tente selecionar outros materiais ou períodos no filtro acima.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restaurar filtros
          </button>
        </div>
      ) : (
        <section aria-label="Lista de entregas" className="space-y-3">
          {filteredRecords.map((record) => {
            const isPet = record.materialCategory === 'pet';
            const displayDate = formatDisplayDate(record.date);
            const materialDisplay = isPet ? 'PET 2 L' : 'Lata de alumínio';

            return (
              <article
                key={record.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Lado Esquerdo: Ícone, Material, Data e Posto */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isPet ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <PackageCheck className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{displayDate}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                          isPet ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {materialDisplay}
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {record.materialName}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Entregue em: <span className="font-medium text-slate-700">{record.collectionPointName}</span>
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Quantidade, Pontos e Reais */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
                  <div className="text-left sm:text-right">
                    <span className="block text-base font-black text-emerald-700">
                      +{record.pointsEarned} pontos
                    </span>
                    <span className="block text-xs font-bold text-slate-600">
                      ≈ {formatCurrencyPtBR(record.reaisEquivalent)}
                    </span>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {record.quantity} {record.quantity === 1 ? 'unidade' : 'unidades'}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
