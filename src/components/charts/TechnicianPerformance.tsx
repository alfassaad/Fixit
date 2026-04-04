'use client';

import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { mockPerformanceData } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function TechnicianPerformance() {
  const [data] = useState(mockPerformanceData);

  const total = useMemo(() => data.reduce((acc, cur) => acc + cur.completed, 0), [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors"></div>
        <h3 className="text-xl font-black text-primary mb-4 relative z-10">Team Performance This Month</h3>
        <div className="h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={110} tick={{fontSize:12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value: any) => [`${value} tasks`, 'Completed']} 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="completed" radius={[8, 8, 8, 8]} barSize={24} animationDuration={1000}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.completed > 9 ? '#1D8348' : '#2E86C1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-white to-slate-50">
        <h4 className="text-xl font-black text-primary mb-4">Technician Summary</h4>
        <div className="space-y-4">
          {data.map((member) => (
            <div key={member.name} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary group-hover:bg-accent group-hover:text-white transition-colors">{member.name.split(' ').map((n) => n[0]).join('')}</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{member.name}</div>
                  <div className="text-xs text-slate-500">{member.department}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-primary">{member.completed}/{member.assigned}</div>
                <div className="flex items-center justify-end gap-1 text-yellow-400 mt-1">
                  {Array.from({ length: Math.round(member.rating) }).map((_, i) => <span key={i} className="text-[10px]">★</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
