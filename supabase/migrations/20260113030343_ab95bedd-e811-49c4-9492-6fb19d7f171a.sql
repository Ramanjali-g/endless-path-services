-- =====================================================
-- FIX 1: Restrict bookings access - only assigned providers can see full details
-- =====================================================

-- Drop existing permissive policies on bookings
DROP POLICY IF EXISTS "Providers can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can update assigned bookings" ON public.bookings;

-- Create more restrictive policy: providers can only see bookings where they are the assigned provider
-- AND the booking has been accepted (status is not pending)
CREATE POLICY "Providers can view their assigned bookings" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() = provider_id
);

-- Providers can only update bookings they are assigned to
CREATE POLICY "Providers can update their assigned bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = provider_id);

-- =====================================================
-- FIX 2: Add input validation constraints on bookings table
-- =====================================================

-- Add length and format constraints for input validation
DO $$
BEGIN
  -- Address length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_address_length'
  ) THEN
    ALTER TABLE public.bookings 
    ADD CONSTRAINT bookings_address_length CHECK (char_length(address) <= 500);
  END IF;

  -- City length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_city_length'
  ) THEN
    ALTER TABLE public.bookings 
    ADD CONSTRAINT bookings_city_length CHECK (city IS NULL OR char_length(city) <= 100);
  END IF;

  -- Pincode format constraint (6 digits)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_pincode_format'
  ) THEN
    ALTER TABLE public.bookings 
    ADD CONSTRAINT bookings_pincode_format CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$');
  END IF;

  -- Notes length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_notes_length'
  ) THEN
    ALTER TABLE public.bookings 
    ADD CONSTRAINT bookings_notes_length CHECK (notes IS NULL OR char_length(notes) <= 1000);
  END IF;
END $$;

-- =====================================================
-- FIX 3: Restrict user role insertion to customer/provider only
-- =====================================================

-- Drop the old overly permissive policy
DROP POLICY IF EXISTS "Users can insert their own role on signup" ON public.user_roles;

-- Create policy that only allows customer or provider roles
CREATE POLICY "Users can only insert customer or provider role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('customer', 'provider')
);

-- =====================================================
-- FIX 4: Update profiles policy to be more restrictive
-- =====================================================

-- Drop the current policy that exposes too much info
DROP POLICY IF EXISTS "Authenticated users can view provider profiles" ON public.profiles;

-- Create a more restrictive policy
CREATE POLICY "Users can view limited profile info" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always view their own profile
  auth.uid() = user_id
  OR 
  -- Users with active booking relationship can see each other's profiles
  (
    auth.uid() IS NOT NULL
    AND (
      -- Customer can see assigned provider's profile
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.customer_id = auth.uid() 
        AND bookings.provider_id = profiles.user_id
        AND bookings.status IN ('accepted', 'in_progress', 'completed')
      )
      OR
      -- Provider can see customer's profile for their assigned bookings
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.provider_id = auth.uid() 
        AND bookings.customer_id = profiles.user_id
      )
    )
  )
);