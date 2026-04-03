--
-- FixIt Platform Schema Migration
--
-- This migration script updates the database schema to support the features
-- outlined in the FixIt project prompt. It includes new tables for departments,
-- tasks, audit logs, and more, as well as modifications to existing tables
-- to support new roles, statuses, and application logic.
--

-- Use a DO block to add new enum values idempotently.
DO $$
BEGIN
  -- Add new roles to user_role enum if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'technician' AND enumtypid = 'public.user_role'::regtype) THEN
    ALTER TYPE public.user_role ADD VALUE 'technician';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'manager' AND enumtypid = 'public.user_role'::regtype) THEN
    ALTER TYPE public.user_role ADD VALUE 'manager';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = 'public.user_role'::regtype) THEN
    ALTER TYPE public.user_role ADD VALUE 'super_admin';
  END IF;

  -- Create issue_status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_status') THEN
    CREATE TYPE public.issue_status AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'closed');
  END IF;

  -- Create issue_priority enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_priority') THEN
    CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;

  -- Create task_status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
  END IF;
  
  -- Create notification_type enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM ('status_change', 'comment', 'assignment', 'escalation', 'resolved', 'rating_request');
  END IF;
END$$;

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  "departmentId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "category" text NOT NULL UNIQUE,
  "managerId" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "managerName" text,
  "slaHours" jsonb,
  "createdAt" timestamptz DEFAULT now()
);

-- Alter users table to add new fields
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS "phone" text,
  ADD COLUMN IF NOT EXISTS "departmentId" uuid REFERENCES public.departments("departmentId") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "avatarUrl" text,
  ADD COLUMN IF NOT EXISTS "fcmToken" text,
  ADD COLUMN IF NOT EXISTS "isVerified" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamptz;

-- Alter issues table for new schema
-- Note: Assuming `issues` table with `issue_id`, `title`, `description`, `category`, `created_at` already exists.
-- Adding new columns and changing existing ones.
ALTER TABLE public.issues
  ADD COLUMN IF NOT EXISTS "status" public.issue_status DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS "priority" public.issue_priority DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS "priorityScore" numeric DEFAULT 2,
  ADD COLUMN IF NOT EXISTS "location" jsonb,
  ADD COLUMN IF NOT EXISTS "reportedBy" uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS "reporterName" text,
  ADD COLUMN IF NOT EXISTS "assignedTo" uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS "assignedBy" uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS "departmentId" uuid REFERENCES public.departments("departmentId"),
  ADD COLUMN IF NOT EXISTS "upvoteCount" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "commentCount" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "photoUrls" text[],
  ADD COLUMN IF NOT EXISTS "resolutionPhotoUrls" text[],
  ADD COLUMN IF NOT EXISTS "isAnonymous" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isDuplicate" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "duplicateOf" uuid REFERENCES public.issues(issue_id),
  ADD COLUMN IF NOT EXISTS "slaDeadline" timestamptz,
  ADD COLUMN IF NOT EXISTS "escalationLevel" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "rating" integer,
  ADD COLUMN IF NOT EXISTS "ratingComment" text,
  ADD COLUMN IF NOT EXISTS "resolvedAt" timestamptz,
  ADD COLUMN IF NOT EXISTS "closedAt" timestamptz,
  ADD COLUMN IF NOT EXISTS "updatedAt" timestamptz;

-- Create upvotes table
CREATE TABLE IF NOT EXISTS public.issue_upvotes (
  "issueId" uuid NOT NULL REFERENCES public.issues(issue_id) ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" timestamptz DEFAULT now(),
  PRIMARY KEY ("issueId", "userId")
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.issue_comments (
  "commentId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "issueId" uuid NOT NULL REFERENCES public.issues(issue_id) ON DELETE CASCADE,
  "authorId" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "authorName" text,
  "authorRole" public.user_role,
  "text" text NOT NULL,
  "isInternal" boolean DEFAULT false,
  "createdAt" timestamptz DEFAULT now()
);

-- Create status history table
CREATE TABLE IF NOT EXISTS public.issue_status_history (
  "historyId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "issueId" uuid NOT NULL REFERENCES public.issues(issue_id) ON DELETE CASCADE,
  "fromStatus" public.issue_status,
  "toStatus" public.issue_status,
  "changedBy" uuid REFERENCES public.users(id),
  "changedByName" text,
  "changedByRole" public.user_role,
  "note" text,
  "timestamp" timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  "taskId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "issueId" uuid NOT NULL REFERENCES public.issues(issue_id) ON DELETE CASCADE,
  "issueTitle" text,
  "issueCategory" text,
  "issueAddress" text,
  "issuePriority" public.issue_priority,
  "assignedTo" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "assignedToName" text,
  "assignedBy" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "departmentId" uuid NOT NULL REFERENCES public.departments("departmentId") ON DELETE CASCADE,
  "status" public.task_status DEFAULT 'pending',
  "dueDate" timestamptz,
  "managerNotes" text,
  "technicianNotes" text,
  "completedAt" timestamptz,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  "notifId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "issueId" uuid REFERENCES public.issues(issue_id) ON DELETE CASCADE,
  "type" public.notification_type NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "isRead" boolean DEFAULT false,
  "deepLink" text,
  "createdAt" timestamptz DEFAULT now()
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  "id" smallint PRIMARY KEY CHECK (id = 1),
  "cityName" text,
  "duplicateRadiusMeters" integer,
  "maxPhotosPerReport" integer,
  "maxPhotoSizeMB" integer,
  "categories" text[],
  "defaultSlaHours" jsonb,
  "updatedAt" timestamptz
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  "logId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId" uuid REFERENCES public.users(id) ON DELETE SET NULL,
  "actorRole" public.user_role,
  "action" text NOT NULL,
  "targetId" text,
  "targetType" text,
  "metadata" jsonb,
  "timestamp" timestamptz DEFAULT now()
);

-- RLS Policies for new tables will need to be created separately.
-- This script focuses on schema creation.
