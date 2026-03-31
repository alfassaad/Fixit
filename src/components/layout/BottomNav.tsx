
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Compass, ClipboardList, Bell } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useAppContext();

  const navItems = [
    { label: 'Map', icon: Map, path: '/map' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'My Reports', icon: ClipboardList, path: '/my-reports' },
    { label: 'Alerts', icon: Bell, path: '/notifications', badge: unreadCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 flex justify-around items-center z-50 md:hidden pb-safe">
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
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
