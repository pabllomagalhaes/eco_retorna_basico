import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { CollectionPoint } from '../types';

interface LeafletMapProps {
  points: CollectionPoint[];
  selectedPointId?: string;
  onSelectPoint: (point: CollectionPoint) => void;
  onViewDetails?: (point: CollectionPoint) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  points,
  selectedPointId,
  onSelectPoint,
  onViewDetails,
}) => {
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  // Inicialização única do mapa
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        const L = await import('leaflet');
        if (!isMounted) return;
        leafletModuleRef.current = L;

        const mapContainer = document.getElementById('leaflet-map-element');
        if (!mapContainer) return;

        // Se já foi inicializado no elemento, não recriar
        if ((mapContainer as any)._leaflet_id && mapRef.current) {
          return;
        }

        const map = L.map('leaflet-map-element', {
          center: [-25.435, -49.275],
          zoom: 12,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapRef.current = map;
        markersLayerRef.current = markersLayer;

        setMapLoaded(true);
      } catch (err) {
        console.error('Falha ao carregar mapa Leaflet:', err);
        setMapError(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Atualização reativa de marcadores quando os pontos ou o ponto selecionado mudarem
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !leafletModuleRef.current) {
      return;
    }

    const L = leafletModuleRef.current;
    const markersLayer = markersLayerRef.current;
    const map = mapRef.current;

    markersLayer.clearLayers();

    if (points.length === 0) return;

    const bounds: [number, number][] = [];

    points.forEach((point) => {
      const isSelected = point.id === selectedPointId;
      bounds.push([point.latitude, point.longitude]);

      const customIcon = L.divIcon({
        className: 'custom-eco-marker',
        html: `
          <div style="
            background-color: ${isSelected ? '#047857' : '#059669'};
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
            color: white;
            font-size: ${isSelected ? '16px' : '13px'};
            cursor: pointer;
            transition: transform 0.2s ease;
          " title="${point.name}">
            ♻
          </div>
        `,
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 18] : [15, 15],
      });

      const marker = L.marker([point.latitude, point.longitude], {
        icon: customIcon,
      }).addTo(markersLayer);

      const materialsHtml = point.acceptedMaterials
        .map(
          (m) =>
            `<span style="display:inline-block;background:#ecfdf5;color:#065f46;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600;margin-right:4px;">${m}</span>`
        )
        .join('');

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 2px;">
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${point.name}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${point.address}, ${point.neighborhood}</p>
          <p style="font-size: 11px; color: #047857; margin: 0 0 6px 0; font-weight: 600;">🕒 ${point.operatingHours}</p>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 2px;">Aceita:</span>
            ${materialsHtml}
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectPoint(point);
      });
    });

    // Se houver um ponto selecionado específico, centralizar nele com zoom suave
    if (selectedPointId) {
      const selected = points.find((p) => p.id === selectedPointId);
      if (selected) {
        map.panTo([selected.latitude, selected.longitude]);
      }
    }
  }, [points, selectedPointId, onSelectPoint, onViewDetails]);

  if (mapError) {
    return (
      <div
        id="map-fallback-notice"
        className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-center text-amber-900"
        role="alert"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-2">
          📍
        </span>
        <p className="font-semibold text-sm sm:text-base">
          Não foi possível carregar o mapa neste momento. Você ainda pode consultar os pontos de coleta na lista abaixo.
        </p>
        <p className="mt-1 text-xs text-amber-700">
          A lista textual completa continua disponível com endereços, horários e materiais aceitos.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xs z-10">
      <div id="leaflet-map-element" className="h-full w-full" tabIndex={0} aria-label="Mapa interativo dos postos de coleta" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-xs text-slate-500 font-medium">
          Carregando mapa dos postos...
        </div>
      )}
    </div>
  );
};

