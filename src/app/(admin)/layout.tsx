
"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, Briefcase,
  Users, BarChart3, Settings, LogOut, Wrench, Menu, Bell, MessageCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { LogoutDialog } from '@/components/layout/LogoutDialog';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, currentUser, unreadCount } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'All Issues', icon: ClipboardList, path: '/admin/issues' },
    { label: 'Tasks', icon: Briefcase, path: '/admin/tasks' },
    { label: 'Chat', icon: MessageCircle, path: '/admin/chat' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: unreadCount },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-body">
      {/* Sidebar */}
      <aside className={`bg-primary text-white flex flex-col hidden lg:flex shadow-2xl z-50 transition-width duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
            <Wrench className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-black tracking-tight">FixIt Admin</span>
        </div>

        <nav className="flex-1 px-2 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                title={collapsed ? item.label : ''}
                className={cn(
                  "flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-accent text-white shadow-lg shadow-accent/20 font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {!collapsed && <span>{item.label}</span>}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-destructive text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 bg-black/10 m-4 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-lg border-2 border-white/20">
              {currentUser?.name?.[0] || 'A'}
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-sm truncate max-w-[120px]">{currentUser?.name || 'Admin'}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentUser?.department || 'Operations'}</div>
              </div>
            )}
          </div>
          <LogoutDialog>
            <button
              title={collapsed ? "Sign Out" : ""}
              className={cn(
                "flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors py-2.5 rounded-xl text-sm font-bold",
                collapsed ? "w-12 mx-auto" : "w-full"
              )}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </LogoutDialog>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors py-2.5 rounded-xl text-sm font-bold"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>{collapsed ? 'Expand' : 'Collapse'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar for mobile and alerts */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 shadow-sm z-40">
           <div className="flex items-center gap-4 lg:hidden">
              <button className="p-2 hover:bg-slate-50 rounded-lg"><Menu className="w-6 h-6 text-primary" /></button>
              <span className="text-xl font-black text-primary">FixIt</span>
           </div>
           
           <div className="hidden lg:flex relative w-96">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text" 
                placeholder="Search database..." 
                className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-accent transition-all"
              />
           </div>

           <div className="flex items-center gap-4">
              <div className="relative group">
                 <NotificationCenter />
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                 <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-primary">{currentUser?.name || 'Admin'}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Now</div>
                 </div>
                 <div className="w-9 h-9 bg-accent/10 rounded-full border border-accent/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                 </div>
              </div>
           </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
