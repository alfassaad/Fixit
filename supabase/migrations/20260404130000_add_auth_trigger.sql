--
-- FixIt: Auth trigger to auto-create a profile on signup
-- This trigger fires after a new user is inserted into auth.users
-- and creates a corresponding row in public.profiles.
--

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'fullName', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'citizen')
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists so this migration is idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on the Supabase auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
