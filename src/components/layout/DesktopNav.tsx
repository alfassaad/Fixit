"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Compass, ClipboardList, MessageCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { LogoutDialog } from './LogoutDialog';

export function DesktopNav() {
  const pathname = usePathname();
  const { logout } = useAppContext();

  const navItems = [
    { label: 'Map', icon: Map, path: '/map' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'My Reports', icon: ClipboardList, path: '/my-reports' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
  ];

  return (
    <nav className="hidden md:flex flex-col gap-4 p-4 border-r border-border bg-background">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <div className="relative">
              <Icon size={24} />
            </div>
            <span className="font-semibold">{item.label}</span>
          </Link>
        );
      })}
      
      <div className="flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-200">
        <NotificationCenter />
        <span className="font-semibold cursor-pointer" onClick={() => document.querySelector<HTMLButtonElement>('[data-state="closed"]')?.click()}>Alerts</span>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <LogoutDialog>
          <button 
            className="flex items-center gap-3 w-full p-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut size={24} />
            <span className="font-semibold">Logout</span>
          </button>
        </LogoutDialog>
      </div>
    </nav>
  );
}
