'use client';

import { useState } from 'react';
import { Issue } from './page'; 
import { X } from 'lucide-react';

interface EditIssueModalProps {
  issue: Issue;
  onClose: () => void;
  onSave: (issue_id: number, updates: Partial<Issue>) => void;
}

export function EditIssueModal({ issue, onClose, onSave }: EditIssueModalProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  const handleSave = () => {
    const updates: Partial<Issue> = {};
    if (title !== issue.title) updates.title = title;
    if (description !== issue.description) updates.description = description;
    if (status !== issue.status) updates.status = status;
    if (priority !== issue.priority) updates.priority = priority;
    onSave(issue.issue_id, updates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Edit Issue #{issue.issue_id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Issue['status'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Issue['priority'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 shadow-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
