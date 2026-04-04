'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockActivityFeed } from '@/data/mockData';
import { Clock, CheckCircle2, ArrowUpRight, MessageSquare, AlertTriangle } from 'lucide-react';

const iconByType: any = {
  resolved: <CheckCircle2 className="w-4 h-4" />,
  assigned: <ArrowUpRight className="w-4 h-4" />,
  new: <MessageSquare className="w-4 h-4" />,
  escalated: <AlertTriangle className="w-4 h-4" />,
  comment: <MessageSquare className="w-4 h-4" />,
};

export function ActivityFeed() {
  const [events, setEvents] = useState(mockActivityFeed);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = mockActivityFeed[Math.floor(Math.random() * mockActivityFeed.length)];
      const next = { ...random, id: Date.now(), time: 'just now' };
      setEvents((prev) => [next, ...prev.slice(0, 9)]);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <h3 className="text-lg font-bold text-primary">Live Activity</h3>
      </div>
      <div className="space-y-2">
        {events.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
            <div className="text-accent">{iconByType[item.type] || <Clock className="w-4 h-4" />}</div>
            <div className="text-sm">
              <span className="font-bold">{item.actor}</span> {item.action} <span className="font-bold">{item.target}</span>
              <div className="text-xs text-slate-400">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
