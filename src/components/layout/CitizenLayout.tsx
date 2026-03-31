
"use client";

import { BottomNav } from './BottomNav';

export function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
