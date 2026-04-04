"use client";

import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Bell, MessageCircle, AlertTriangle, Inbox, ShieldAlert, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tabs = [
  { id: 'all', label: 'All Activities', icon: Inbox },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'tasks', label: 'Tasks', icon: ShieldAlert },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'system', label: 'System', icon: Bell },
];

export default function AdminNotificationsPage() {
  const { notifications, markNotificationsRead } = useAppContext() as any;
  const [activeTab, setActiveTab] = useState('all');

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

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">System Notifications</h1>
          <p className="text-muted-foreground mt-1">Monitor real-time system alerts and activities</p>
        </div>
        <Button variant="outline" onClick={markNotificationsRead} className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl w-fit border border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-primary shadow-sm" 
                : "text-slate-500 hover:text-primary hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredNotifications.length > 0 ? filteredNotifications.map((n: any) => (
          <Card key={n.id} className={cn(
            "border-l-4 transition-all hover:shadow-md",
            !n.read ? "bg-accent/5 border-accent" : "bg-white border-slate-200"
          )}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    !n.read ? "bg-accent/20 text-accent" : "bg-slate-100 text-slate-400"
                  )}>
                    {n.type === 'chat' && <MessageCircle size={18} />}
                    {n.type === 'sla' && <AlertTriangle size={18} />}
                    {n.type === 'upvote' && <Bell size={18} />}
                    {!['chat', 'sla', 'upvote'].includes(n.type) && <Inbox size={18} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{n.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                       {!n.read && <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-primary">Dismiss</Button>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-accent">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-600">All clear!</h3>
             <p className="text-sm text-slate-400">No new notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
