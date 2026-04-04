"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Compass, ClipboardList, MessageCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { LogoutDialog } from './LogoutDialog';

export function BottomNav() {
  const pathname = usePathname();
  const { logout } = useAppContext();

  const navItems = [
    { label: 'Map', icon: Map, path: '/map' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Reports', icon: ClipboardList, path: '/my-reports' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 flex justify-around items-center z-[100] md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 relative p-1 transition-all duration-200",
              isActive ? "text-accent scale-105" : "text-muted-foreground hover:text-accent"
            )}
          >
            <div className="relative">
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
      
      <div className="flex flex-col items-center gap-1 relative p-1 transition-all duration-200 text-muted-foreground hover:text-accent">
        <NotificationCenter />
        <span className="text-[10px] font-medium">Alerts</span>
      </div>

      <LogoutDialog>
        <button 
          className="flex flex-col items-center gap-1 relative p-1 transition-all duration-200 text-muted-foreground hover:text-destructive"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </LogoutDialog>
    </nav>
  );
}
