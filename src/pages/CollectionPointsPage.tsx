import React, { useMemo, useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  X,
  Sparkles,
  Info,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';
import { COLLECTION_POINTS } from '../data/mockData';
import { CollectionPoint } from '../types';
import { LeafletMap } from '../components/LeafletMap';

export const CollectionPointsPage: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint>(COLLECTION_POINTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState<'all' | 'pet' | 'aluminio'>('all');
  const [detailModalPoint, setDetailModalPoint] = useState<CollectionPoint | null>(null);

  // Fechar modal com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && detailModalPoint) {
        setDetailModalPoint(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailModalPoint]);

  // Filtragem dinâmica de pontos por busca textual e material
  const filteredPoints = useMemo(() => {
    return COLLECTION_POINTS.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);

      let matchesMaterial = true;
      if (materialFilter === 'pet') {
        matchesMaterial = p.acceptedMaterials.some((m) =>
          m.toLowerCase().includes('pet')
        );
      } else if (materialFilter === 'aluminio') {
        matchesMaterial = p.acceptedMaterials.some((m) =>
          m.toLowerCase().includes('alum')
        );
      }

      return matchesSearch && matchesMaterial;
    });
  }, [searchQuery, materialFilter]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Rede de Entrega Sustentável
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Postos & Mapa
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
          Encontre locais onde você pode destinar suas embalagens recicláveis.
        </p>
      </div>

      {/* Controles de Busca e Filtro de Materiais */}
      <section
        id="section-search-filter"
        aria-label="Filtros e busca de postos de coleta"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Campo de Busca */}
          <div className="md:col-span-2 relative">
            <label htmlFor="search-collection-points" className="sr-only">
              Pesquisar por nome, endereço ou bairro
            </label>
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="search-collection-points"
              type="search"
              placeholder="Buscar por nome, endereço ou bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Limpar termo de busca"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filtro por Material */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Filtro por tipo de material aceito">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:inline" aria-hidden="true" />
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <button
                type="button"
                id="filter-material-todos"
                onClick={() => setMaterialFilter('all')}
                className={`rounded-xl px-2.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                  materialFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
                aria-pressed={materialFilter === 'all'}
              >
                Todos
              </button>
              <button
                type="button"
                id="filter-material-pet"
                onClick={() => setMaterialFilter('pet')}
                className={`rounded-xl px-2.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                  materialFilter === 'pet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
                aria-pressed={materialFilter === 'pet'}
              >
                PET
              </button>
              <button
                type="button"
                id="filter-material-aluminio"
                onClick={() => setMaterialFilter('aluminio')}
                className={`rounded-xl px-2.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                  materialFilter === 'aluminio'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
                aria-pressed={materialFilter === 'aluminio'}
              >
                Alumínio
              </button>
            </div>
          </div>
        </div>

        {/* Quantidade de Postos Encontrados */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-medium">
            Exibindo <strong className="text-slate-900 font-bold">{filteredPoints.length}</strong> {filteredPoints.length === 1 ? 'posto de coleta' : 'postos de coleta'}
            {materialFilter !== 'all' && (
              <span className="ml-1 text-emerald-700">
                (filtro: {materialFilter === 'pet' ? 'PET' : 'Alumínio'})
              </span>
            )}
          </span>
          {searchQuery && (
            <span className="text-slate-400 hidden sm:inline">
              Termo: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      </section>

      {/* Componente de Mapa com OpenStreetMap */}
      <section aria-label="Mapa dos postos de coleta" className="space-y-1.5">
        <LeafletMap
          points={filteredPoints}
          selectedPointId={selectedPoint?.id}
          onSelectPoint={(pt) => setSelectedPoint(pt)}
          onViewDetails={(pt) => setDetailModalPoint(pt)}
        />
        <p className="text-[11px] text-slate-400 text-right">
          *Navegue pelos marcadores no mapa ou selecione um ponto na lista abaixo.
        </p>
      </section>

      {/* Lista Textual dos Postos de Coleta */}
      <section aria-label="Lista detalhada dos postos de coleta" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Pontos de Coleta Disponíveis ({filteredPoints.length})
          </h3>
        </div>

        {filteredPoints.length === 0 ? (
          <div
            id="empty-points-state"
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-800">
              Nenhum ponto encontrado
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos nenhum posto que atenda aos critérios da busca ou filtro selecionado. Tente pesquisar outro termo ou selecione &ldquo;Todos&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setMaterialFilter('all');
              }}
              className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              Limpar filtros de busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoints.map((point) => {
              const isSelected = point.id === selectedPoint?.id;

              return (
                <article
                  key={point.id}
                  id={`card-posto-${point.id}`}
                  className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-sm ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {point.name}
                        </h4>
                      </div>
                    </div>

                    {/* Endereço e Bairro */}
                    <div className="text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{point.address}</p>
                      <p className="text-slate-500">{point.neighborhood} • {point.city}</p>
                    </div>

                    {/* Horário */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{point.operatingHours}</span>
                    </div>

                    {/* Materiais Aceitos */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Aceita:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {point.acceptedMaterials.map((mat) => (
                          <span
                            key={mat}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/50"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botão Ver Detalhes */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      id={`btn-detalhes-${point.id}`}
                      onClick={() => {
                        setSelectedPoint(point);
                        setDetailModalPoint(point);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 px-3 py-2 text-xs font-bold text-slate-700 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                    >
                      Ver detalhes
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de Detalhes do Ponto */}
      {detailModalPoint && (
        <div
          id="modal-detalhes-posto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-posto-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDetailModalPoint(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo do Modal */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="modal-posto-title" className="text-lg font-bold text-slate-900">
                    {detailModalPoint.name}
                  </h3>
                  <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Ponto Ativo de Coleta
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="btn-fechar-modal-detalhes"
                onClick={() => setDetailModalPoint(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                aria-label="Fechar detalhes do ponto"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Informações Obrigatórias: Endereço, Horário, Descrição, Materiais Aceitos */}
            <div className="space-y-3.5 text-xs text-slate-600">
              <div>
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Endereço
                </span>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {detailModalPoint.address}
                </p>
                <p className="text-slate-500">
                  {detailModalPoint.neighborhood} — {detailModalPoint.city}
                </p>
              </div>

              <div>
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Horário de Funcionamento
                </span>
                <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  {detailModalPoint.operatingHours}
                </div>
              </div>

              <div>
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Descrição do Local
                </span>
                <p className="mt-0.5 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {detailModalPoint.description || 'Ponto credenciado pelo EcoRetorna para descarte correto.'}
                </p>
              </div>

              <div>
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1.5">
                  Materiais Aceitos
                </span>
                <div className="flex flex-wrap gap-2">
                  {detailModalPoint.acceptedMaterials.map((mat) => (
                    <span
                      key={mat}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoint(detailModalPoint);
                  setDetailModalPoint(null);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Localizar no Mapa
              </button>
              <button
                type="button"
                onClick={() => setDetailModalPoint(null)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nota Informativa sobre Sensores / Hardware */}
      <div
        id="notice-hardware-simulation"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-2.5"
      >
        <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          *Os postos de coleta apresentados são demonstrativos e servem exclusivamente para consulta de localização e horários. Não há conexão ou agendamento telemétrico com máquinas físicas nesta etapa.
        </p>
      </div>
    </div>
  );
};

