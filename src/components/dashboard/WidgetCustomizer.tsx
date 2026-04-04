'use client';

import { mockWidgets } from '@/data/mockData';
import { useAppContext } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Settings2, RotateCcw } from 'lucide-react';

export function WidgetCustomizer() {
  const { enabledWidgets, toggleWidget, setEnabledWidgets } = useAppContext() as any;

  const resetDefaults = () => {
    setEnabledWidgets(mockWidgets);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-colors pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Dashboard Layout</h3>
        </div>
        <Button variant="outline" size="sm" onClick={resetDefaults} className="h-8 text-xs font-bold gap-1 rounded-full px-3 text-slate-500 hover:text-slate-800 border-slate-200">
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
      
      <div className="space-y-3 relative z-10">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Available Widgets</p>
        
        {enabledWidgets.map((widget: any) => (
          <div 
            key={widget.id} 
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:shadow-md transition-all duration-200 group/item cursor-pointer"
            onClick={() => toggleWidget(widget.id)}
          >
            <div className="flex items-center gap-3">
              <div className="text-slate-400 group-hover/item:text-primary transition-colors">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">{widget.label}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch checked={widget.enabled} onCheckedChange={() => toggleWidget(widget.id)} className="data-[state=checked]:bg-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
