import React, { useEffect, useState } from 'react';
import { CollectionPoint } from '../types';

interface LeafletMapProps {
  points: CollectionPoint[];
  selectedPointId?: string;
  onSelectPoint: (point: CollectionPoint) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  points,
  selectedPointId,
  onSelectPoint,
}) => {
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let mapInstance: any = null;

    async function initMap() {
      try {
        const L = await import('leaflet');

        const mapContainer = document.getElementById('leaflet-map-element');
        if (!mapContainer) return;

        // Limpar container se já possuir mapa
        if ((mapContainer as any)._leaflet_id) {
          return;
        }

        // Centro inicial (Curitiba)
        const map = L.map('leaflet-map-element', {
          center: [-25.435, -49.275],
          zoom: 13,
          scrollWheelZoom: false,
        });
        mapInstance = map;

        // OpenStreetMap tiles (sem API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores',
          maxZoom: 19,
        }).addTo(map);

        // Marcadores usando DivIcon estilizado
        points.forEach((point) => {
          const isSelected = point.id === selectedPointId;

          const customIcon = L.divIcon({
            className: 'custom-eco-marker',
            html: `
              <div style="
                background-color: ${isSelected ? '#047857' : '#059669'};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
                color: white;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
              ">
                ♻
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([point.latitude, point.longitude], {
            icon: customIcon,
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="font-size: 14px; color: #064e3b; display: block; margin-bottom: 4px;">${point.name}</strong>
              <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0;">${point.address} - ${point.neighborhood}</p>
              <span style="font-size: 11px; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${point.operatingHours}</span>
            </div>
          `);

          marker.on('click', () => {
            onSelectPoint(point);
          });
        });

        setMapLoaded(true);
      } catch (err) {
        console.error('Falha ao inicializar mapa Leaflet:', err);
        setMapError(true);
      }
    }

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [points]);

  if (mapError) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-6 text-center text-slate-600">
        <p className="font-semibold text-sm">Visualização em mapa indisponível no momento.</p>
        <p className="mt-1 text-xs text-slate-500">
          Você pode consultar todos os pontos de coleta na lista detalhada abaixo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xs z-10">
      <div id="leaflet-map-element" className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-xs text-slate-500">
          Carregando mapa dos postos...
        </div>
      )}
    </div>
  );
};
