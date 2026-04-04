"use client";

import { CitizenLayout } from '@/components/layout/CitizenLayout';

export default function GroupCitizenLayout({ children }: { children: React.ReactNode }) {
  return <CitizenLayout>{children}</CitizenLayout>;
}
