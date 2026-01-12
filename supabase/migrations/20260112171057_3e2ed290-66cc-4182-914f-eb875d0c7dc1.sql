-- Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'provider', 'admin');

-- Create service status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create service categories table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  price_unit TEXT DEFAULT 'per service',
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create provider_profiles table (additional info for service providers)
CREATE TABLE public.provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT,
  business_type TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  verification_documents JSONB DEFAULT '[]',
  service_areas TEXT[],
  rating_avg DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create provider_services table (services offered by providers)
CREATE TABLE public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  custom_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(provider_id, service_id)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  notes TEXT,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create has_role function for RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'EP' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Create trigger for booking number
CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := public.generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_booking_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_number();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_provider_profiles_updated_at
  BEFORE UPDATE ON public.provider_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view provider profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = profiles.user_id
      AND user_roles.role = 'provider'
    )
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for service_categories (public read)
CREATE POLICY "Anyone can view active categories"
  ON public.service_categories FOR SELECT
  USING (is_active = TRUE);

-- RLS Policies for services (public read)
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = TRUE);

-- RLS Policies for provider_profiles
CREATE POLICY "Providers can manage their own profile"
  ON public.provider_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified providers"
  ON public.provider_profiles FOR SELECT
  USING (is_verified = TRUE OR auth.uid() = user_id);

-- RLS Policies for provider_services
CREATE POLICY "Providers can manage their services"
  ON public.provider_services FOR ALL
  USING (auth.uid() = provider_id);

CREATE POLICY "Public can view active provider services"
  ON public.provider_services FOR SELECT
  USING (is_active = TRUE);

-- RLS Policies for bookings
CREATE POLICY "Customers can view their bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their pending bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id AND status = 'pending');

CREATE POLICY "Providers can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = provider_id);

-- RLS Policies for payments
CREATE POLICY "Users can view their payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments for their bookings"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their payments"
  ON public.payments FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Customers can create reviews for their bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert default service categories
INSERT INTO public.service_categories (name, slug, description, icon, display_order) VALUES
('Emergency Services', 'emergency', 'Urgent help when you need it most', 'AlertTriangle', 1),
('Technical & Utility', 'technical', 'Electronics, electrical and mobile repairs', 'Wrench', 2),
('Home & Daily Needs', 'home', 'Cleaning, grocery and water delivery', 'Home', 3),
('Printing & Business', 'printing', 'DTP, visiting cards and all printing needs', 'Printer', 4),
('Transport & Travel', 'transport', 'Cab sharing, driver services', 'Car', 5),
('Food Services', 'food', 'Daily lunch box and food delivery', 'UtensilsCrossed', 6),
('Real Estate & Events', 'realestate', 'Property and event management', 'Building', 7),
('Manpower & Construction', 'manpower', 'Daily wage workers and construction support', 'HardHat', 8),
('Education & Training', 'education', 'Tuition and skill development', 'GraduationCap', 9),
('Agriculture Support', 'agriculture', 'Farm labour and equipment rental', 'Tractor', 10),
('Waste Management', 'waste', 'Scrap pickup and e-waste recycling', 'Recycle', 11);

-- Insert sample services
INSERT INTO public.services (category_id, name, description, base_price, price_unit, icon) VALUES
((SELECT id FROM service_categories WHERE slug = 'emergency'), 'Bike Repair', 'On-spot bike repair and servicing', 200.00, 'per visit', 'Bike'),
((SELECT id FROM service_categories WHERE slug = 'emergency'), 'Car Breakdown', 'Emergency car repair assistance', 500.00, 'per visit', 'Car'),
((SELECT id FROM service_categories WHERE slug = 'emergency'), 'Tyre Puncture', 'Quick tyre puncture repair', 100.00, 'per tyre', 'CircleDot'),
((SELECT id FROM service_categories WHERE slug = 'emergency'), 'Fuel Assistance', 'Emergency fuel delivery', 150.00, 'per delivery', 'Fuel'),
((SELECT id FROM service_categories WHERE slug = 'technical'), 'Electronics Repair', 'TV, AC, refrigerator repair', 300.00, 'per visit', 'Tv'),
((SELECT id FROM service_categories WHERE slug = 'technical'), 'Electrical Work', 'Wiring, switches, electrical repairs', 250.00, 'per hour', 'Zap'),
((SELECT id FROM service_categories WHERE slug = 'technical'), 'Mobile Repair', 'Smartphone screen and hardware repair', 200.00, 'per device', 'Smartphone'),
((SELECT id FROM service_categories WHERE slug = 'technical'), 'Laptop Repair', 'Laptop servicing and repair', 400.00, 'per device', 'Laptop'),
((SELECT id FROM service_categories WHERE slug = 'home'), 'Home Cleaning', 'Deep cleaning for homes', 500.00, 'per room', 'Sparkles'),
((SELECT id FROM service_categories WHERE slug = 'home'), 'Water Can Delivery', '20L water can delivery', 50.00, 'per can', 'Droplets'),
((SELECT id FROM service_categories WHERE slug = 'home'), 'Grocery Delivery', 'Local kirana store delivery', 30.00, 'per delivery', 'ShoppingBag'),
((SELECT id FROM service_categories WHERE slug = 'printing'), 'DTP Services', 'Design and desktop publishing', 200.00, 'per design', 'FileText'),
((SELECT id FROM service_categories WHERE slug = 'printing'), 'Visiting Cards', 'Business card printing', 300.00, 'per 100 cards', 'CreditCard'),
((SELECT id FROM service_categories WHERE slug = 'printing'), 'Pamphlet Printing', 'Flyers and pamphlet printing', 500.00, 'per 100 copies', 'Files'),
((SELECT id FROM service_categories WHERE slug = 'transport'), 'Cab Sharing', 'Shared cab services', 100.00, 'per km', 'Users'),
((SELECT id FROM service_categories WHERE slug = 'transport'), 'Driver Service', 'Hire a driver', 400.00, 'per day', 'UserCheck'),
((SELECT id FROM service_categories WHERE slug = 'food'), 'Lunch Box Delivery', 'Daily homemade lunch delivery', 80.00, 'per meal', 'Package'),
((SELECT id FROM service_categories WHERE slug = 'realestate'), 'Real Estate Services', 'Property buying and selling', 0.00, 'commission based', 'Building2'),
((SELECT id FROM service_categories WHERE slug = 'realestate'), 'Event Management', 'Complete event planning', 5000.00, 'per event', 'PartyPopper'),
((SELECT id FROM service_categories WHERE slug = 'manpower'), 'Daily Wage Labour', 'Skilled and unskilled workers', 500.00, 'per day', 'HardHat'),
((SELECT id FROM service_categories WHERE slug = 'manpower'), 'Construction Support', 'Building materials and support', 1000.00, 'per day', 'Hammer'),
((SELECT id FROM service_categories WHERE slug = 'education'), 'Tuition Services', 'Home and online tuition', 300.00, 'per hour', 'BookOpen'),
((SELECT id FROM service_categories WHERE slug = 'education'), 'Skill Training', 'Professional skill development', 500.00, 'per session', 'Award'),
((SELECT id FROM service_categories WHERE slug = 'agriculture'), 'Farm Labour', 'Agricultural workers', 400.00, 'per day', 'Wheat'),
((SELECT id FROM service_categories WHERE slug = 'agriculture'), 'Tractor Rental', 'Tractor and equipment rental', 2000.00, 'per day', 'Tractor'),
((SELECT id FROM service_categories WHERE slug = 'waste'), 'Scrap Pickup', 'Scrap collection from home', 0.00, 'free pickup', 'Trash2'),
((SELECT id FROM service_categories WHERE slug = 'waste'), 'E-Waste Collection', 'Electronic waste recycling', 0.00, 'free pickup', 'MonitorOff');