-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'petugas', 'kadis');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'petugas',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create irrigation_areas table
CREATE TABLE public.irrigation_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    total_area NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    lat NUMERIC NOT NULL DEFAULT 0,
    lng NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create canals table
CREATE TABLE public.canals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID REFERENCES public.irrigation_areas(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    length NUMERIC NOT NULL DEFAULT 0,
    width NUMERIC NOT NULL DEFAULT 0,
    capacity NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'good' CHECK (status IN ('good', 'needs_repair', 'critical')),
    last_inspection DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gates table
CREATE TABLE public.gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canal_id UUID REFERENCES public.canals(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'distribution' CHECK (type IN ('intake', 'distribution', 'drainage')),
    status TEXT NOT NULL DEFAULT 'closed' CHECK (status IN ('open', 'closed', 'partial')),
    condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN ('good', 'fair', 'poor')),
    last_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monitoring_data table
CREATE TABLE public.monitoring_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gate_id UUID REFERENCES public.gates(id) ON DELETE CASCADE NOT NULL,
    water_level NUMERIC NOT NULL DEFAULT 0,
    discharge NUMERIC NOT NULL DEFAULT 0,
    condition TEXT NOT NULL DEFAULT 'normal' CHECK (condition IN ('normal', 'warning', 'critical')),
    recorded_by UUID REFERENCES auth.users(id),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for irrigation_areas (readable by all authenticated, writable by admin/kadis)
CREATE POLICY "Areas viewable by authenticated" ON public.irrigation_areas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage areas" ON public.irrigation_areas
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'kadis'));

-- RLS Policies for canals
CREATE POLICY "Canals viewable by authenticated" ON public.canals
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage canals" ON public.canals
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'kadis'));

-- RLS Policies for gates
CREATE POLICY "Gates viewable by authenticated" ON public.gates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage gates" ON public.gates
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'kadis'));

-- RLS Policies for monitoring_data
CREATE POLICY "Monitoring data viewable by authenticated" ON public.monitoring_data
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert monitoring data" ON public.monitoring_data
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Admins can manage monitoring data" ON public.monitoring_data
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for alerts
CREATE POLICY "Alerts viewable by authenticated" ON public.alerts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage alerts" ON public.alerts
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_irrigation_areas_updated_at BEFORE UPDATE ON public.irrigation_areas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_canals_updated_at BEFORE UPDATE ON public.canals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gates_updated_at BEFORE UPDATE ON public.gates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, username)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'petugas');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for monitoring_data and alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.monitoring_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;