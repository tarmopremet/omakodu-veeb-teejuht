-- Create a function to automatically assign admin role to specific users
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile first
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Check if this is the admin email and assign admin role
  IF NEW.email = 'tarmo.premet@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Assign regular user role to others
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- If the user already exists, let's make sure they have admin role
-- (This will only work if the user is already registered)
DO $$
BEGIN
  -- Try to insert admin role for existing user
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users 
  WHERE email = 'tarmo.premet@gmail.com'
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Also ensure profile exists
  INSERT INTO public.profiles (user_id, full_name)
  SELECT id, COALESCE(raw_user_meta_data ->> 'full_name', email)
  FROM auth.users 
  WHERE email = 'tarmo.premet@gmail.com'
  ON CONFLICT (user_id) DO NOTHING;
END $$;