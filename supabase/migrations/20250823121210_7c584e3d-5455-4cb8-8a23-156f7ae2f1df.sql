-- Create a table for site settings including social media links
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Anyone can read settings for public display
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Insert default social media settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
('facebook_url', 'https://www.facebook.com/rendiise', 'url', 'Facebook lehe link'),
('instagram_url', 'https://www.instagram.com/rendiise', 'url', 'Instagram lehe link'),
('phone_number', '+372 502 7355', 'text', 'Kontakttelefon'),
('email', 'info@rendiise.ee', 'email', 'Kontakt email');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();