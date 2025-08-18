-- Create lockers table
CREATE TABLE public.lockers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    hub_id TEXT NOT NULL,
    relay_id TEXT NOT NULL,
    status TEXT DEFAULT 'closed',
    last_opened_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reservations table  
CREATE TABLE public.reservations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    locker_id INTEGER REFERENCES public.lockers(id),
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create open_logs table
CREATE TABLE public.open_logs (
    id SERIAL PRIMARY KEY,
    locker_id INTEGER REFERENCES public.lockers(id),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.open_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lockers
CREATE POLICY "Admins can manage lockers" 
ON public.lockers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active lockers" 
ON public.lockers 
FOR SELECT 
USING (true);

-- Create RLS policies for reservations
CREATE POLICY "Admins can view all reservations" 
ON public.reservations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own reservations" 
ON public.reservations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage reservations" 
ON public.reservations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for open_logs
CREATE POLICY "Admins can view all logs" 
ON public.open_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert logs" 
ON public.open_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_lockers_updated_at
    BEFORE UPDATE ON public.lockers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();