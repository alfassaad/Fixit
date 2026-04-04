"use client";

import { useState } from 'react';
import { 
  Settings, Bell, Shield, Database, 
  MapPin, Globe, Palette, Info, ArrowRight,
  User, Mail, Phone, Lock, Eye, Trash2, CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

const sections = [
  { id: 'profile', label: 'Admin Profile', icon: User },
  { id: 'system', label: 'System Settings', icon: Settings },
  { id: 'notifications', label: 'Notification Config', icon: Bell },
  { id: 'security', label: 'Security & Auth', icon: Shield },
  { id: 'database', label: 'Supabase & Data', icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${section} preferences have been updated successfully.`,
    });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure global application behavior and administrator preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar for settings */}
        <div className="lg:col-span-1 space-y-2">
           {sections.map((section) => (
             <button
               key={section.id}
               onClick={() => setActiveTab(section.id)}
               className={cn(
                 "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all transition-colors",
                 activeTab === section.id ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
               )}
             >
               <section.icon size={18} />
               {section.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card className="shadow-sm border-slate-200 animate-in slide-in-from-right-4 duration-300">
               <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-xl font-black text-primary flex items-center gap-2"><User size={20} /> Administrator Profile</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                     <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-accent/20">A</div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-bold">Admin User</h4>
                        <p className="text-sm text-slate-500 font-medium">Head of Operations, FixIt Islamabad</p>
                        <Button variant="outline" size="sm" className="mt-2 text-xs font-bold border-accent text-accent">Change Photo</Button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</Label>
                        <Input defaultValue="Admin User" className="rounded-xl border-slate-200 h-11 font-medium" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</Label>
                        <Input defaultValue="admin@demo.com" readOnly className="rounded-xl border-slate-200 h-11 bg-slate-50 font-medium" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</Label>
                        <Input defaultValue="+92-333-1234567" className="rounded-xl border-slate-200 h-11 font-medium" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Department Access</Label>
                        <Input defaultValue="All Departments" readOnly className="rounded-xl border-slate-200 h-11 bg-slate-50 font-medium" />
                     </div>
                  </div>
                  <div className="flex justify-end pt-4">
                     <Button className="bg-primary font-bold px-8 h-12 rounded-xl" onClick={() => handleSave('profile')}>Save Profile Changes</Button>
                  </div>
               </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="shadow-sm border-slate-200 animate-in slide-in-from-right-4 duration-300">
               <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-xl font-black text-primary flex items-center gap-2"><Bell size={20} /> System Alerts Preferences</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between py-2">
                     <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">New Report Notifications</p>
                        <p className="text-xs text-slate-500 font-medium">Receive real-time push alerts for all incoming citizen reports.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-slate-50 pt-4">
                     <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">SLA Violation Warnings</p>
                        <p className="text-xs text-slate-500 font-medium">Alert me when a task is nearing the 48-hour resolution limit.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-slate-50 pt-4">
                     <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">Daily Analytics Summary</p>
                        <p className="text-xs text-slate-500 font-medium">Receive a PDF summary of the day's operations at midnight.</p>
                     </div>
                     <Switch />
                  </div>
                  <div className="flex justify-end pt-4">
                     <Button className="bg-primary font-bold px-8 h-12 rounded-xl" onClick={() => handleSave('notifications')}>Update Preferences</Button>
                  </div>
               </CardContent>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card className="shadow-sm border-slate-200 animate-in slide-in-from-right-4 duration-300">
               <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-xl font-black text-primary flex items-center gap-2"><Settings size={20} /> General System Settings</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Platform Name</Label>
                        <Input defaultValue="FixIt Islamabad" className="rounded-xl border-slate-200 h-11 font-medium" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Support Email</Label>
                        <Input defaultValue="support@fixit.isb.gov.pk" className="rounded-xl border-slate-200 h-11 font-medium" />
                     </div>
                  </div>
                  <div className="flex justify-end pt-4">
                     <Button className="bg-primary font-bold px-8 h-12 rounded-xl" onClick={() => handleSave('system')}>Save System Config</Button>
                  </div>
               </CardContent>
            </Card>
          )}

          {(activeTab === 'security' || activeTab === 'database') && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
                        {activeTab === 'security' ? <Shield size={20} /> : <Database size={20} />} 
                        {activeTab === 'security' ? 'Security & Infrastructure' : 'Database Management'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4 py-12">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      {activeTab === 'security' ? <Shield size={32} /> : <Database size={32} />}
                   </div>
                   <h3 className="text-lg font-bold text-slate-700">Restricted Section</h3>
                   <p className="max-w-md text-sm text-slate-500 font-medium">This section contains sensitive environmental configuration. Changes require multi-factor authentication.</p>
                   <Button variant="outline" className="font-bold border-slate-200 rounded-xl">Verify Identity to Continue</Button>
                </CardContent>
              </Card>

              {activeTab === 'database' && (
                <Card className="shadow-sm border-slate-200 border-red-100 bg-red-50/10">
                   <CardHeader className="border-b border-red-50">
                      <CardTitle className="text-xl font-black text-red-600 flex items-center gap-2"><Trash2 size={20} /> Danger Zone</CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 flex justify-between items-center">
                      <div className="space-y-0.5">
                         <p className="text-sm font-bold text-slate-800">Reset System Database</p>
                         <p className="text-xs text-slate-500 font-medium">Permanently clear all historical issue data and logs. This is irreversible.</p>
                      </div>
                      <Button variant="destructive" className="font-bold rounded-xl h-12 px-6">Factory Reset</Button>
                   </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
