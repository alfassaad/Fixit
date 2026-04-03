import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';

interface CitizenFilterDrawerProps {
  filters: {
    status: string[];
    category: string[];
    sortBy: string;
  };
  setFilters: (filters: any) => void;
}

const CitizenFilterDrawer: React.FC<CitizenFilterDrawerProps> = ({ filters, setFilters }) => {
  const handleMultiSelect = (key: 'status' | 'category', value: string) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value) 
      ? currentValues.filter(v => v !== value) 
      : [...currentValues, value];
    setFilters({ ...filters, [key]: newValues });
  };

  const statuses = ['new', 'in_progress', 'resolved', 'closed'];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter & Sort</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter & Sort Options</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-8">
          {/* Sort By Options */}
          <div>
            <h4 className="font-semibold mb-3">Sort By</h4>
            <div className="flex flex-col space-y-2">
              <button 
                className={`text-left ${filters.sortBy === 'newest' ? 'font-bold text-accent' : ''}`}
                onClick={() => setFilters({...filters, sortBy: 'newest'})}
              >
                Most Recent
              </button>
              <button 
                className={`text-left ${filters.sortBy === 'upvotes' ? 'font-bold text-accent' : ''}`}
                onClick={() => setFilters({...filters, sortBy: 'upvotes'})}
              >
                Most Upvoted
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="font-semibold mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button 
                  key={s}
                  onClick={() => handleMultiSelect('status', s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filters.status.includes(s) ? 'bg-accent text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-semibold mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button 
                  key={c.name}
                  onClick={() => handleMultiSelect('category', c.name)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${filters.category.includes(c.name) ? 'bg-accent text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                  {c.icon}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
              <Button onClick={() => setFilters({ status: [], category: [], sortBy: 'newest' })} className="w-full" variant="secondary">Clear Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CitizenFilterDrawer;
