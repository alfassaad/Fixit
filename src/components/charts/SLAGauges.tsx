'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const levels = [
  { label: 'Roads', value: 87, fill: '#1D8348' },
  { label: 'Water', value: 94, fill: '#1D8348' },
  { label: 'Lighting', value: 76, fill: '#D35400' },
  { label: 'Waste', value: 68, fill: '#C0392B' },
];

export function SLAGauges() {
  const [data] = useState(levels);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors"></div>
      <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
        SLA Compliance Gauges
        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">&lt; 48h</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {data.map((item) => {
          const chartData = [
            { name: 'Resolved', value: item.value, fill: item.fill },
            { name: 'Missed', value: 100 - item.value, fill: '#f1f5f9' },
          ];
          
          return (
            <div key={item.label} className="flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-50 shadow-sm hover:scale-105 transition-transform duration-200">
              <div className="w-24 h-24 relative">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={40}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800">{item.value}%</div>
              </div>
              <div className="mt-2 text-sm font-bold text-slate-600">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
