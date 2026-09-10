import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Info,
  Search,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { COLLECTION_POINTS } from '../data/mockData';
import { CollectionPoint } from '../types';
import { LeafletMap } from '../components/LeafletMap';

export const CollectionPointsPage: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint>(COLLECTION_POINTS[0]);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredPoints = COLLECTION_POINTS.filter((p) => {
    const q = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Rede de Entrega
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Postos & Mapa de Coleta
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Localize os pontos de entrega voluntária credenciados para descartar garrafas PET 2L e latas de alumínio.
        </p>
      </div>

      {/* Componente de Mapa com OpenStreetMap */}
      <section aria-label="Mapa interativo dos postos">
        <LeafletMap
          points={COLLECTION_POINTS}
          selectedPointId={selectedPoint.id}
          onSelectPoint={(pt) => setSelectedPoint(pt)}
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>*Mapa baseado em OpenStreetMap sem exigência de chaves de API externas.</span>
          <span>{COLLECTION_POINTS.length} postos cadastrados</span>
        </div>
      </section>

      {/* Campo de Busca Rápida */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Buscar ponto por nome, bairro ou endereço..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:border-emerald-600 focus:outline-none"
          aria-label="Buscar postos de coleta"
        />
      </div>

      {/* Lista de Postos e Card de Detalhes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista de Postos */}
        <div className="space-y-3 lg:col-span-2" role="region" aria-label="Lista de postos de coleta">
          <h3 className="text-base font-bold text-slate-900">
            Postos Disponíveis ({filteredPoints.length})
          </h3>

          {filteredPoints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              Nenhum posto encontrado com o termo pesquisado.
            </div>
          ) : (
            filteredPoints.map((point) => {
              const isSelected = point.id === selectedPoint.id;

              return (
                <button
                  type="button"
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`w-full text-left rounded-2xl border p-4 transition shadow-xs flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } focus-visible:outline-2 focus-visible:outline-emerald-600`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{point.name}</h4>
                      <p className="mt-0.5 text-xs text-slate-600">{point.address} • {point.neighborhood}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                        <span>{point.operatingHours}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`h-5 w-5 shrink-0 transition ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`} aria-hidden="true" />
                </button>
              );
            })
          )}
        </div>

        {/* Detalhes do Posto Selecionado */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Info className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900">Ficha do Ponto</h3>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Nome da Unidade</span>
            <span className="text-base font-bold text-slate-900">{selectedPoint.name}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Endereço Completo</span>
            <span className="text-xs text-slate-700 leading-relaxed">
              {selectedPoint.address}, {selectedPoint.neighborhood} - {selectedPoint.city}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Horário de Atendimento</span>
            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-0.5">
              {selectedPoint.operatingHours}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Materiais Homologados</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {selectedPoint.acceptedMaterials.map((mat) => (
                <span
                  key={mat}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {selectedPoint.notes && (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
              <strong className="block text-slate-700 font-semibold mb-0.5">Observação:</strong>
              {selectedPoint.notes}
            </div>
          )}
        </div>
      </div>

      {/* Aviso importante: Sem conexão com máquinas ou sensores */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          *Os pontos de coleta apresentados são instalações demonstrativas. Esta versão do software não realiza comunicação telemétrica com sensores ou hardware de máquinas de entrega automática.
        </p>
      </div>
    </div>
  );
};
