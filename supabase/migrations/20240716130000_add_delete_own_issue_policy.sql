-- allow users to delete their own issues
DROP POLICY IF EXISTS "Users can delete their own issues" ON public.issues;
CREATE POLICY "Users can delete their own issues" ON public.issues
  FOR DELETE USING (auth.uid() = reporter_id);
