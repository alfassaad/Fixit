
"use client";

import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';

export function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DesktopNav />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
