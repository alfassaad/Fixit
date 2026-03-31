
"use client";

import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';
import { cn } from '@/lib/utils';
import placeholderData from '@/app/lib/placeholder-images.json';

interface Pin {
  id: string;
  lat: number;
  lng: number;
  category: string;
  status: string;
  priority: string;
}

interface SimulatedMapProps {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
  className?: string;
  selectable?: boolean;
  onLocationSelect?: (pos: { lat: number, lng: number }) => void;
  selectedLocation?: { lat: number, lng: number } | null;
}

export function SimulatedMap({ pins, onPinClick, className, selectable, onLocationSelect, selectedLocation }: SimulatedMapProps) {
  const mapImage = placeholderData.placeholderImages.find(img => img.id === 'map-islamabad');

  // Convert lat/lng to percentages for demo mapping
  // Islamabad roughly: Lat 33.67 to 33.70, Lng 73.03 to 73.06
  const getPosition = (lat: number, lng: number) => {
    const latBase = 33.670;
    const latMax = 33.700;
    const lngBase = 73.030;
    const lngMax = 73.060;
    
    const top = 100 - ((lat - latBase) / (latMax - latBase)) * 100;
    const left = ((lng - lngBase) / (lngMax - lngBase)) * 100;
    
    return { top: `${top}%`, left: `${left}%` };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive ring-destructive/40';
      case 'assigned':
      case 'in_progress': return 'bg-warning ring-warning/40';
      case 'resolved': return 'bg-success ring-success/40';
      default: return 'bg-slate-400 ring-slate-200';
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    return CATEGORIES.find(c => c.name === categoryName)?.icon || '📍';
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectable || !onLocationSelect) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const latBase = 33.670;
    const latMax = 33.700;
    const lngBase = 73.030;
    const lngMax = 73.060;
    
    const lat = latBase + (100 - y) / 100 * (latMax - latBase);
    const lng = lngBase + x / 100 * (lngMax - lngBase);
    
    onLocationSelect({ lat, lng });
  };

  return (
    <div 
      className={cn("relative w-full h-full bg-slate-100 overflow-hidden cursor-crosshair", className)}
      onClick={handleMapClick}
    >
      {/* Map Background Image */}
      {mapImage && (
        <Image 
          src={mapImage.imageUrl} 
          alt="Map Background" 
          fill 
          className="object-cover opacity-60 grayscale-[0.2]"
          data-ai-hint={mapImage.imageHint}
        />
      )}

      {/* Grid Overlay */}
      <div className="absolute inset-0 map-grid pointer-events-none opacity-20"></div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest pointer-events-none z-10 border border-border shadow-md">
        Islamabad — Interactive Demo Map
      </div>

      {/* Pins Layer */}
      <div className="absolute inset-0 z-10">
        {pins.map((pin) => (
          <button
            key={pin.id}
            className={cn(
              "absolute w-10 h-10 -mt-5 -ml-5 flex items-center justify-center rounded-full text-white shadow-xl ring-4 transition-all hover:scale-125 hover:z-20",
              getStatusColor(pin.status)
            )}
            style={getPosition(pin.lat, pin.lng)}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick?.(pin);
            }}
          >
            <span className="text-lg">{getCategoryIcon(pin.category)}</span>
          </button>
        ))}

        {selectedLocation && (
          <div 
            className="absolute w-12 h-12 -mt-10 -ml-6 flex items-center justify-center transition-all animate-bounce"
            style={getPosition(selectedLocation.lat, selectedLocation.lng)}
          >
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent text-white px-2 py-1 rounded text-[10px] font-black mb-1 -mt-8 whitespace-nowrap shadow-xl">
                REPORT HERE
              </div>
              <div className="w-6 h-6 bg-accent border-4 border-white rounded-full shadow-2xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
