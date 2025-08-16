-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view product images (since bucket is public)
CREATE POLICY "Anyone can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'products');

-- Policy: Only admins can upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Only admins can update product images
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'products' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Only admins can delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'products' 
  AND has_role(auth.uid(), 'admin'::app_role)
);