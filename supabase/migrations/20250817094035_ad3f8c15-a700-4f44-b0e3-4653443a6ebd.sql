-- Create table for managing page-specific images
CREATE TABLE public.page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active page images" 
ON public.page_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage page images" 
ON public.page_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_images_updated_at
BEFORE UPDATE ON public.page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default images for tekstiilipesuri page
INSERT INTO public.page_images (page_name, image_url, alt_text, display_order) VALUES
('tekstiilipesuri', '/src/assets/textile-cleaner.jpg', 'Tekstiilipesuri rent - Kärcher seade', 1),
('tekstiilipesuri', '/src/assets/textile-cleaner-wurth.jpg', 'Tekstiilipesuri rent - Würth seade', 2);