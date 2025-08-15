-- Add is_active column to profiles table for user management
ALTER TABLE public.profiles 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Create index for better performance when filtering active users
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);

-- Update RLS policies to allow admins to update user status
CREATE POLICY "Admins can update user status" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));