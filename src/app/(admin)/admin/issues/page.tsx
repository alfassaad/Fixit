"use client";

import { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { Filter, X, ChevronRight, Save, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminFilterPanel from '@/components/filters/AdminFilterPanel';
import SortBar from '@/components/filters/SortBar';
import { useToast } from '@/hooks/use-toast';

export default function AdminIssuesPage() {
  const { issues, updateIssueStatus, assignIssue, refreshIssues } = useAppContext();
  const { toast } = useToast();

  const [showFilters, setShowFilters] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [filters, setFilters] = useState({
    technician: 'All',
    department: 'All',
    status: [] as string[],
    priority: [] as string[],
    fromDate: '',
    toDate: '',
    upvotes: 0,
    sortBy: 'priority',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  const [quickViewIssue, setQuickViewIssue] = useState<any>(null);

  // Fetch real technicians from DB
  useEffect(() => {
    const fetchTechs = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name, role')
        .eq('role', 'technician');
      if (data) setTechnicians(data);
    };
    fetchTechs();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue: any) => {
        if (filters.technician !== 'All' && issue.assignedTo !== filters.technician) return false;
        if (filters.department !== 'All' && issue.category?.toLowerCase().indexOf(filters.department.toLowerCase()) < 0) return false;
        if (filters.status.length && !filters.status.includes(issue.status)) return false;
        if (filters.priority.length && !filters.priority.includes(issue.priority)) return false;
        if (filters.fromDate && new Date(issue.reportedAt || issue.created_at) < new Date(filters.fromDate)) return false;
        if (filters.toDate && new Date(issue.reportedAt || issue.created_at) > new Date(filters.toDate)) return false;
        if (issue.upvotes < filters.upvotes) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        let v1: any = a[filters.sortBy] ?? a.upvotes;
        let v2: any = b[filters.sortBy] ?? b.upvotes;
        if (filters.sortBy === 'submissionDate') {
          v1 = new Date(a.reportedAt || a.created_at).getTime();
          v2 = new Date(b.reportedAt || b.created_at).getTime();
        }
        if (filters.sortBy === 'dueDate') {
          v1 = new Date(a.dueDate || 0).getTime();
          v2 = new Date(b.dueDate || 0).getTime();
        }
        if (typeof v1 === 'string') v1 = v1.toLowerCase();
        if (typeof v2 === 'string') v2 = v2.toLowerCase();
        if (v1 < v2) return filters.sortOrder === 'asc' ? -1 : 1;
        if (v1 > v2) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [issues, filters]);

  const handleSaveChanges = async () => {
    if (!quickViewIssue) return;
    setIsSaving(true);
    try {
      // 1. Update Status
      await updateIssueStatus(quickViewIssue.issue_id || quickViewIssue.id, quickViewIssue.status);
      
      // 2. Assign Technician if changed
      const original = issues.find(i => (i.issue_id || i.id) === (quickViewIssue.issue_id || quickViewIssue.id));
      if (quickViewIssue.assigned_to_id && quickViewIssue.assigned_to_id !== original?.assigned_to_id) {
         await assignIssue(quickViewIssue.issue_id || quickViewIssue.id, quickViewIssue.assigned_to_id);
      }

      toast({
        title: "Success",
        description: "Issue updated effectively.",
      });
      
      await refreshIssues();
      setQuickViewIssue(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update issue. Check technical logs.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearAll = () => {
    setFilters({
      technician: 'All',
      department: 'All',
      status: [],
      priority: [],
      fromDate: '',
      toDate: '',
      upvotes: 0,
      sortBy: 'priority',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Issues Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review, assign, and track reports across all departments.</p>
        </div>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold transition-all hover:shadow-lg active:scale-95"
        >
          <Filter className="w-4 h-4" /> Advanced Filters
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[1000px] mb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <AdminFilterPanel 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          clearAll={clearAll} 
          technicians={technicians.map(t => ({ id: t.user_id, name: t.full_name }))} 
        />
      </div>

      <SortBar filters={filters} handleFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue: any) => (
            <Card key={issue.issue_id || issue.id} className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="flex justify-between items-center gap-4 p-5">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-primary truncate max-w-md">{issue.title || issue.description}</h3>
                    <StatusBadge status={issue.status} />
                  </div>
                  <div className="text-sm text-slate-500 mt-1 font-medium">#{issue.issue_id || issue.id} • {issue.category} • {issue.assignedTo || 'Unassigned'}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{issue.upvotes || 0} Upvotes</span>
                  </div>
                </div>
                <Button variant="outline" className="font-bold h-10 px-6 rounded-xl border-slate-200" onClick={() => setQuickViewIssue(issue)}>
                   Inspect
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
             No issues matching the current filters.
          </div>
        )}
      </div>

      {quickViewIssue && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white h-full p-8 overflow-auto shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-black text-primary text-xl">Issue #{quickViewIssue.issue_id || quickViewIssue.id}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review & Management</p>
              </div>
              <button 
                onClick={() => setQuickViewIssue(null)} 
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-8 flex-1">
              <div className="space-y-4">
                <div className="font-bold text-xl text-slate-800 leading-tight">{quickViewIssue.title || quickViewIssue.description}</div>
                <div className="flex gap-2">
                  <StatusBadge status={quickViewIssue.status} />
                  <PriorityBadge priority={quickViewIssue.priority} />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 font-medium italic-none">
                  {quickViewIssue.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                  <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Category</div>
                  <div className="font-bold text-sm text-primary">{quickViewIssue.category}</div>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                  <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Reported</div>
                  <div className="font-bold text-sm text-primary">{new Date(quickViewIssue.reportedAt || quickViewIssue.created_at).toLocaleDateString()}</div>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 col-span-2">
                  <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Address</div>
                  <div className="font-bold text-sm text-primary truncate">{quickViewIssue.location?.address || 'N/A'}</div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-8 space-y-6">
                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Operational Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['open', 'assigned', 'in_progress', 'resolved', 'closed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuickViewIssue({ ...quickViewIssue, status: s })}
                        className={cn(
                          "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all",
                          quickViewIssue.status === s 
                            ? "bg-primary text-white border-primary shadow-md" 
                            : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Assign Technician</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-primary focus:ring-2 focus:ring-primary outline-none transition-all appearance-none" 
                    value={quickViewIssue.assigned_to_id || ''} 
                    onChange={(e) => setQuickViewIssue({ ...quickViewIssue, assigned_to_id: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {technicians.map((t) => (
                      <option key={t.user_id} value={t.user_id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 bg-white">
              <Button 
                className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Commit Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
