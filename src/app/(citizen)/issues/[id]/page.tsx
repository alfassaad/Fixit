'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ThumbsUp, MapPin, Calendar, 
  MessageSquare, Share2, CheckCircle2, Circle, 
  User, Send, Camera
} from 'lucide-react';
import { CitizenLayout } from '@/components/layout/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { CATEGORIES } from '@/data/mockData';

// ... (keep the existing Report interface)

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!params.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*, issue_photos(photo_url), comments(*, profiles(full_name, avatar_url)), profiles(full_name, avatar_url))')
        .eq('issue_id', params.id)
        .single();

      if (error) {
        console.error('Error fetching issue:', error);
        router.push('/my-reports'); // Or a 404 page
      } else {
        setIssue(data);
      }
      setLoading(false);
    };

    fetchIssue();
  }, [params.id, router]);

  const handleUpvote = async () => {
    if (!voted) {
      // Implement upvote logic with Supabase
      setVoted(true);
    }
  };

    const statusSteps = [
    { id: 'open', label: 'Submitted' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' }
  ];

  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }
  
  if (!issue) return <div className="p-20 text-center">Issue not found</div>;

    const currentStepIdx = statusSteps.findIndex(s => s.id === issue.status);


  return (
    <CitizenLayout>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="font-black text-primary tracking-tight">Issue Details</div>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <Share2 className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Photo Carousel (Simulated) */}
        <div className="relative aspect-video bg-slate-200 overflow-hidden shrink-0">
          {issue.issue_photos && issue.issue_photos.length > 0 ? (
            <img src={issue.issue_photos[0].photo_url} alt="Issue" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-200">
               <Camera className="w-12 h-12 mb-2 opacity-50" />
               <span className="text-sm font-bold">No photos provided</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
             <StatusBadge status={issue.status as any} className="shadow-lg" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 pb-24 space-y-6">
          {/* Title and Stats */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-primary leading-tight">{issue.description}</h1>
              <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{issue.location?.address || 'No location provided'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleUpvote}
                className={cn(
                  "flex-1 h-12 rounded-2xl font-bold flex items-center gap-2 transition-all",
                  voted ? "bg-accent/10 text-accent border-accent hover:bg-accent/20" : "bg-primary text-white"
                )}
                variant={voted ? "outline" : "default"}
              >
                <ThumbsUp className={cn("w-5 h-5", voted && "fill-accent")} />
                {issue.upvotes} Upvotes
              </Button>
              <div className="bg-white border border-slate-200 h-12 px-4 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                #{issue.issue_id}
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Status Tracker
            </h3>
            <div className="relative flex justify-between items-center px-2">
              <div className="absolute h-0.5 bg-slate-100 left-8 right-8 top-[15px] z-0"></div>
              <div 
                className="absolute h-0.5 bg-success transition-all duration-1000 ease-in-out left-8 top-[15px] z-0" 
                style={{ width: `${Math.max(0, currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
              ></div>
              
              {statusSteps.map((step, idx) => {
                const isCompleted = idx < currentStepIdx || (issue.status === 'resolved' && idx === 3);
                const isCurrent = idx === currentStepIdx;
                
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                      isCompleted ? "bg-success border-success text-white" : 
                      isCurrent ? "bg-white border-accent text-accent animate-pulse" : 
                      "bg-white border-slate-100 text-slate-300"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold mt-2 uppercase tracking-tighter whitespace-nowrap",
                      isCompleted ? "text-success" : isCurrent ? "text-accent" : "text-slate-400"
                    )}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</div>
                <div className="font-bold text-primary flex items-center gap-2">
                   <div className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center text-sm shadow-sm border border-white shrink-0">
                      {CATEGORIES.find(c => c.name === issue.category)?.icon}
                   </div>
                   <span className="text-sm truncate">{issue.category}</span>
                </div>
             </div>
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</div>
                <PriorityBadge priority={issue.priority as any} />
             </div>
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reported On</div>
                <div className="text-sm font-bold text-primary">{new Date(issue.created_at).toLocaleDateString()}</div>
             </div>
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned To</div>
                <div className="text-sm font-bold text-primary flex items-center gap-1">
                   <User className="w-3 h-3 text-accent" />
                   {issue.profiles?.full_name || 'Unassigned'}
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
             <p className="text-slate-600 text-sm leading-relaxed">{issue.description}</p>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Comments ({issue.comments?.length || 0})</h3>
            <div className="space-y-3">
              {issue.comments && issue.comments.map((c: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                    {c.profiles?.full_name[0] || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{c.profiles?.full_name || 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600">{c.comment_text}</p>
                  </div>
                </div>
              ))}
              {(!issue.comments || issue.comments.length === 0) && (
                <div className="bg-slate-100 p-8 rounded-3xl text-center border-2 border-dashed border-slate-200">
                   <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                   <p className="text-xs font-bold text-slate-400">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2 z-30 pb-safe shadow-2xl">
           <Input 
              placeholder="Add a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 rounded-xl h-11 border-slate-100 bg-slate-50"
           />
           <Button size="icon" className="w-11 h-11 rounded-xl bg-accent" disabled={!comment}>
              <Send className="w-5 h-5 text-white" />
           </Button>
        </div>
      </div>
    </CitizenLayout>
  );
}
