import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
  Bell,
  MapPin,
  Clock,
  Tag,
  Filter,
  Eye,
  X,
  Info,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react';
import { ECO_EVENTS_AND_ALERTS } from '../data/mockData';
import { EcoEventAlert, EcoItemCategory, EcoItemType } from '../types';
import { StorageService } from '../services/storage';

export const EventsPage: React.FC = () => {
  // Filtros principais
  const [selectedType, setSelectedType] = useState<'all' | EcoItemType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Estado de alertas lidos persistidos
  const [readAlertIds, setReadAlertIds] = useState<string[]>(() =>
    StorageService.getReadAlerts()
  );

  // Modal de Detalhes
  const [selectedItem, setSelectedItem] = useState<EcoEventAlert | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Sincronizar leitura de alertas no localStorage
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setReadAlertIds((prev) => {
      const isRead = prev.includes(id);
      const next = isRead ? prev.filter((item) => item !== id) : [...prev, id];
      StorageService.saveReadAlerts(next);
      return next;
    });
  };

  const handleMarkAllAlertsRead = () => {
    const allAlertIds = ECO_EVENTS_AND_ALERTS.filter((i) => i.type === 'alerta').map(
      (i) => i.id
    );
    setReadAlertIds(allAlertIds);
    StorageService.saveReadAlerts(allAlertIds);
  };

  // Gerenciamento de foco do modal
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      // Se for alerta e ainda não lido, marca como lido ao abrir detalhes
      if (selectedItem.type === 'alerta' && !readAlertIds.includes(selectedItem.id)) {
        setReadAlertIds((prev) => {
          const next = [...prev, selectedItem.id];
          StorageService.saveReadAlerts(next);
          return next;
        });
      }
      setTimeout(() => {
        modalCloseBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  // Contadores
  const totalEvents = ECO_EVENTS_AND_ALERTS.filter((i) => i.type === 'evento').length;
  const totalAlerts = ECO_EVENTS_AND_ALERTS.filter((i) => i.type === 'alerta').length;
  const unreadAlertsCount = ECO_EVENTS_AND_ALERTS.filter(
    (i) => i.type === 'alerta' && !readAlertIds.includes(i.id)
  ).length;

  // Filtragem de dados
  const filteredItems = ECO_EVENTS_AND_ALERTS.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  const categories: string[] = [
    'all',
    'Reciclagem',
    'Sustentabilidade',
    'Coleta seletiva',
  ];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Reciclagem':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Sustentabilidade':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Coleta seletiva':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Mobilização e Informação
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Eventos & Alertas
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Confira ações e informações relacionadas à sustentabilidade.
        </p>
      </div>

      {/* Barra de Filtros */}
      <section
        id="filters-section"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-xs"
        aria-label="Filtros de eventos e alertas"
      >
        {/* Filtro por Tipo */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar por tipo de conteúdo">
          <button
            type="button"
            id="tab-all-items"
            role="tab"
            aria-selected={selectedType === 'all'}
            onClick={() => setSelectedType('all')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
              selectedType === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            Todos ({ECO_EVENTS_AND_ALERTS.length})
          </button>

          <button
            type="button"
            id="tab-events-only"
            role="tab"
            aria-selected={selectedType === 'evento'}
            onClick={() => setSelectedType('evento')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
              selectedType === 'evento'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Próximos Eventos ({totalEvents})
          </button>

          <button
            type="button"
            id="tab-alerts-only"
            role="tab"
            aria-selected={selectedType === 'alerta'}
            onClick={() => setSelectedType('alerta')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
              selectedType === 'alerta'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            Alertas ({totalAlerts})
            {unreadAlertsCount > 0 && (
              <span className="ml-0.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-black text-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Filtro por Categoria e Ação de Alertas */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <label htmlFor="category-select" className="sr-only">
              Filtrar por Categoria
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:bg-white focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Reciclagem">Reciclagem</option>
              <option value="Sustentabilidade">Sustentabilidade</option>
              <option value="Coleta seletiva">Coleta seletiva</option>
            </select>
          </div>

          {selectedType === 'alerta' && unreadAlertsCount > 0 && (
            <button
              type="button"
              id="mark-all-read-btn"
              onClick={handleMarkAllAlertsRead}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="Marcar todos os alertas demonstrativos como lidos"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Marcar todos como lidos
            </button>
          )}
        </div>
      </section>

      {/* Lista / Grid de Cards */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <Info className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="mt-2 text-base font-bold text-slate-800">
            Nenhum item encontrado
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Tente selecionar outra categoria ou visualizar todos os registros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('all');
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredItems.map((item) => {
            const isAlert = item.type === 'alerta';
            const isRead = isAlert && readAlertIds.includes(item.id);

            return (
              <article
                key={item.id}
                id={`card-${item.id}`}
                className={`flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-sm ${
                  isAlert && !isRead
                    ? 'border-amber-200/80 bg-amber-50/10'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Topo do Card: Tipo e Categoria */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        <Tag className="h-3 w-3" aria-hidden="true" />
                        {item.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isAlert
                            ? 'bg-amber-100/70 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {isAlert ? (
                          <Bell className="h-3 w-3 text-amber-700" aria-hidden="true" />
                        ) : (
                          <CalendarDays className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                        )}
                        {isAlert ? 'Alerta Informativo' : 'Evento Comunitário'}
                      </span>
                    </div>

                    {/* Status de lido para alertas */}
                    {isAlert && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(item.id, e)}
                        className={`text-[11px] font-medium transition ${
                          isRead
                            ? 'text-slate-400 hover:text-slate-600'
                            : 'text-amber-700 font-bold hover:underline'
                        }`}
                        title={isRead ? 'Marcar como não lido' : 'Marcar como lido'}
                      >
                        {isRead ? 'Lido' : '• Não lido'}
                      </button>
                    )}
                  </div>

                  {/* Título do Card */}
                  <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* Descrição Curta */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Rodapé do Card com Data, Horário, Local e Botão Ver Detalhes */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {/* Data e Horário */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-slate-800">
                        {item.date}
                        {item.time ? ` • ${item.time}` : ''}
                      </span>
                    </div>

                    {/* Local */}
                    {item.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-slate-600">{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Ação: Ver detalhes */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Iniciativa demonstrativa
                    </span>
                    <button
                      type="button"
                      id={`btn-details-${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Nota Informativa sobre Notificações */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-slate-700">
            Aviso sobre notificações e comunicados
          </p>
          <p>
            As ações, oficinas e alertas exibidos nesta página são demonstrativos e servem para fins de engajamento do participante.
            O EcoRetorna não dispara notificações push no navegador, não realiza cobranças e não exige inscrição obrigatória.
          </p>
        </div>
      </div>

      {/* Modal Acessível de Detalhes do Evento ou Alerta */}
      {selectedItem && (
        <div
          id="item-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-details-title"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="pr-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryBadgeClass(
                    selectedItem.category
                  )}`}
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {selectedItem.category}
                </span>
                <h3
                  id="modal-details-title"
                  className="mt-2 text-xl font-bold text-slate-900 leading-snug"
                >
                  {selectedItem.title}
                </h3>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                id="modal-close-btn"
                onClick={() => setSelectedItem(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-600"
                aria-label="Fechar detalhes"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Conteúdo Completo */}
            <div className="py-4 space-y-4 text-sm text-slate-700">
              {/* Informações de Data, Hora e Local */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-bold">Data:</span> {selectedItem.date}
                    {selectedItem.time && <span> • Horário: {selectedItem.time}</span>}
                  </div>
                </div>

                {selectedItem.location && (
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold">Local:</span> {selectedItem.location}
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição Completa */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Descrição Completa
                </h4>
                <p className="leading-relaxed text-slate-700 text-sm">
                  {selectedItem.fullDescription || selectedItem.description}
                </p>
              </div>

              {/* Nota demonstrativa explícita */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-900 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  Esta atividade tem caráter comunitário e educativo. Não há necessidade de inscrição prévia, compra de ingressos ou pagamento de taxas.
                </p>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
