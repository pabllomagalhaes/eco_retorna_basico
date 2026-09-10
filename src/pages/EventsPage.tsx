import React, { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Tag,
  Filter,
  Users,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { ECO_EVENTS } from '../data/mockData';

export const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Mutirão', 'Oficina', 'Campanha', 'Coleta Especial'];

  const filteredEvents = selectedCategory === 'all'
    ? ECO_EVENTS
    : ECO_EVENTS.filter((e) => e.category === selectedCategory);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Mutirão':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Oficina':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Campanha':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Coleta Especial':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Mobilização Comunitária
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          Eventos & Alertas
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Fique por dentro de mutirões, oficinas de reciclagem e campanhas de coleta seletiva na sua região.
        </p>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex flex-wrap items-center gap-2" role="region" aria-label="Filtro de eventos">
        <Filter className="h-4 w-4 text-slate-400 mr-1" aria-hidden="true" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            } focus-visible:outline-2 focus-visible:outline-emerald-600`}
          >
            {cat === 'all' ? 'Todos os Eventos' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Cards dos Eventos */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredEvents.map((evt) => (
          <article
            key={evt.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryColor(
                    evt.category
                  )}`}
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {evt.category}
                </span>

                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />
                  Iniciativa Aberta
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
                {evt.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {evt.description}
              </p>
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-800">{evt.date}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{evt.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Nota sobre notificações push */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          *Informações e programações de eventos demonstrativos. O EcoRetorna não dispara notificações push no navegador nesta versão.
        </p>
      </div>
    </div>
  );
};
