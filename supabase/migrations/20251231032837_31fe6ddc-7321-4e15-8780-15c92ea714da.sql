
-- Make CRUD possible for all authenticated users on core operational tables
-- (keeps admin/kadis capabilities but removes restrictive policies that block normal users)

-- irrigation_areas
DROP POLICY IF EXISTS "Admins can manage areas" ON public.irrigation_areas;
DROP POLICY IF EXISTS "Areas viewable by authenticated" ON public.irrigation_areas;

CREATE POLICY "Areas viewable by authenticated"
ON public.irrigation_areas
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage areas"
ON public.irrigation_areas
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update areas"
ON public.irrigation_areas
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete areas"
ON public.irrigation_areas
FOR DELETE
TO authenticated
USING (true);

-- canals
DROP POLICY IF EXISTS "Admins can manage canals" ON public.canals;
DROP POLICY IF EXISTS "Canals viewable by authenticated" ON public.canals;

CREATE POLICY "Canals viewable by authenticated"
ON public.canals
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage canals"
ON public.canals
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update canals"
ON public.canals
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete canals"
ON public.canals
FOR DELETE
TO authenticated
USING (true);

-- gates
DROP POLICY IF EXISTS "Admins can manage gates" ON public.gates;
DROP POLICY IF EXISTS "Gates viewable by authenticated" ON public.gates;

CREATE POLICY "Gates viewable by authenticated"
ON public.gates
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage gates"
ON public.gates
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gates"
ON public.gates
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete gates"
ON public.gates
FOR DELETE
TO authenticated
USING (true);
