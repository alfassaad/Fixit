"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import * as issueService from '@/services/issueService';
import * as authService from '@/services/authService';
import { mockChatMessages, mockWidgets } from '@/data/mockData';

// Normalize Supabase rows → shape expected by the UI
const normalizeIssue = (row: any) => ({
  id: row.issue_id, // Corrected from row.id to row.issue_id
  issue_id: row.issue_id,
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
  messages: any[];
  activeRoom: string;
  searchQuery: string;
  quickViewIssue: any;
  enabledWidgets: any[];
  filters: {
    status: string[];
    category: string[];
    priority: string[];
    sortBy: string;
    sortOrder: string;
  };
  setActiveRoom: (roomId: string) => void;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
  submitReport: (newReport: any) => void;
  upvoteIssue: (issueId: string) => void;
  updateIssueStatus: (issueId: string, newStatus: string) => void;
  assignIssue: (issueId: string, technicianId: string) => void;
  markNotificationsRead: () => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string | number) => void;
  sendMessage: (roomId: string, text: string) => void;
  toggleWidget: (widgetId: string) => void;
  addComment: (issue_id: string, content: string) => Promise<any>;
  applyFilters: (newFilters: any) => void;
  clearFilters: () => void;
  openQuickView: (issue: any) => void;
  closeQuickView: () => void;
  setEnabledWidgets: (widgets: any[]) => void;
  isLoading: boolean;
  refreshIssues: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>(mockChatMessages);
  const [activeRoom, setActiveRoom] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewIssue, setQuickViewIssue] = useState<any>(null);
  const [enabledWidgets, setEnabledWidgets] = useState<any[]>(mockWidgets);
  const [filters, setFilters] = useState<any>({
    status: [],
    category: [],
    priority: [],
    sortBy: 'newest',
    sortOrder: 'desc',
  });
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
    const { data: listener } = authService.onAuthStateChange((_event: any, session: any) => {
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

  // Notification simulation
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const types = ['status', 'assignment', 'alert'];
      const type = types[Math.floor(Math.random() * types.length)];
      const msg = type === 'alert' ? 'High priority issue reported near you.' : type === 'assignment' ? 'New task assigned to your queue.' : 'Issue #1043 status changed to In Progress.';
      
      const newNotif = {
        id: Date.now(),
        type,
        title: type === 'alert' ? 'Urgent Alert' : type === 'assignment' ? 'New Assignment' : 'Status Updated',
        message: msg,
        read: false,
        time: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 15000); // exactly 15 seconds
    
    return () => clearInterval(interval);
  }, [currentUser]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Demo Login Bypass
      if (credentials.email === 'admin@demo.com') {
        const mockAdmin = {
          id: 'mock-admin-id',
          user_id: 'mock-admin-id',
          email: 'admin@demo.com',
          full_name: 'Admin User',
          name: 'Admin User',
          role: 'admin',
          department: 'Operations',
          departmentId: 'dept-1'
        };
        setCurrentUser(mockAdmin);
        return;
      }
      
      if (credentials.email === 'citizen@demo.com') {
        const mockCitizen = {
          id: 'mock-citizen-id',
          user_id: 'mock-citizen-id',
          email: 'citizen@demo.com',
          full_name: 'Citizen User',
          name: 'Citizen User',
          role: 'citizen'
        };
        setCurrentUser(mockCitizen);
        return;
      }

      await authService.signIn(credentials);
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    router.push('/login');
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
      if (newReport.photos?.length > 0 && created?.issue_id) {
        const uploadService = await import('@/services/uploadService');
        for (const photoB64 of newReport.photos) {
          try {
            const response = await fetch(photoB64);
            const blob = await response.blob();
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type });
            await uploadService.uploadPhoto(file, created.issue_id, 'evidence');
          } catch (e) {
            console.error('Failed to upload photo:', e);
          }
        }
      }

      setIssues((prev) => [normalizeIssue(created), ...prev]);
    } catch (err) {
      console.error('Failed to create issue:', err);
    }
  };

  const upvoteIssue = async (issueId: string) => {
    try {
      const result = await issueService.toggleUpvote(issueId);
      setIssues((prev) =>
        prev.map((issue) =>
          (issue.issue_id === issueId || issue.id === issueId)
            ? { ...issue, upvotes: (issue.upvotes ?? 0) + (result.upvoted ? 1 : -1) }
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

  const addNotification = (notification: any) => {
    setNotifications((prev) => [{ ...notification, id: Date.now() }, ...prev]);
  };

  const removeNotification = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      roomId,
      senderId: currentUser?.id || 'SYS',
      senderName: currentUser?.name || 'System',
      senderRole: currentUser?.role || 'admin',
      message: text,
      time: new Date().toISOString(),
      mentions: [],
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const toggleWidget = (widgetId: string) =>
    setEnabledWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w)));

  const applyFilters = (newFilters: any) => setFilters(newFilters);

  const clearFilters = () =>
    setFilters({ status: [], category: [], priority: [], sortBy: 'newest', sortOrder: 'desc' });

  const setActiveRoomContext = (roomId: string) => setActiveRoom(roomId);
  const openQuickView = (issue: any) => setQuickViewIssue(issue);
  const closeQuickView = () => setQuickViewIssue(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        issues,
        notifications,
        unreadCount,
        messages,
        activeRoom,
        searchQuery,
        quickViewIssue,
        enabledWidgets,
        filters,
        login,
        logout,
        submitReport,
        upvoteIssue,
        updateIssueStatus,
        assignIssue,
        markNotificationsRead,
        addNotification,
        removeNotification,
        sendMessage,
        toggleWidget,
        applyFilters,
        clearFilters,
        openQuickView,
        closeQuickView,
        setActiveRoom: setActiveRoomContext,
        setEnabledWidgets,
        isLoading,
        refreshIssues,
        addComment: async (issueId: string, content: string) => {
          const comment = await issueService.addComment(issueId, content);
          // Refresh details or state if needed
          return comment;
        }
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
