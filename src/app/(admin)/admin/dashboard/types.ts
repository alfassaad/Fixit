export interface Issue {
  issue_id: number;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed' | 'assigned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string | null;
  [key: string]: any;
}
