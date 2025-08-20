-- Change locker_door from integer to integer array to support multiple doors
ALTER TABLE public.products 
DROP COLUMN locker_door;

ALTER TABLE public.products 
ADD COLUMN locker_doors integer[];