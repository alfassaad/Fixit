
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/data/mockData'; // Assuming CATEGORIES is available

interface AdminFilterPanelProps {
  filters: {
    status?: string[];
    category?: string[];
    priority?: string[];
    technician?: string;
  };
  setFilters: (filters: any) => void;
  technicians: { id: string; name: string }[];
}

const AdminFilterPanel: React.FC<AdminFilterPanelProps> = ({ filters, setFilters, technicians }) => {
  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters({ ...filters, [key]: value });
  };

  const statuses = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <SlidersHorizontal className="text-primary" />
        <h3 className="text-xl font-bold text-primary">Filter & Sort Options</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button 
                key={s}
                onClick={() => {
                  const current = filters.status || [];
                  const updated = current.includes(s) ? current.filter(i => i !== s) : [...current, s];
                  handleFilterChange('status', updated);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filters.status?.includes(s) ? 'bg-accent text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <Select onValueChange={(value) => handleFilterChange('category', value === 'all' ? [] : [value])}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Priority</label>
          <div className="flex flex-wrap gap-2">
            {priorities.map(p => (
              <button 
                key={p}
                onClick={() => {
                  const current = filters.priority || [];
                  const updated = current.includes(p) ? current.filter(i => i !== p) : [...current, p];
                  handleFilterChange('priority', updated);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filters.priority?.includes(p) ? 'bg-accent text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Technician Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Assigned Technician</label>
          <Select onValueChange={(value) => handleFilterChange('technician', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Technicians" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterPanel;
