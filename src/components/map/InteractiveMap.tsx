"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Helper to create category-specific icons
const createCategoryIcon = (categoryName: string) => {
  const category = CATEGORIES.find(c => c.name === categoryName);
  const icon = category ? category.icon : '📍';
  const color = category ? category.color : '#3b82f6';

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl border-2 transition-transform hover:scale-110" style="border-color: ${color}; font-size: 20px;">
        ${icon}
      </div>
    `,
    className: 'custom-category-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Icon for the "Report Here" selected location
const selectedIcon = L.divIcon({
  html: `
    <div class="flex flex-col items-center">
      <div class="bg-accent text-white px-2 py-1 rounded-md text-[10px] font-black mb-1 whitespace-nowrap shadow-xl animate-bounce">
        REPORT HERE
      </div>
      <div class="w-6 h-6 bg-accent border-4 border-white rounded-full shadow-2xl"></div>
    </div>
  `,
  className: 'custom-selected-icon',
  iconSize: [80, 40],
  iconAnchor: [40, 40],
});

interface Pin {
  id: string;
  lat: number;
  lng: number;
  category: string;
  status: string;
  priority: string;
}

interface InteractiveMapProps {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
  className?: string;
  selectable?: boolean;
  onLocationSelect?: (pos: { lat: number, lng: number }) => void;
  selectedLocation?: { lat: number, lng: number } | null;
  center?: [number, number];
}

function MapEvents({ onLocationSelect, selectable }: { onLocationSelect?: (pos: { lat: number, lng: number }) => void, selectable?: boolean }) {
  useMapEvents({
    click(e) {
      if (selectable && onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ 
  pins, 
  onPinClick, 
  className, 
  selectable, 
  onLocationSelect, 
  selectedLocation,
  center
}: InteractiveMapProps) {
  
  const defaultCenter: [number, number] = [33.6844, 73.0479]; // Islamabad Center

  return (
    <div className={cn("relative w-full h-full bg-slate-100 overflow-hidden", className)}>
      <MapContainer 
        center={center || defaultCenter} 
        zoom={14} 
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {center && <ChangeView center={center} />}
        <MapEvents onLocationSelect={onLocationSelect} selectable={selectable} />

        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]}
            icon={createCategoryIcon(pin.category)}
            eventHandlers={{
              click: () => onPinClick?.(pin),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="font-bold text-primary text-sm flex items-center gap-2">
                  <span>{CATEGORIES.find(c => c.name === pin.category)?.icon}</span>
                  {pin.category}
                </div>
                <div className="text-[10px] uppercase font-black text-muted-foreground mt-1 tracking-wider">
                  Status: <span className="text-accent">{pin.status.replace('_', ' ')}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]} 
            icon={selectedIcon}
          />
        )}
      </MapContainer>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest pointer-events-none z-[1000] border border-border shadow-md">
        Islamabad — Real-time Map
      </div>
    </div>
  );
}