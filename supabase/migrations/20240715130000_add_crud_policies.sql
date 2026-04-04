-- ============================================================
-- supabase/migrations/20240715130000_add_crud_policies.sql
-- ============================================================

-- Function to read custom claims safely
CREATE OR REPLACE FUNCTION public.get_my_claim(claim text) RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.' || claim, true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata' ->> claim),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> claim)
  );
$$;

-- Enable Row Level Security for all tables
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_upvotes ENABLE ROW LEVEL SECURITY;

-- Policies for 'issues' table

-- 1. Allow public read access to all issues
DROP POLICY IF EXISTS "Public can read all issues" ON public.issues;
CREATE POLICY "Public can read all issues" ON public.issues
  FOR SELECT USING (true);

-- 2. Allow authenticated users to create issues
DROP POLICY IF EXISTS "Authenticated users can create issues" ON public.issues;
CREATE POLICY "Authenticated users can create issues" ON public.issues
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow admins to update any issue
DROP POLICY IF EXISTS "Admins can update any issue" ON public.issues;
CREATE POLICY "Admins can update any issue" ON public.issues
  FOR UPDATE USING (get_my_claim('role') = 'admin') WITH CHECK (get_my_claim('role') = 'admin');

-- 4. Allow users to update their own issues (with restrictions)
-- (e.g., cannot change status to 'resolved')
DROP POLICY IF EXISTS "Users can update their own issues" ON public.issues;
CREATE POLICY "Users can update their own issues" ON public.issues
  FOR UPDATE USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id AND status <> ALL (ARRAY['resolved', 'closed']::public.issue_status[]));

-- 5. Allow admins to delete any issue
DROP POLICY IF EXISTS "Admins can delete any issue" ON public.issues;
CREATE POLICY "Admins can delete any issue" ON public.issues
  FOR DELETE USING (get_my_claim('role') = 'admin');

-- Policies for 'tasks' table

-- 1. Allow admins and assigned users to view tasks
DROP POLICY IF EXISTS "Admins and assigned users can view tasks" ON public.tasks;
CREATE POLICY "Admins and assigned users can view tasks" ON public.tasks
  FOR SELECT USING (get_my_claim('role') = 'admin' OR auth.uid() = assigned_to);

-- 2. Allow admins to create tasks
DROP POLICY IF EXISTS "Admins can create tasks" ON public.tasks;
CREATE POLICY "Admins can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (get_my_claim('role') = 'admin');

-- 3. Allow admins and assigned users to update tasks
DROP POLICY IF EXISTS "Admins and assigned users can update tasks" ON public.tasks;
CREATE POLICY "Admins and assigned users can update tasks" ON public.tasks
  FOR UPDATE USING (get_my_claim('role') = 'admin' OR auth.uid() = assigned_to)
  WITH CHECK (get_my_claim('role') = 'admin' OR auth.uid() = assigned_to);

-- 4. Allow admins to delete tasks
DROP POLICY IF EXISTS "Admins can delete tasks" ON public.tasks;
CREATE POLICY "Admins can delete tasks" ON public.tasks
  FOR DELETE USING (get_my_claim('role') = 'admin');

-- Policies for other tables (for completeness)
-- 'issue_photos'
DROP POLICY IF EXISTS "Public can read all issue photos" ON public.issue_photos;
CREATE POLICY "Public can read all issue photos" ON public.issue_photos
  FOR SELECT USING (true);

-- 'issue_upvotes'
DROP POLICY IF EXISTS "Public can read all upvotes" ON public.issue_upvotes;
CREATE POLICY "Public can read all upvotes" ON public.issue_upvotes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can upvote" ON public.issue_upvotes;
CREATE POLICY "Authenticated users can upvote" ON public.issue_upvotes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can remove their own upvote" ON public.issue_upvotes;
CREATE POLICY "Users can remove their own upvote" ON public.issue_upvotes
  FOR DELETE USING (auth.uid() = user_id);
