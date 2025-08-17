-- Add video support to page_images table
ALTER TABLE public.page_images 
ADD COLUMN video_url TEXT,
ADD COLUMN content_type TEXT DEFAULT 'image' CHECK (content_type IN ('image', 'video'));