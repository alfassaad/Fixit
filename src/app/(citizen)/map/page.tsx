"use client";

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, Bell, Plus, LocateFixed, ChevronRight, ThumbsUp, MapPin, Loader2, Wrench } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Dynamically import Leaflet map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }
);

export default function MapScreen() {
  const { issues, unreadCount } = useAppContext();
  const { toast } = useToast();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [locating, setLocating] = useState(false);

  const filteredIssues = activeCategory === 'All' 
    ? issues 
    : issues.filter(i => i.category === activeCategory);

  const pins = filteredIssues.filter(i => i.location).map(i => ({
    id: i.issue_id, // Corrected from i.id to i.issue_id
    lat: i.location.lat,
    lng: i.location.lng,
    category: i.category,
    status: i.status,
    priority: i.priority
  }));

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setLocating(false);
        toast({
          title: "Location Found",
          description: "Map centered on your current position.",
        });
      },
      (error) => {
        setLocating(false);
        toast({
          title: "Location Error",
          description: error.message || "Could not determine your location.",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <CitizenLayout>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 space-y-4 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <Link href="/map" className="flex items-center gap-2 bg-white/95 backdrop-blur-sm p-2 px-3 rounded-2xl shadow-lg border border-border group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-primary tracking-tight">FixIt</span>
            </Link>
            <div className="flex gap-2">
              <Link href="/notifications" className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg border border-border relative">
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="relative pointer-events-auto">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search local issues..." 
              className="pl-10 h-11 bg-white/95 backdrop-blur-sm shadow-lg border-border rounded-xl"
            />
          </div>

          <ScrollArea className="w-full whitespace-nowrap pointer-events-auto">
            <div className="flex w-max space-x-2 pb-2">
              <button 
                onClick={() => setActiveCategory('All')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all",
                  activeCategory === 'All' ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-border"
                )}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all flex items-center gap-1.5",
                    activeCategory === cat.name ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-border"
                  )}
                >
                  <span>{cat.icon}</span>
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* The Map */}
        <div className="flex-1">
          <InteractiveMap 
            pins={pins} 
            center={mapCenter}
            onPinClick={(pin) => setSelectedIssue(issues.find(i => i.issue_id === pin.id))}
          />
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-24 left-4 z-20">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-white shadow-xl border-border hover:bg-slate-50"
            onClick={handleLocate}
            disabled={locating}
          >
            {locating ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <LocateFixed className="w-6 h-6 text-slate-700" />}
          </Button>
        </div>

        {/* FAB */}
        <div className="absolute bottom-24 right-4 z-20">
          <Link href="/report/new">
            <div className="relative group w-16 h-16 flex items-center justify-center">
              <span className="fab-ping absolute inset-0"></span>
              <Button size="icon" className="relative w-16 h-16 rounded-full bg-accent hover:bg-accent/90 shadow-2xl transition-transform active:scale-95 group-hover:scale-110 z-10">
                <Plus className="w-8 h-8 text-white" />
              </Button>
            </div>
          </Link>
        </div>

        {/* Bottom Sheet for Selected Issue */}
        {selectedIssue && (
          <div className="absolute bottom-20 left-0 right-0 z-30 p-4 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={selectedIssue.status as any} />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">#{selectedIssue.issue_id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary leading-tight">{selectedIssue.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{selectedIssue.location.address}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-accent">
                    <ThumbsUp className="w-4 h-4 fill-accent/10" />
                    <span className="text-sm font-bold">{selectedIssue.upvotes}</span>
                  </div>
                  <div className="text-slate-400 text-xs font-medium">Nearby</div>
                </div>
                <Link href={`/issues/${selectedIssue.issue_id}`}>
                  <Button className="rounded-xl h-10 px-6 font-bold shadow-lg bg-primary hover:bg-primary/90 flex items-center gap-1">
                    Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}