-- Add manual_text column to products table
ALTER TABLE public.products 
ADD COLUMN manual_text text;