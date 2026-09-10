import React, { useMemo, useState } from 'react';
import {
  History,
  Filter,
  Calendar,
  PackageCheck,
  Search,
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import { formatCurrencyPtBR, formatNumberPtBR } from '../utils/scoring';

export const HistoryPage: React.FC = () => {
  const { recyclingRecords } = useEco();

  const [materialFilter, setMaterialFilter] = useState<'all' | 'pet' | 'aluminio'>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | '30days' | '90days' | 'this_year'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem e ordenação (mais recente primeiro)
  const filteredRecords = useMemo(() => {
    let list = [...recyclingRecords];

    // Ordenar do mais recente para o mais antigo
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filtro por material
    if (materialFilter !== 'all') {
      list = list.filter((item) => item.materialCategory === materialFilter);
    }

    // Filtro por período
    if (periodFilter !== 'all') {
      const now = new Date('2026-09-08'); // Data base do protótipo
      list = list.filter((item) => {
        const itemDate = new Date(item.date);
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);

        if (periodFilter === '30days') return diffDays <= 30 && diffDays >= 0;
        if (periodFilter === '90days') return diffDays <= 90 && diffDays >= 0;
        if (periodFilter === 'this_year') return itemDate.getFullYear() === 2026;
        return true;
      });
    }

    // Filtro por busca textual (posto ou material)
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

  // Totais do filtro atual
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

  return (
    <div className="space-y-6">
      {/* Título e Explicação */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <History className="h-4 w-4" aria-hidden="true" />
          Extrato Oficial
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Histórico de Reciclagens
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Consulte todas as entregas realizadas nos postos parceiros do EcoRetorna. Registros não podem ser alterados pelo participante.
        </p>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por ponto de coleta ou embalagem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
              aria-label="Filtrar registros por texto"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro por Material */}
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <label htmlFor="material-filter-select" className="sr-only">Filtrar por material</label>
              <select
                id="material-filter-select"
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Todos os Materiais</option>
                <option value="pet">Somente Garrafas PET</option>
                <option value="aluminio">Somente Latas de Alumínio</option>
              </select>
            </div>

            {/* Filtro por Período */}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <label htmlFor="period-filter-select" className="sr-only">Filtrar por período</label>
              <select
                id="period-filter-select"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Todo o Período</option>
                <option value="30days">Últimos 30 Dias</option>
                <option value="90days">Últimos 90 Dias</option>
                <option value="this_year">Ano Vigente (2026)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumo da visualização filtrada */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Exibindo <strong>{filteredRecords.length}</strong> registro(s)
          </span>
          <div className="flex items-center gap-3 font-medium">
            <span>
              Total itens: <strong>{formatNumberPtBR(totals.containers)}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              +{formatNumberPtBR(totals.points)} pts ({formatCurrencyPtBR(totals.reais)})
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Registros */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <PackageCheck className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
          <h3 className="mt-3 text-base font-bold text-slate-800">Nenhum registro encontrado</h3>
          <p className="mt-1 text-xs text-slate-500">
            Nenhuma entrega corresponde aos filtros selecionados. Tente ajustar os parâmetros.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const isPet = record.materialCategory === 'pet';
            const formattedDate = new Date(record.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article
                key={record.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isPet ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <PackageCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{record.materialName}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isPet ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPet ? 'PET 2 L' : 'Alumínio'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Entregue no <span className="font-medium text-slate-700">{record.collectionPointName}</span>
                    </p>
                    <time dateTime={record.date} className="text-[11px] text-slate-400">
                      {formattedDate}
                    </time>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
                  <div className="text-left sm:text-right">
                    <span className="block text-base font-black text-emerald-700">
                      +{record.pointsEarned} pontos
                    </span>
                    <span className="block text-xs font-semibold text-slate-600">
                      ≈ {formatCurrencyPtBR(record.reaisEquivalent)}
                    </span>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {record.quantity} {record.quantity === 1 ? 'embalagem' : 'embalagens'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
