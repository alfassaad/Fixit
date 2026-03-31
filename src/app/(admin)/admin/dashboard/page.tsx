"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ClipboardList, AlertCircle, CheckCircle, Clock, 
  TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockDashboardStats, mockChartData, mockIssues } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { AdminLayout } from '../layout';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const stats = mockDashboardStats;

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatValue = (num: number) => {
    if (!mounted) return num.toString();
    return num.toLocaleString();
  };

  const kpis = [
    { label: 'Total Issues', value: formatValue(stats.totalIssues), sub: '+12% this month', icon: ClipboardList, color: 'border-blue-500', trend: 'up' },
    { label: 'Open Issues', value: formatValue(stats.openIssues), sub: 'Needs attention', icon: AlertCircle, color: 'border-red-500', trend: 'warning' },
    { label: 'Resolved (Month)', value: formatValue(stats.resolvedThisMonth), sub: `Avg ${stats.avgResolutionHours}hrs`, icon: CheckCircle, color: 'border-green-500', trend: 'up' },
    { label: 'Critical', value: formatValue(stats.criticalIssues), sub: 'Escalated', icon: Clock, color: 'border-orange-500', trend: 'down' },
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">System Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of civic infrastructure reports</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">Download Report</button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-md transition-all">Refresh Data</button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <Card key={idx} className={`border-l-4 ${kpi.color} shadow-sm hover:shadow-md transition-shadow`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="text-3xl font-black text-primary mt-1">{kpi.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      {kpi.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                      {kpi.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                      <span className={`text-xs font-bold ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-orange-600'}`}>
                        {kpi.sub}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <kpi.icon className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-primary">Monthly Issues Trend</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Reported vs Resolved tickets</p>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                      />
                      <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                      <Line type="monotone" dataKey="reported" stroke="#2E86C1" strokeWidth={3} dot={{r: 4, fill: '#2E86C1', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                      <Line type="monotone" dataKey="resolved" stroke="#1D8348" strokeWidth={3} dot={{r: 4, fill: '#1D8348', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Issues by Category</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Breakdown of reported departments</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockChartData.categoryBreakdown}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockChartData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} layout="vertical" align="left" iconType="circle" wrapperStyle={{fontSize: '11px', paddingLeft: '10px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Avg Resolution Time</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Hours taken to resolve per category</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData.resolutionTime} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="hours" fill="#2E86C1" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-primary">Recent Issues</CardTitle>
              <button className="text-accent text-xs font-bold hover:underline">View All</button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-y border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left">Issue</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Priority</th>
                      <th className="px-6 py-3 text-left">Assigned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockIssues.slice(0, 5).map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary truncate max-w-[150px]">{issue.title}</div>
                          <div className="text-[10px] text-slate-400 font-medium">#{issue.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={issue.status as any} className="scale-75 origin-left" />
                        </td>
                        <td className="px-6 py-4">
                          <PriorityBadge priority={issue.priority as any} className="scale-75 origin-left" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-slate-600">{issue.assignedTo || 'Unassigned'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
