
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockIssues, mockUser, mockNotifications, mockAdminUser } from '@/data/mockData';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [issues, setIssues] = useState(mockIssues);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  // Persistence for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('fixit_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const login = (role: 'citizen' | 'admin') => {
    const user = role === 'citizen' ? mockUser : mockAdminUser;
    setCurrentUser(user);
    localStorage.setItem('fixit_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fixit_user');
  };

  const submitReport = (newReport: any) => {
    const reportWithId = {
      ...newReport,
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      upvotes: 0,
      reportedBy: currentUser?.name || "Guest",
      reportedAt: new Date().toISOString(),
      status: 'open',
      comments: []
    };
    setIssues(prev => [reportWithId, ...prev]);
  };

  const upvoteIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
  };

  const updateIssueStatus = (issueId: string, newStatus: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  const assignIssue = (issueId: string, technicianId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, assignedTo: technicianId, status: 'assigned' } : issue
    ));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
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
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
