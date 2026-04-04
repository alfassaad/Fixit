'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, MessageCircle, AlertTriangle, Inbox, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'all', label: 'All', icon: Inbox },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'tasks', label: 'Tasks', icon: ShieldAlert },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'system', label: 'System', icon: Bell },
];

export default function NotificationsPage() {
  const { notifications, addNotification, markNotificationsRead } = useAppContext() as any;
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const samples = [
        { type: 'chat', title: 'New chat mention', message: 'Ali Hassan mentioned you.', time: 'just now', read: false },
        { type: 'sla', title: 'SLA warning', message: 'ISS-002 is nearing SLA breach', time: 'now', read: false },
        { type: 'upvote', title: 'Report trending', message: 'ISS-001 has 75 upvotes', time: 'now', read: false },
      ];
      const item = samples[Math.floor(Math.random() * samples.length)];
      addNotification(item);
      toast({ title: 'New notification', description: item.message });
    }, 15000);
    return () => clearInterval(interval);
  }, [addNotification, toast]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n: any) => {
      if (activeTab === 'issues') return ['status_change', 'comment', 'resolved', 'escalation', 'sla', 'upvote'].includes(n.type);
      if (activeTab === 'tasks') return n.type === 'task';
      if (activeTab === 'chat') return ['chat', 'mention'].includes(n.type);
      if (activeTab === 'system') return n.type === 'system';
      return false;
    });
  }, [activeTab, notifications]);

  const unreadCounts = useMemo(() => {
    const counts: any = {};
    for (const tab of tabs) {
      counts[tab.id] = notifications.filter((n: any) => {
        if (n.read) return false;
        if (tab.id === 'all') return true;
        if (tab.id === 'issues') return ['status_change', 'comment', 'resolved', 'escalation', 'sla', 'upvote'].includes(n.type);
        if (tab.id === 'tasks') return n.type === 'task';
        if (tab.id === 'chat') return ['chat', 'mention'].includes(n.type);
        if (tab.id === 'system') return n.type === 'system';
        return false;
      }).length;
    }
    return counts;
  }, [notifications]);

  const typeColor = (type: string) => {
    switch (type) {
      case 'chat': return 'border-purple-400';
      case 'mention': return 'border-orange-400';
      case 'sla': return 'border-destructive';
      case 'issue': return 'border-blue-400';
      default: return 'border-slate-200';
    }
  };

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-black text-primary">Notifications</h1>
        <Button variant="outline" onClick={markNotificationsRead}>Mark all read</Button>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-200 mb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1',
                  activeTab === tab.id ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {unreadCounts[tab.id] > 0 && (
                  <span className="ml-1 bg-destructive text-white text-[10px] font-bold rounded-full px-2">{unreadCounts[tab.id]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 pb-20">
        {filteredNotifications.map((n: any) => (
          <div 
            key={n.id}
            className={cn('rounded-xl border-l-4 bg-white p-4 shadow-sm flex justify-between items-start', typeColor(n.type))}
          >
            <div>
              <h3 className="font-bold text-sm">{n.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
            </div>
            <div className="flex flex-col gap-1">
              {!n.read && <span className="text-[10px] text-destructive font-bold">New</span>}
              <button onClick={markNotificationsRead} className="text-[10px] text-accent hover:underline">Mark all read</button>
            </div>
          </div>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="bg-white border border-slate-200 p-8 rounded-xl text-center text-slate-500">No notifications in this category.</div>
        )}
      </div>
    </div>
  );
}
