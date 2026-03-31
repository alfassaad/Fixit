
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ThumbsUp, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ExplorePage() {
  const { issues, upvoteIssue } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filtered = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || issue.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <CitizenLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b px-4 py-6 sticky top-0 z-20 space-y-4">
          <h1 className="text-2xl font-black text-primary tracking-tight">Explore Community</h1>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search issues..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl shadow-inner"
              />
            </div>
            <button className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             <button 
                onClick={() => setFilterCategory('All')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  filterCategory === 'All' ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                )}
             >
                All Issues
             </button>
             {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.name)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                    filterCategory === cat.name ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {cat.name}
                </button>
             ))}
          </div>
        </div>

        <div className="p-4 space-y-4 pb-20">
          {filtered.length > 0 ? filtered.map((issue) => (
            <Link key={issue.id} href={`/issues/${issue.id}`}>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white shrink-0">
                  {CATEGORIES.find(c => c.name === issue.category)?.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <StatusBadge status={issue.status as any} className="scale-75 origin-left" />
                    <div className="flex items-center gap-1 text-accent">
                       <ThumbsUp className="w-3 h-3 fill-accent/10" />
                       <span className="text-xs font-bold">{issue.upvotes}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-primary truncate group-hover:text-accent transition-colors">{issue.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{issue.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 text-[10px] font-bold mt-2 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>Reported 2d ago</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-accent" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
               <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">No results found</h3>
                  <p className="text-sm">Try searching for something else</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
}
