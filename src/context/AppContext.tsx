"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as issueService from '@/services/issueService';
import * as authService from '@/services/authService';

// Normalize Supabase rows → shape expected by the UI
const normalizeIssue = (row: any) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  status: row.status,
  priority: row.priority,
  description: row.description,
  location: {
    lat: row.location?.coordinates[1],
    lng: row.location?.coordinates[0],
    address: row.address || '',
  },
  upvotes: row.upvote_count ?? 0,
  reportedBy: row.reporter?.full_name || 'Anonymous',
  reportedAt: row.created_at,
  assignedTo: row.assignee?.full_name || null,
  photos: row.photos?.map((p: any) => p.photo_url) || [],
  resolvedAt: row.resolved_at,
  comments: [],
});

interface AppContextType {
  currentUser: any;
  issues: any[];
  notifications: any[];
  unreadCount: number;
  login: (role: 'citizen' | 'admin') => void;
  logout: () => void;
  submitReport: (newReport: any) => void;
  upvoteIssue: (issueId: string) => void;
  updateIssueStatus: (issueId: string, newStatus: string) => void;
  assignIssue: (issueId: string, technicianId: string) => void;
  markNotificationsRead: () => void;
  isLoading: boolean;
  refreshIssues: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Supabase session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const profile = await authService.getCurrentProfile().catch(() => null);
          setCurrentUser(profile ?? session.user);
        }
        // Fetch issues from Supabase
        const data = await issueService.getIssues({});
        setIssues((data ?? []).map(normalizeIssue));
      } catch (err) {
        console.error('Failed to init app:', err);
        setIssues([]);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();

    // Listen for auth changes
    const { data: listener } = authService.onAuthStateChange((_event, session) => {
      if (session?.user) {
        authService.getCurrentProfile()
          .then((profile) => setCurrentUser(profile ?? session.user))
          .catch(() => setCurrentUser(session.user));
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (role: 'citizen' | 'admin') => {
    // For now, use demo auth via Supabase
    try {
      if (role === 'citizen') {
        await authService.signIn({ email: 'citizen@demo.com', password: 'demo1234' });
      } else {
        await authService.signIn({ email: 'admin@demo.com', password: 'demo1234' });
      }
    } catch (err) {
      console.error('Login failed, falling back to guest:', err);
      // Guest: no Supabase auth, just local state
      const guestUser = role === 'citizen'
        ? { id: 'guest', name: 'Guest', email: 'guest@demo.com', role: 'citizen' }
        : { id: 'guest-admin', name: 'Admin Guest', email: 'admin_guest@demo.com', role: 'admin' };
      setCurrentUser(guestUser);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
  };

  const refreshIssues = async () => {
    try {
      const data = await issueService.getIssues({});
      setIssues((data ?? []).map(normalizeIssue));
    } catch (err) {
      console.error('Failed to refresh issues:', err);
    }
  };

  const submitReport = async (newReport: any) => {
    try {
      const created = await issueService.createIssue({
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        address: newReport.location?.address || '',
        latitude: newReport.location?.lat,
        longitude: newReport.location?.lng,
        priority: newReport.priority ?? 'medium',
      });

      // Also handle photos if present
      if (newReport.photos?.length > 0 && created?.id) {
        const uploadService = await import('@/services/uploadService');
        for (const photoB64 of newReport.photos) {
          try {
            const response = await fetch(photoB64);
            const blob = await response.blob();
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type });
            await uploadService.uploadPhoto(file, created.id, 'evidence');
          } catch (e) {
            console.error('Failed to upload photo:', e);
          }
        }
      }

      setIssues((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  const upvoteIssue = async (issueId: string) => {
    try {
      const result = await issueService.toggleUpvote(issueId);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId
            ? { ...issue, upvote_count: (issue.upvote_count ?? 0) + (result.upvoted ? 1 : -1) }
            : issue
        )
      );
    } catch (err) {
      console.error('Failed to toggle upvote:', err);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      const updated = await issueService.updateIssueStatus(issueId, newStatus);
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? { ...issue, ...updated } : issue))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const assignIssue = async (issueId: string, technicianId: string) => {
    try {
      const { issue } = await issueService.assignIssue(issueId, technicianId, null, null);
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, ...issue } : i))
      );
    } catch (err) {
      console.error('Failed to assign issue:', err);
    }
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        issues,
        notifications,
        unreadCount,
        login,
        logout,
        submitReport,
        upvoteIssue,
        updateIssueStatus,
        assignIssue,
        markNotificationsRead,
        isLoading,
        refreshIssues,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
