-- ============================================================
-- supabase/seed.sql
-- FixIt Seed Data — Admin Role Management
-- ============================================================
-- 
-- HOW TO USE:
-- Run individual sections in the Supabase Dashboard SQL Editor.
-- 
-- DO NOT run this entire file at once unless you have replaced
-- all placeholder emails with real values.
-- ============================================================


-- ============================================================
-- SECTION 1: Promote an existing user to 'admin'
-- Replace 'admin@example.com' with the actual email address
-- of the user you want to make an admin.
-- ============================================================
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);


-- ============================================================
-- SECTION 2: Promote a user to 'super_admin'
-- ============================================================
-- UPDATE public.profiles
-- SET role = 'super_admin'
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'superadmin@example.com'
-- );


-- ============================================================
-- SECTION 3: Promote a user to 'manager' and assign a department
-- ============================================================
-- UPDATE public.profiles
-- SET 
--   role = 'manager',
--   "departmentId" = (SELECT dept_id FROM public.departments WHERE name = 'Roads & Potholes Department')
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'manager@example.com'
-- );


-- ============================================================
-- SECTION 4: Promote a user to 'technician' and assign a department
-- ============================================================
-- UPDATE public.profiles
-- SET 
--   role = 'technician',
--   "departmentId" = (SELECT dept_id FROM public.departments WHERE name = 'Roads & Potholes Department')
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'technician@example.com'
-- );


-- ============================================================
-- SECTION 5: View all users and their roles (diagnostic query)
-- ============================================================
-- SELECT 
--   u.email,
--   p.full_name,
--   p.role,
--   p.user_id
-- FROM auth.users u
-- JOIN public.profiles p ON p.user_id = u.id
-- ORDER BY p.role, u.email;


-- ============================================================
-- SECTION 6: Seed default departments (run once)
-- ============================================================
-- INSERT INTO public.departments (name, category)
-- VALUES
--   ('Roads & Potholes Department', 'Roads & Potholes'),
--   ('Street Lighting Department', 'Street Lighting'),
--   ('Water & Drainage Department', 'Water & Drainage'),
--   ('Waste Management Department', 'Waste Management'),
--   ('Parks Department', 'Parks'),
--   ('General Department', 'Other')
-- ON CONFLICT (category) DO NOTHING;
