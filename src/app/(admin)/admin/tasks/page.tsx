"use client";

import { useState } from 'react';
import { 
  MoreVertical, Filter, Search, Plus, 
  MessageSquare, ThumbsUp, Calendar, User, ClipboardList 
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { AdminLayout } from '../layout';
import { cn } from '@/lib/utils';

export default function AdminTasks() {
  const { issues, updateIssueStatus } = useAppContext();
  
  const columns = [
    { id: 'open', title: 'Unassigned', color: 'bg-red-500', header: 'border-t-red-500' },
    { id: 'assigned', title: 'Assigned', color: 'bg-orange-500', header: 'border-t-orange-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500', header: 'border-t-blue-500' },
    { id: 'resolved', title: 'Resolved', color: 'bg-green-500', header: 'border-t-green-500' },
  ];

  const getIssuesByStatus = (status: string) => {
    return issues.filter(i => i.status === status);
  };

  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedIssueId(id);
  };

  const handleDrop = (status: string) => {
    if (draggedIssueId) {
      updateIssueStatus(draggedIssueId, status);
      setDraggedIssueId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden">
        <div className="flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Task Management</h1>
            <p className="text-muted-foreground mt-1">Manage workloads and system workflows via Kanban</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input placeholder="Search tasks..." className="pl-9 py-2 rounded-xl border-border bg-white text-sm" />
            </div>
            <button className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
               <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {columns.map((col) => {
            const columnIssues = getIssuesByStatus(col.id);
            return (
              <div 
                key={col.id} 
                className="w-80 flex flex-col shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
                <div className={cn(
                  "flex items-center justify-between mb-4 pb-2 border-t-4 bg-white/50 backdrop-blur rounded-b-xl px-4 py-3 shadow-sm",
                  col.header
                )}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", col.color)}></div>
                    <h3 className="font-black text-primary text-sm uppercase tracking-wider">{col.title}</h3>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{columnIssues.length}</span>
                  </div>
                  <button className="text-slate-400 hover:text-primary"><Plus className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-1 no-scrollbar min-h-[500px]">
                  {columnIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      draggable
                      onDragStart={() => handleDragStart(issue.id)}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-accent/30 transition-all cursor-grab active:cursor-grabbing group animate-in fade-in slide-in-from-bottom duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                         <div className="text-[10px] font-bold text-slate-400 tracking-widest">#{issue.id}</div>
                         <PriorityBadge priority={issue.priority as any} className="scale-75 origin-right" />
                      </div>
                      
                      <h4 className="font-bold text-primary leading-tight mb-2 group-hover:text-accent transition-colors">{issue.title}</h4>
                      
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center text-sm shadow-sm border border-white">
                          {CATEGORIES.find(c => c.name === issue.category)?.icon}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{issue.category}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1 text-slate-400">
                             <ThumbsUp className="w-3 h-3" />
                             <span className="text-[10px] font-bold">{issue.upvotes}</span>
                           </div>
                           <div className="flex items-center gap-1 text-slate-400">
                             <MessageSquare className="w-3 h-3" />
                             <span className="text-[10px] font-bold">{issue.comments.length}</span>
                           </div>
                        </div>
                        
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-accent border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                             {issue.assignedTo ? issue.assignedTo[0] : <User className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnIssues.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-20 border-2 border-dashed border-slate-200 rounded-3xl">
                       <ClipboardList className="w-8 h-8 mb-2" />
                       <span className="text-xs font-bold">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
