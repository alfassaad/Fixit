"use client";

import { useState } from 'react';
import { Search, ThumbsUp, MapPin, Clock, ChevronRight, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import CitizenFilterDrawer from '@/components/filters/CitizenFilterDrawer';
import FilterChips from '@/components/filters/FilterChips';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const router = useRouter();
  const { issues, upvoteIssue } = useAppContext();
  const [search, setSearch] = useState('');
  const [quickViewIssue, setQuickViewIssue] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    status: [] as string[],
    category: [] as string[],
    priority: [] as string[],
    sortBy: 'newest',
    myReportsOnly: false
  });

  const filtered = issues
    .filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(issue.status.toLowerCase());
      const matchesCategory = filters.category.length === 0 || filters.category.includes(issue.category);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes(issue.priority);
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.reportedAt || b.created_at).getTime() - new Date(a.reportedAt || a.created_at).getTime();
      if (filters.sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      if (filters.sortBy === 'priority') {
        const order = ['critical', 'high', 'medium', 'low'];
        return order.indexOf(a.priority) - order.indexOf(b.priority);
      }
      return 0;
    });

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b px-4 py-6 sticky top-0 z-20 space-y-4 shadow-sm">
          <h1 className="text-2xl font-black text-primary tracking-tight">Explore Community</h1>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search issues..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl shadow-inner focus-visible:ring-accent"
              />
            </div>
            <CitizenFilterDrawer filters={filters as any} setFilters={setFilters as any} />
          </div>

          <div className="mt-4">
            <FilterChips filters={filters} setFilters={setFilters as any} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mt-2">
             <button 
                onClick={() => setFilters(prev => ({ ...prev, category: [] }))}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  filters.category.length === 0 ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
             >
                All Categories
             </button>
             {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => {
                    const hasCat = filters.category.includes(cat.name);
                    setFilters(prev => ({ ...prev, category: hasCat ? prev.category.filter(c => c !== cat.name) : [cat.name] }))
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                    filters.category.includes(cat.name) ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <span className="text-[10px]">{cat.icon}</span>
                  {cat.name}
                </button>
             ))}
          </div>
        </div>

        <div className="p-4 space-y-4 pb-24">
          {filtered.length > 0 ? filtered.map((issue) => (
            <div key={issue.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => setQuickViewIssue(issue)}>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 shrink-0">
                {CATEGORIES.find(c => c.name === issue.category)?.icon || '❓'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <StatusBadge status={issue.status as any} className="scale-75 origin-left" />
                  <div className="flex items-center gap-1.5 text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                     <ThumbsUp className="w-3 h-3 fill-accent/40" />
                     <span className="text-xs font-bold">{issue.upvotes}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 truncate group-hover:text-accent transition-colors mt-1">{issue.title}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{issue.location.address}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(issue.reportedAt || issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
               <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                  <Search className="w-10 h-10 text-slate-400" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-700">No results found</h3>
                  <p className="text-sm text-slate-500 mt-1">Adjust your filters to see more issues</p>
               </div>
               <Button variant="outline" onClick={() => setFilters({ status: [], category: [], priority: [], sortBy: 'newest', myReportsOnly: false })}>Clear Filters</Button>
            </div>
          )}

          {quickViewIssue && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end transition-opacity duration-300">
              <div className="w-[85vw] max-w-md h-full bg-slate-50 p-6 overflow-auto shadow-2xl animate-slide-in-right">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-primary">Issue {quickViewIssue.id}</h3>
                  <button onClick={() => setQuickViewIssue(null)} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                   <div className="flex justify-between items-start">
                     <StatusBadge status={quickViewIssue.status} />
                     <PriorityBadge priority={quickViewIssue.priority} />
                   </div>
                   <p className="font-bold text-lg text-slate-800 leading-tight">{quickViewIssue.title}</p>
                   {quickViewIssue.photos && quickViewIssue.photos.length > 0 && (
                     <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden mt-2 relative border border-slate-200">
                       <img src={quickViewIssue.photos[0]} alt="Issue" className="w-full h-full object-cover" />
                     </div>
                   )}
                   <p className="text-sm text-slate-600 leading-relaxed">{quickViewIssue.description}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {CATEGORIES.find(c => c.name === quickViewIssue.category)?.icon || '❓'}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</p>
                      <p className="font-medium text-sm text-slate-700">{quickViewIssue.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                      <p className="font-medium text-sm text-slate-700">{quickViewIssue.location?.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upvotes</p>
                        <p className="font-medium text-sm text-slate-700">{quickViewIssue.upvotes} Citizens</p>
                      </div>
                      <Button 
                        variant={quickViewIssue.voted ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => { 
                          upvoteIssue(quickViewIssue.issue_id || quickViewIssue.id); 
                          setQuickViewIssue({
                            ...quickViewIssue, 
                            upvotes: quickViewIssue.upvotes + (quickViewIssue.voted ? -1 : 1),
                            voted: !quickViewIssue.voted
                          }); 
                        }} 
                        className="rounded-xl h-8"
                      >
                        {quickViewIssue.voted ? "Remove Upvote" : "Upvote"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                   <Button 
                     className="w-full rounded-2xl h-12 text-sm font-bold shadow-md shadow-primary/20"
                     onClick={() => router.push(`/issues/${quickViewIssue.issue_id || quickViewIssue.id}`)}
                   >
                     Open Full Detail
                   </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
