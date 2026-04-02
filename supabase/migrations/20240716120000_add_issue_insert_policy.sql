-- ============================================================
-- supabase/migrations/20240716120000_add_issue_insert_policy.sql
-- ============================================================

-- Allow authenticated users to insert into the issues table
CREATE POLICY "Authenticated users can insert issues" ON public.issues
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
