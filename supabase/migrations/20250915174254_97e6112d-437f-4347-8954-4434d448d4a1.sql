-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'training_coordinator', 
  'training_supervisor',
  'safety_coordinator',
  'nurse',
  'chief_operations_officer',
  'operations_manager',
  'executive',
  'desk_officer',
  'trainee'
);

CREATE TYPE public.training_status AS ENUM (
  'pending',
  'in_progress', 
  'completed',
  'cancelled'
);

CREATE TYPE public.request_status AS ENUM (
  'open',
  'in_progress',
  'resolved',
  'closed'
);

CREATE TYPE public.equipment_status AS ENUM (
  'available',
  'assigned',
  'maintenance',
  'retired'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'trainee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create passcodes table
CREATE TABLE public.passcodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create form tables
CREATE TABLE public.welcome_policy_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  policy_acknowledgment BOOLEAN NOT NULL DEFAULT FALSE,
  data_consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.medical_screening_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  allergies TEXT,
  medications TEXT,
  medical_conditions TEXT,
  fitness_declaration BOOLEAN NOT NULL DEFAULT FALSE,
  doctor_clearance BOOLEAN,
  vaccination_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.course_registration_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  course_type TEXT NOT NULL,
  preferred_start_date DATE,
  experience_level TEXT,
  special_requirements TEXT,
  accommodation_needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.bosiet_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  previous_bosiet BOOLEAN DEFAULT FALSE,
  certification_date DATE,
  medical_fitness BOOLEAN NOT NULL DEFAULT FALSE,
  swimming_ability BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.fire_watch_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  previous_experience BOOLEAN DEFAULT FALSE,
  safety_training BOOLEAN NOT NULL DEFAULT FALSE,
  physical_fitness BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.cser_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  offshore_experience TEXT,
  survival_training BOOLEAN DEFAULT FALSE,
  medical_certificate BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.size_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_name TEXT NOT NULL,
  coverall_size TEXT,
  boot_size TEXT,
  helmet_size TEXT,
  glove_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create training management tables
CREATE TABLE public.training_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  courses TEXT[] NOT NULL,
  duration_days INTEGER,
  max_participants INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.training_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  training_set_id UUID REFERENCES public.training_sets(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  status training_status NOT NULL DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.training_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  training_set_id UUID REFERENCES public.training_sets(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  score DECIMAL(5,2),
  certificate_issued BOOLEAN DEFAULT FALSE,
  notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.trainee_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  verified_by UUID REFERENCES auth.users(id),
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create requests and complaints table
CREATE TABLE public.requests_complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'open',
  submitted_by TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create You See U Act table
CREATE TABLE public.you_see_u_act (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  observer_name TEXT NOT NULL,
  observer_email TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  immediate_action TEXT,
  photos TEXT[],
  witness_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create equipment management tables
CREATE TABLE public.equipment_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT,
  serial_number TEXT UNIQUE,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  status equipment_status NOT NULL DEFAULT 'available',
  location TEXT,
  purchase_date DATE,
  warranty_expires DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requested_by TEXT NOT NULL,
  department TEXT,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  requested_date DATE NOT NULL,
  required_date DATE,
  approved_by UUID REFERENCES auth.users(id),
  approved_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.equipment_request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment_inventory(id),
  quantity_requested INTEGER NOT NULL,
  quantity_approved INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  assigned_to TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  assigned_date DATE NOT NULL,
  return_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES public.equipment_inventory(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  maintenance_date DATE NOT NULL,
  cost DECIMAL(10,2),
  next_maintenance_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.welcome_policy_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_screening_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bosiet_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fire_watch_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cser_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.you_see_u_act ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_maintenance ENABLE ROW LEVEL SECURITY;

-- Create security definer function for user role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Form submission policies (trainees can create, staff can view all)
CREATE POLICY "Anyone can submit forms" ON public.welcome_policy_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view all forms" ON public.welcome_policy_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor', 'safety_coordinator', 'nurse')
  );

CREATE POLICY "Anyone can submit forms" ON public.medical_screening_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Medical staff can view forms" ON public.medical_screening_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'nurse', 'training_coordinator')
  );

CREATE POLICY "Anyone can submit forms" ON public.course_registration_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Training staff can view forms" ON public.course_registration_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Anyone can submit forms" ON public.bosiet_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Training staff can view forms" ON public.bosiet_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Anyone can submit forms" ON public.fire_watch_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Training staff can view forms" ON public.fire_watch_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Anyone can submit forms" ON public.cser_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Training staff can view forms" ON public.cser_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Anyone can submit forms" ON public.size_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view forms" ON public.size_forms
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor', 'operations_manager')
  );

-- Passcode policies
CREATE POLICY "Staff can manage passcodes" ON public.passcodes
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator')
  );

-- Training management policies
CREATE POLICY "Training staff can manage sets" ON public.training_sets
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Training staff can manage assignments" ON public.training_assignments
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Training staff can manage completions" ON public.training_completions
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor')
  );

CREATE POLICY "Staff can manage verifications" ON public.trainee_verifications
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'training_coordinator', 'training_supervisor', 'desk_officer')
  );

-- Requests and complaints policies
CREATE POLICY "Anyone can submit requests" ON public.requests_complaints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view requests" ON public.requests_complaints
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'executive', 'chief_operations_officer')
  );

CREATE POLICY "Staff can update requests" ON public.requests_complaints
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'executive', 'chief_operations_officer')
  );

-- You See U Act policies
CREATE POLICY "Anyone can submit observations" ON public.you_see_u_act
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Safety staff can view observations" ON public.you_see_u_act
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'safety_coordinator', 'operations_manager', 'executive')
  );

-- Equipment policies
CREATE POLICY "Staff can manage equipment inventory" ON public.equipment_inventory
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

CREATE POLICY "Anyone can submit equipment requests" ON public.equipment_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view equipment requests" ON public.equipment_requests
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

CREATE POLICY "Staff can update equipment requests" ON public.equipment_requests
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

CREATE POLICY "Staff can manage request items" ON public.equipment_request_items
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

CREATE POLICY "Staff can manage equipment assignments" ON public.equipment_assignments
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

CREATE POLICY "Staff can manage maintenance records" ON public.equipment_maintenance
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'operations_manager', 'chief_operations_officer')
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'trainee')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_welcome_policy_forms_updated_at
  BEFORE UPDATE ON public.welcome_policy_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_screening_forms_updated_at
  BEFORE UPDATE ON public.medical_screening_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_registration_forms_updated_at
  BEFORE UPDATE ON public.course_registration_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bosiet_forms_updated_at
  BEFORE UPDATE ON public.bosiet_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fire_watch_forms_updated_at
  BEFORE UPDATE ON public.fire_watch_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cser_forms_updated_at
  BEFORE UPDATE ON public.cser_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_size_forms_updated_at
  BEFORE UPDATE ON public.size_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_sets_updated_at
  BEFORE UPDATE ON public.training_sets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_assignments_updated_at
  BEFORE UPDATE ON public.training_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_completions_updated_at
  BEFORE UPDATE ON public.training_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainee_verifications_updated_at
  BEFORE UPDATE ON public.trainee_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_complaints_updated_at
  BEFORE UPDATE ON public.requests_complaints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_you_see_u_act_updated_at
  BEFORE UPDATE ON public.you_see_u_act
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_inventory_updated_at
  BEFORE UPDATE ON public.equipment_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_requests_updated_at
  BEFORE UPDATE ON public.equipment_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_request_items_updated_at
  BEFORE UPDATE ON public.equipment_request_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_assignments_updated_at
  BEFORE UPDATE ON public.equipment_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_maintenance_updated_at
  BEFORE UPDATE ON public.equipment_maintenance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();