-- =====================================================
-- SECURE PAYMENT ARCHITECTURE
-- =====================================================

-- 1. Remove overly permissive payment policies
DROP POLICY IF EXISTS "Users can create payments for their bookings" ON public.payments;
DROP POLICY IF EXISTS "Users can update their payments" ON public.payments;

-- Keep only SELECT policy for viewing payment history (without exposing signature)
-- The existing policy is fine, but we'll handle sensitive data via views/functions

-- 2. Add positive amount constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_amount_positive'
  ) THEN
    ALTER TABLE public.payments 
    ADD CONSTRAINT payment_amount_positive CHECK (amount > 0);
  END IF;
END $$;

-- 3. Create a secure function to create payment orders (only via edge functions)
CREATE OR REPLACE FUNCTION public.create_payment_order(
  _booking_id UUID,
  _razorpay_order_id TEXT,
  _amount NUMERIC,
  _currency TEXT DEFAULT 'INR'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _booking RECORD;
  _payment_id UUID;
BEGIN
  -- Validate booking exists and belongs to the authenticated user
  SELECT id, customer_id, estimated_price, status
  INTO _booking
  FROM bookings
  WHERE id = _booking_id;

  IF _booking IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF _booking.customer_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to pay for this booking';
  END IF;

  IF _booking.status NOT IN ('pending', 'accepted') THEN
    RAISE EXCEPTION 'Booking cannot be paid in current status';
  END IF;

  -- Create payment record with pending status
  INSERT INTO payments (
    booking_id,
    user_id,
    amount,
    currency,
    status,
    razorpay_order_id
  )
  VALUES (
    _booking_id,
    auth.uid(),
    _amount,
    _currency,
    'pending',
    _razorpay_order_id
  )
  RETURNING id INTO _payment_id;

  RETURN _payment_id;
END;
$$;

-- 4. Create a secure function to verify and complete payment (called by webhook edge function)
CREATE OR REPLACE FUNCTION public.verify_payment(
  _razorpay_order_id TEXT,
  _razorpay_payment_id TEXT,
  _razorpay_signature TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _payment RECORD;
BEGIN
  -- Find the payment by order ID
  SELECT id, booking_id, status
  INTO _payment
  FROM payments
  WHERE razorpay_order_id = _razorpay_order_id;

  IF _payment IS NULL THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  IF _payment.status = 'completed' THEN
    RETURN TRUE; -- Already verified
  END IF;

  -- Update payment with verification data
  UPDATE payments
  SET 
    razorpay_payment_id = _razorpay_payment_id,
    razorpay_signature = _razorpay_signature,
    status = 'completed',
    updated_at = NOW()
  WHERE id = _payment.id;

  -- Update booking status to confirmed/paid
  UPDATE bookings
  SET status = 'accepted', updated_at = NOW()
  WHERE id = _payment.booking_id
  AND status = 'pending';

  RETURN TRUE;
END;
$$;

-- 5. Create a function to mark payment as failed
CREATE OR REPLACE FUNCTION public.fail_payment(
  _razorpay_order_id TEXT,
  _reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE payments
  SET 
    status = 'failed',
    updated_at = NOW()
  WHERE razorpay_order_id = _razorpay_order_id
  AND status = 'pending';

  RETURN FOUND;
END;
$$;

-- 6. Fix reviews policy to validate provider matches booking
DROP POLICY IF EXISTS "Customers can create reviews for their bookings" ON public.reviews;

CREATE POLICY "Customers can create reviews for completed bookings"
ON public.reviews FOR INSERT
WITH CHECK (
  auth.uid() = customer_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
    AND b.customer_id = auth.uid()
    AND b.provider_id = provider_id
    AND b.status = 'completed'
  )
);

-- 7. Fix customer booking update policy to prevent provider assignment
DROP POLICY IF EXISTS "Customers can update their pending bookings" ON public.bookings;

CREATE POLICY "Customers can update their pending booking details"
ON public.bookings FOR UPDATE
USING (
  auth.uid() = customer_id 
  AND status = 'pending'
)
WITH CHECK (
  auth.uid() = customer_id 
  AND status = 'pending'
  AND provider_id IS NULL -- Prevent customer from assigning provider
);