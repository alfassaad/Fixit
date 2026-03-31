
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  className?: string;
}

const statusMap = {
  open: { label: 'Open', className: 'bg-[hsl(var(--status-open-bg))] text-[hsl(var(--status-open-text))]' },
  assigned: { label: 'Assigned', className: 'bg-[hsl(var(--status-assigned-bg))] text-[hsl(var(--status-assigned-text))]' },
  in_progress: { label: 'In Progress', className: 'bg-[hsl(var(--status-progress-bg))] text-[hsl(var(--status-progress-text))]' },
  resolved: { label: 'Resolved', className: 'bg-[hsl(var(--status-resolved-bg))] text-[hsl(var(--status-resolved-text))]' },
  closed: { label: 'Closed', className: 'bg-[hsl(var(--status-closed-bg))] text-[hsl(var(--status-closed-text))]' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] || statusMap.open;
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
