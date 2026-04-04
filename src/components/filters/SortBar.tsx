import React from 'react';

interface SortBarProps {
  filters: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  handleFilterChange: (key: string, value: any) => void;
}

const SortBar: React.FC<SortBarProps> = ({ filters, handleFilterChange }) => {

  return (
    <div className="flex justify-end items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-bold uppercase">Sort By:</span>
        <select 
          value={filters.sortBy} 
          onChange={(e) => handleFilterChange('sortBy', e.target.value)} 
          className="border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-accent bg-white min-w-[150px]"
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="upvotes">Upvotes</option>
          <option value="submissionDate">Submission Date</option>
          <option value="status">Status</option>
        </select>
        
        <button 
          onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')} 
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 transition-colors font-medium shadow-sm"
        >
          {filters.sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
        </button>
      </div>
    </div>
  );
};

export default SortBar;

