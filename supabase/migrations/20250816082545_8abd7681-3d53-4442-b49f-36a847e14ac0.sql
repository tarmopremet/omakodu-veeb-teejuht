-- Create sales_products table for products sold rather than rented
CREATE TABLE public.sales_products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  manual_text text,
  manual_url text,
  price numeric NOT NULL,
  images text[],
  video_url text,
  is_active boolean NOT NULL DEFAULT true,
  meta_title text,
  meta_description text,
  meta_keywords text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_products ENABLE ROW LEVEL SECURITY;

-- Create policies for sales products
CREATE POLICY "Anyone can view active sales products" 
ON public.sales_products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage sales products" 
ON public.sales_products 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_sales_products_updated_at
BEFORE UPDATE ON public.sales_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample sales product
INSERT INTO public.sales_products (name, description, manual_text, price, is_active)
VALUES (
  'Puhastustabletid',
  'Professionaalsed puhastustabletid kõikide puhastusseadmete jaoks. Sobivad tekstiilipesuritele, aurupesuritele ja muudele seadmetele. Pakend sisaldab 20 tabletti.',
  'Kasutage 1 tabletti 5 liitri vee kohta. Laske tabletil täielikult lahustuda enne kasutamist. Sobib kõikidele puhastusseadmetele.',
  12.99,
  true
);