CREATE POLICY "Allow anonymous users to create issues"
ON public.issues
FOR INSERT
TO anon
WITH CHECK (true);
