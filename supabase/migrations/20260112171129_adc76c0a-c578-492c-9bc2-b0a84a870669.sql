-- Fix search_path for generate_booking_number function
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'EP' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Fix search_path for set_booking_number function
CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := public.generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix search_path for handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;