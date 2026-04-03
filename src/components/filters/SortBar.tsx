import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface SortBarProps {
  filters: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  setFilters: (filters: any) => void;
}

const SortBar: React.FC<SortBarProps> = ({ filters, setFilters }) => {

  return (
    <div className="flex justify-end items-center gap-4 mb-4">
      <Select 
        value={filters.sortBy}
        onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Most Recent</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={filters.sortOrder}
        onValueChange={(value) => setFilters({ ...filters, sortOrder: value as 'asc' | 'desc' })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortBar;
