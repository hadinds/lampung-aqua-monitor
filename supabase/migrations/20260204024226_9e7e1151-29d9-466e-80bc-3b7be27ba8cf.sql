-- Fix security issue 1: Profiles table - restrict SELECT to own profile only
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix security issue 2 & 3: irrigation_areas - restrict write operations to admin/kadis
DROP POLICY IF EXISTS "Authenticated users can manage areas" ON public.irrigation_areas;
DROP POLICY IF EXISTS "Authenticated users can update areas" ON public.irrigation_areas;
DROP POLICY IF EXISTS "Authenticated users can delete areas" ON public.irrigation_areas;

CREATE POLICY "Admins and kadis can insert areas"
ON public.irrigation_areas
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can update areas"
ON public.irrigation_areas
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can delete areas"
ON public.irrigation_areas
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

-- Fix security issue 2 & 3: canals - restrict write operations to admin/kadis
DROP POLICY IF EXISTS "Authenticated users can manage canals" ON public.canals;
DROP POLICY IF EXISTS "Authenticated users can update canals" ON public.canals;
DROP POLICY IF EXISTS "Authenticated users can delete canals" ON public.canals;

CREATE POLICY "Admins and kadis can insert canals"
ON public.canals
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can update canals"
ON public.canals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can delete canals"
ON public.canals
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

-- Fix security issue 2 & 3: gates - restrict write operations to admin/kadis
DROP POLICY IF EXISTS "Authenticated users can manage gates" ON public.gates;
DROP POLICY IF EXISTS "Authenticated users can update gates" ON public.gates;
DROP POLICY IF EXISTS "Authenticated users can delete gates" ON public.gates;

CREATE POLICY "Admins and kadis can insert gates"
ON public.gates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can update gates"
ON public.gates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));

CREATE POLICY "Admins and kadis can delete gates"
ON public.gates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'kadis'::app_role));