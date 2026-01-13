-- Drop the overly permissive policy that exposes customer contact info
DROP POLICY IF EXISTS "Public can view provider profiles" ON public.profiles;

-- Create a more restrictive policy: Only authenticated users can view provider profiles
-- and only basic info (the actual data restriction happens at query level)
CREATE POLICY "Authenticated users can view provider profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always view their own profile
  auth.uid() = user_id
  OR 
  -- Authenticated users can view provider profiles (for browsing services)
  (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = profiles.user_id 
      AND user_roles.role = 'provider'
    )
  )
  OR
  -- Users can view profiles of people they have bookings with
  (
    auth.uid() IS NOT NULL
    AND (
      -- Customer can see provider's profile from their bookings
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.customer_id = auth.uid() 
        AND bookings.provider_id = profiles.user_id
      )
      OR
      -- Provider can see customer's profile from their assigned bookings
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.provider_id = auth.uid() 
        AND bookings.customer_id = profiles.user_id
      )
    )
  )
);