import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';

interface AdminFilterPanelProps {
  filters: {
    status: string[];
    category?: string[];
    priority: string[];
    technician: string;
    department: string;
    fromDate: string;
    toDate: string;
    upvotes: number;
  };
  handleFilterChange: (key: string, value: any) => void;
  clearAll: () => void;
  technicians: { id: string; name: string }[];
}

const AdminFilterPanel: React.FC<AdminFilterPanelProps> = ({ filters, handleFilterChange, clearAll, technicians }) => {
  const statuses = ['open', 'assigned', 'in_progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const departments = ['Roads', 'Water', 'Waste', 'Lighting', 'Parks'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <label className="block">
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">By Technician</div>
          <select 
            value={filters.technician} 
            onChange={(e) => handleFilterChange('technician', e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
          >
            <option>All</option>
            {technicians.map((t) => <option key={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">By Department</div>
          <select 
            value={filters.department} 
            onChange={(e) => handleFilterChange('department', e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
          >
            <option>All</option>
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">Upvotes (min: {filters.upvotes}+)</div>
          <input 
            value={filters.upvotes} 
            type="range" 
            min={0} 
            max={200} 
            onChange={(e) => handleFilterChange('upvotes', Number(e.target.value))} 
            className="w-full accent-accent" 
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">Status</div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((stat) => {
              const isSelected = filters.status.includes(stat);
              return (
                <button 
                  key={stat} 
                  onClick={() => {
                    handleFilterChange('status', isSelected 
                      ? filters.status.filter(s => s !== stat) 
                      : [...filters.status, stat]);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-semibold ${isSelected ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'}`}
                >
                  {stat.replace('_', ' ').toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">Priority</div>
          <div className="flex flex-wrap gap-2">
            {priorities.map((p) => {
              const isSelected = filters.priority.includes(p);
              return (
                <button 
                  key={p} 
                  onClick={() => {
                    handleFilterChange('priority', isSelected 
                      ? filters.priority.filter(x => x !== p) 
                      : [...filters.priority, p]);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-semibold ${isSelected ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'}`}
                >
                  {p.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
        <label>
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">From Date</div>
          <input 
            type="date" 
            value={filters.fromDate} 
            onChange={(e) => handleFilterChange('fromDate', e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-accent" 
          />
        </label>
        <label>
          <div className="text-xs text-slate-500 font-bold uppercase mb-2">To Date</div>
          <input 
            type="date" 
            value={filters.toDate} 
            onChange={(e) => handleFilterChange('toDate', e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-accent" 
          />
        </label>
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filter your issue queue efficiently.
        </div>
        <button onClick={clearAll} className="text-accent hover:text-accent-foreground underline text-sm font-bold transition-colors">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default AdminFilterPanel;

