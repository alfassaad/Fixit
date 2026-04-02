
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Compass, ClipboardList, Bell } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export function DesktopNav() {
  const pathname = usePathname();
  const { unreadCount } = useAppContext();

  const navItems = [
    { label: 'Map', icon: Map, path: '/map' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'My Reports', icon: ClipboardList, path: '/my-reports' },
    { label: 'Alerts', icon: Bell, path: '/notifications', badge: unreadCount },
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
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
