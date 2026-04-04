"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Activity, Users, ClipboardList, 
  ArrowUpRight, ArrowDownRight, Filter, Download 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockChartData } from '@/data/mockData';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 200 },
  { name: 'Thu', value: 278 },
  { name: 'Fri', value: 189 },
  { name: 'Sat', value: 239 },
  { name: 'Sun', value: 349 },
];

export default function AnalyticsPage() {
  const stats = [
    { label: 'System Uptime', value: '99.9%', trend: 0.1, icon: Activity, color: 'text-green-500' },
    { label: 'Active Users', value: '1,248', trend: 12.5, icon: Users, color: 'text-blue-500' },
    { label: 'Avg Feedback', value: '4.8/5', trend: 2.1, icon: ClipboardList, color: 'text-accent-500' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into city infrastructure and system performance</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold flex items-center gap-2"><Filter size={14} /> Filter Range</Button>
           <Button className="bg-primary font-bold flex items-center gap-2"><Download size={14} /> Download PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-sm border-slate-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-50 rounded-2xl">
                   <stat.icon className={stat.color} size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                   <ArrowUpRight size={10} /> +{stat.trend}%
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-4">{stat.label}</p>
              <h3 className="text-3xl font-black text-primary mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-primary font-bold">Issue Volume vs Resolution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData.monthlyTrend}>
                  <defs>
                    <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E86C1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2E86C1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D8348" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1D8348" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="reported" stroke="#2E86C1" fillOpacity={1} fill="url(#colorReported)" strokeWidth={3} />
                  <Area type="monotone" dataKey="resolved" stroke="#1D8348" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-primary font-bold">Issue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                  <Tooltip 
                     cursor={{fill: '#F1F5F9'}}
                     contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {mockChartData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full shadow-sm border-slate-200">
           <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent">
                 <TrendingUp size={32} />
              </div>
              <h2 className="text-2xl font-black text-primary">Predictive Infrastructure Insight</h2>
              <p className="max-w-2xl text-slate-500 font-medium">Based on the current trend of pothole reports in **F-6 Sector**, our model suggests a 15% increase in structural wear over the next 3 weeks due to weather patterns. **Recommend increasing technician patrol frequency.**</p>
              <Button className="font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">Generate Forecast Report</Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
