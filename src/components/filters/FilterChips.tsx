import { X } from 'lucide-react';
import React from 'react';

// Define a flexible interface for the filters object.
interface IFilters {
  status?: string[];
  category?: string[];
  priority?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any; // Allow other dynamic keys
}

// Define the shape of the default filters for resetting.
const defaultFilters: IFilters = { 
  status: [], 
  category: [], 
  priority: [], 
  sortBy: 'newest', 
  sortOrder: 'desc' 
};

interface FilterChipsProps {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, setFilters }) => {
  const activeFilters = Object.entries(filters).filter(([, value]) => 
    (Array.isArray(value) && value.length > 0) || 
    (typeof value === 'string' && value && value !== 'All' && value !== 'newest')
  );

  if (activeFilters.length === 0) return null;

  const removeFilter = (key: string, valueToRemove?: string) => {
    const currentValues = filters[key];
    if (Array.isArray(currentValues) && valueToRemove) {
      const newValues = currentValues.filter(v => v !== valueToRemove);
      setFilters({ ...filters, [key]: newValues });
    } else {
      // Reset to default for known non-array filters, or remove the key if it's dynamic
      const newFilters = { ...filters };
      if (defaultFilters.hasOwnProperty(key)) {
        newFilters[key] = defaultFilters[key];
      } else {
        delete newFilters[key];
      }
      setFilters(newFilters);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <span className="text-sm font-semibold">Active Filters:</span>
      {activeFilters.map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v: string) => (
            <div key={`${key}-${v}`} className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
              <span>{v}</span>
              <button onClick={() => removeFilter(key, v)} className="ml-1.5 text-gray-500 hover:text-gray-700">
                <X size={14} />
              </button>
            </div>
          ));
        }
        // This will render chips for string-based filters like technician
        return (
          <div key={key} className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
            <span>{`${key}: ${value}`}</span>
            <button onClick={() => removeFilter(key)} className="ml-1.5 text-gray-500 hover:text-gray-700">
              <X size={14} />
            </button>
          </div>
        );
      })}
       <button 
        onClick={() => setFilters(defaultFilters)}
        className="text-accent text-sm font-bold hover:underline ml-2"
      >
        Clear All
      </button>
    </div>
  );
};

export default FilterChips;
