'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CitizenFilterDrawer from '@/components/filters/CitizenFilterDrawer';
import FilterChips from '@/components/filters/FilterChips';
interface Report {
  issue_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  reporter_id: string;
  created_at: string;
}

const CATEGORIES = ['Roads & Potholes', 'Street Lighting', 'Water & Drainage', 'Waste Management', 'Parks', 'Other'];

function EditReportDialog({
  report,
  onSave,
  onClose,
}: {
  report: Report;
  onSave: (updatedReport: Report) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(report);

  useEffect(() => {
    setFormData(report);
  }, [report]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev!, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
          <DialogDescription>
            Update the details of your report here. Click "Save Changes" when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    category: [] as string[],
    priority: [] as string[],
    sortBy: 'newest'
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching reports',
        description: 'Could not load your reports. Please try again later.',
      });
    } else {
      setReports(data as Report[]);
    }
    setLoading(false);
  };

  const handleDelete = async (issue_id: string) => {
    const { error } = await supabase.rpc('delete_my_issue', {
      issue_id_to_delete: issue_id,
    });

    if (error) {
      console.error('Error deleting report:', error);
      toast({
        variant: 'destructive',
        title: 'Error deleting report',
        description: error.message || 'Could not delete the report. Please try again.',
      });
    } else {
      setReports(reports.filter(report => report.issue_id !== issue_id));
      toast({
        title: 'Report Deleted',
        description: 'Your report has been successfully deleted.',
      });
    }
  };

  const handleUpdate = async (report: Report) => {
    const { error } = await supabase
      .from('issues')
      .update({ title: report.title, description: report.description, category: report.category })
      .eq('issue_id', report.issue_id);

    if (error) {
      console.error('Error updating report:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating report',
        description: 'Could not update the report. Please try again.',
      });
    } else {
      fetchReports(); // Refetch reports to show the updated data
      setEditingReport(null);
      toast({
        title: 'Report Updated',
        description: 'Your report has been successfully updated.',
      });
    }
  };

  const filteredReports = reports
    .filter((report) => {
      const matchesStatus = filters.status.length === 0 || filters.status.includes(report.status.toLowerCase().replace('_', ' '));
      const matchesCategory = filters.category.length === 0 || filters.category.includes(report.category);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes((report as any).priority || 'medium');
      return matchesStatus && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (filters.sortBy === 'upvotes') return ((b as any).upvotes || 0) - ((a as any).upvotes || 0);
      return 0;
    });

  const ReportsSkeleton = () => (
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Card key={`skeleton-${i}`}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-[80px]" />
                <Skeleton className="h-10 w-[80px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <CitizenLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-2xl font-bold">My Reports</h1>
          <div className="flex items-center gap-2">
            <CitizenFilterDrawer filters={filters as any} setFilters={setFilters as any} />
            <div className="text-xs text-slate-500">My Reports Only: On</div>
          </div>
        </div>

        <FilterChips filters={filters} setFilters={setFilters as any} />

        {loading ? (
          <ReportsSkeleton />
        ) : filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.issue_id}>
                <CardHeader>
                  <CardTitle>{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="outline">{report.category}</Badge>
                      <div className="text-sm text-gray-500 mt-2">
                        Status: <Badge>{report.status}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingReport(report)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(report.issue_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">No reports yet</h2>
            <p className="text-gray-500 mt-2">You haven't reported any issues. When you do, they'll show up here.</p>
            <Button className="mt-4" onClick={() => router.push('/report/new')}>
              Report an Issue
            </Button>
          </div>
        )}
        {editingReport && <EditReportDialog report={editingReport} onSave={handleUpdate} onClose={() => setEditingReport(null)} />}
      </div>
    </CitizenLayout>
  );
}
