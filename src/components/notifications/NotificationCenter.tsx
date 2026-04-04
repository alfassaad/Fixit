"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, X, Check } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const getIcon = (type: string) => {
  switch (type) {
    case 'status': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'assignment': return <Info className="w-5 h-5 text-blue-500" />;
    case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
  }
};

export const NotificationCenter = () => {
  const { notifications, unreadCount, markNotificationsRead, removeNotification } = useAppContext();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const Content = () => (
    <div className="flex flex-col h-full bg-white max-h-[80vh] md:max-h-[500px]">
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-800">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={markNotificationsRead}
            className="text-xs text-accent hover:text-accent font-bold px-3 py-1 bg-accent/10 rounded-full transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto w-full">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-40">
            <Bell className="w-10 h-10 text-slate-200 mb-2" />
            <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif: any) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative flex gap-3",
                  !notif.read ? "bg-accent/5 hover:bg-accent/10" : "bg-white"
                )}
              >
                {!notif.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-md"></div>
                )}
                
                <div className="shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-bold text-slate-800 mb-0.5">{notif.title}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-2">
                    {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.time).toLocaleDateString()}
                  </p>
                </div>
                
                <button 
                  onClick={() => removeNotification(notif.id)}
                  className="absolute right-3 top-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-sm border border-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest p-2 w-full">
          View All History
        </button>
      </div>
    </div>
  );

  const TriggerButton = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
    <button 
      ref={ref}
      {...props}
      className={cn(
        "relative p-2.5 rounded-full transition-all group flex items-center justify-center",
        open ? "bg-slate-100" : "hover:bg-slate-50"
      )}
    >
      <Bell className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-destructive text-white text-[10px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1 shadow-sm animate-in zoom-in">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  ));

  TriggerButton.displayName = 'TriggerButton';

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <TriggerButton />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={12} className="w-[360px] p-0 rounded-2xl shadow-xl border-slate-200 overflow-hidden">
          <Content />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <TriggerButton />
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl sm:max-w-none">
        <SheetHeader className="sr-only">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <Content />
      </SheetContent>
    </Sheet>
  );
};
