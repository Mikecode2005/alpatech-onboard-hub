-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create passcodes table
CREATE TABLE IF NOT EXISTS passcodes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  trainee_email TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create welcome_policy_forms table
CREATE TABLE IF NOT EXISTS welcome_policy_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  signature_data_url TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create course_registration_forms table
CREATE TABLE IF NOT EXISTS course_registration_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_start_date TEXT NOT NULL,
  course_end_date TEXT NOT NULL,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  company_name TEXT,
  date_of_birth TEXT,
  middle_name TEXT,
  job_title TEXT,
  course_start_time TEXT,
  course_end_time TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create medical_screening_forms table
CREATE TABLE IF NOT EXISTS medical_screening_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  name TEXT,
  name_of_company TEXT,
  gender TEXT,
  age TEXT,
  has_condition BOOLEAN DEFAULT FALSE,
  medication TEXT,
  remarks TEXT,
  health_condition_details TEXT,
  fire_proximity_info TEXT,
  weapon_possession TEXT,
  attestation_name TEXT,
  attestation_date TEXT,
  attestation_signature TEXT,
  company_sponsors TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create training_assignments table
CREATE TABLE IF NOT EXISTS training_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  module_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE,
  UNIQUE(trainee_email, module_name)
);

-- Create bosiet_forms table
CREATE TABLE IF NOT EXISTS bosiet_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  gender TEXT,
  age TEXT,
  special_medication BOOLEAN DEFAULT FALSE,
  medication_details TEXT,
  health_condition BOOLEAN DEFAULT FALSE,
  health_condition_details TEXT,
  fire_proximity_info TEXT,
  weapon_possession BOOLEAN DEFAULT FALSE,
  weapon_details TEXT,
  attestation_name TEXT,
  attestation_date TEXT,
  attestation_signature TEXT,
  company_sponsors TEXT,
  aenl_personnel_remark TEXT,
  aenl_personnel_name TEXT,
  aenl_personnel_signature TEXT,
  aenl_personnel_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create fire_watch_forms table
CREATE TABLE IF NOT EXISTS fire_watch_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  gender TEXT,
  age TEXT,
  special_medication BOOLEAN DEFAULT FALSE,
  medication_details TEXT,
  health_condition BOOLEAN DEFAULT FALSE,
  health_condition_details TEXT,
  fire_proximity_info TEXT,
  weapon_possession BOOLEAN DEFAULT FALSE,
  weapon_details TEXT,
  attestation_name TEXT,
  attestation_date TEXT,
  attestation_signature TEXT,
  company_sponsors TEXT,
  aenl_personnel_remark TEXT,
  aenl_personnel_name TEXT,
  aenl_personnel_signature TEXT,
  aenl_personnel_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create cser_forms table
CREATE TABLE IF NOT EXISTS cser_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  gender TEXT,
  age TEXT,
  special_medication BOOLEAN DEFAULT FALSE,
  medication_details TEXT,
  health_condition BOOLEAN DEFAULT FALSE,
  health_condition_details TEXT,
  fire_proximity_info TEXT,
  weapon_possession BOOLEAN DEFAULT FALSE,
  weapon_details TEXT,
  attestation_name TEXT,
  attestation_date TEXT,
  attestation_signature TEXT,
  company_sponsors TEXT,
  aenl_personnel_remark TEXT,
  aenl_personnel_name TEXT,
  aenl_personnel_signature TEXT,
  aenl_personnel_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create usee_uact_forms table
CREATE TABLE IF NOT EXISTS usee_uact_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  safe_acts TEXT,
  unsafe_acts TEXT,
  safe_conditions TEXT,
  unsafe_conditions TEXT,
  commendation TEXT,
  corrective_action TEXT,
  sustain_action TEXT,
  prevent_reoccur TEXT,
  personnel_name TEXT,
  personnel_signature TEXT,
  personnel_date TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create size_forms table
CREATE TABLE IF NOT EXISTS size_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_email TEXT NOT NULL,
  trainee_id TEXT,
  coverall_size TEXT,
  shoe_size TEXT,
  submitted_by TEXT,
  submitted_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (trainee_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create requests_complaints table
CREATE TABLE IF NOT EXISTS requests_complaints (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_role TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (from_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE passcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE welcome_policy_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registration_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_screening_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bosiet_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire_watch_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cser_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE usee_uact_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests_complaints ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read all users" 
ON users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert themselves" 
ON users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid()::text = email);

CREATE POLICY "Allow users to update their own data" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = email);

-- Create policies for passcodes
CREATE POLICY "Allow staff to manage passcodes" 
ON passcodes FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = auth.uid()::text 
    AND users.role IN ('Training Coordinator', 'Training Supervisor', 'Super Admin')
  )
);

CREATE POLICY "Allow trainees to read their own passcodes" 
ON passcodes FOR SELECT 
TO authenticated 
USING (trainee_email = auth.uid()::text);

-- Create policies for forms
CREATE POLICY "Allow trainees to manage their own forms" 
ON welcome_policy_forms FOR ALL 
TO authenticated 
USING (trainee_email = auth.uid()::text);

CREATE POLICY "Allow staff to read all forms" 
ON welcome_policy_forms FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.email = auth.uid()::text 
    AND users.role NOT IN ('Trainee')
  )
);

-- Create toolbox_talk_forms table for the toolbox talk forms
CREATE TABLE IF NOT EXISTS toolbox_talk_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  form_type TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create toolbox_talk_checklist_items table for the checklist items
CREATE TABLE IF NOT EXISTS toolbox_talk_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES toolbox_talk_forms(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  item_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create toolbox_talk_sessions table for the actual sessions
CREATE TABLE IF NOT EXISTS toolbox_talk_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES toolbox_talk_forms(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create toolbox_talk_attendees table for the trainees attending the session
CREATE TABLE IF NOT EXISTS toolbox_talk_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES toolbox_talk_sessions(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, trainee_id)
);

-- Create toolbox_talk_checklist_responses table for the responses to checklist items
CREATE TABLE IF NOT EXISTS toolbox_talk_checklist_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES toolbox_talk_sessions(id) ON DELETE CASCADE,
  checklist_item_id UUID NOT NULL REFERENCES toolbox_talk_checklist_items(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, checklist_item_id)
);

-- Enable RLS on new tables
ALTER TABLE toolbox_talk_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_talk_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_talk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_talk_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_talk_checklist_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for toolbox talk forms
CREATE POLICY "Trainers can view toolbox talk forms" 
ON toolbox_talk_forms FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('Training Supervisor', 'Training Coordinator', 'Instructor / Team Lead', 'Super Admin')
  )
);

CREATE POLICY "Trainers can create toolbox talk forms" 
ON toolbox_talk_forms FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('Training Supervisor', 'Training Coordinator', 'Instructor / Team Lead', 'Super Admin')
  )
);

CREATE POLICY "Trainers can update their own toolbox talk forms" 
ON toolbox_talk_forms FOR UPDATE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('Training Supervisor', 'Training Coordinator', 'Super Admin')
  )
);

-- Create training modules table
CREATE TABLE public.training_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  form_route TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the three training modules
INSERT INTO public.training_modules (name, description, form_route) VALUES
('BOSIET', 'Basic Offshore Safety Induction and Emergency Training', '/forms/bosiet'),
('CSE&R', 'Compressed Self-Escape and Rescue', '/forms/cser'),
('Fire Watch', 'Fire Watch Training and Safety', '/forms/fire-watch');

-- Create user training assignments table
CREATE TABLE public.user_training_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_module_id UUID NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  UNIQUE(user_id, training_module_id)
);

-- Enable RLS
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for training modules (everyone can view active modules)
CREATE POLICY "Anyone can view active training modules" 
ON public.training_modules 
FOR SELECT 
USING (is_active = true);

-- Create policies for user training assignments
CREATE POLICY "Users can view their own assignments" 
ON public.user_training_assignments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Training supervisors can view all assignments" 
ON public.user_training_assignments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Training Supervisor', 'Training Coordinator', 'Chief Operations Officer')
  )
);

CREATE POLICY "Training supervisors can insert assignments" 
ON public.user_training_assignments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Training Supervisor', 'Training Coordinator')
  )
);

-- Equipment Inventory Table
CREATE TABLE IF NOT EXISTS equipment_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unit',
  location TEXT,
  condition TEXT,
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Requests Table
CREATE TABLE IF NOT EXISTS equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_role TEXT NOT NULL,
  purpose TEXT NOT NULL,
  training_set_id UUID REFERENCES training_sets(id) ON DELETE SET NULL,
  training_set_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  required_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Request Items Table
CREATE TABLE IF NOT EXISTS equipment_request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  quantity_requested INTEGER NOT NULL,
  quantity_approved INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Assignments Table
CREATE TABLE IF NOT EXISTS equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES equipment_requests(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  return_condition TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Maintenance Records Table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  maintenance_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2),
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Equipment Inventory RLS
ALTER TABLE equipment_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment inventory visible to authenticated users"
  ON equipment_inventory FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment inventory editable by admins and training coordinators"
  ON equipment_inventory FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Requests RLS
ALTER TABLE equipment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment requests visible to authenticated users"
  ON equipment_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment requests insertable by authenticated users"
  ON equipment_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Equipment requests updatable by admins, training coordinators, and requesters"
  ON equipment_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    ) OR auth.uid() = requester_id
  );

-- Equipment Request Items RLS
ALTER TABLE equipment_request_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment request items visible to authenticated users"
  ON equipment_request_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment request items insertable by authenticated users"
  ON equipment_request_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Equipment request items updatable by admins and training coordinators"
  ON equipment_request_items FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Assignments RLS
ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment assignments visible to authenticated users"
  ON equipment_assignments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment assignments editable by admins and training coordinators"
  ON equipment_assignments FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Equipment Maintenance RLS
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment maintenance visible to authenticated users"
  ON equipment_maintenance FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Equipment maintenance editable by admins and training coordinators"
  ON equipment_maintenance FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role IN ('admin', 'training_coordinator', 'operations_manager')
    )
  );

-- Functions and Triggers

-- Function to update equipment available quantity when request is approved
CREATE OR REPLACE FUNCTION update_equipment_quantity_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE equipment_inventory
    SET available_quantity = available_quantity - NEW.quantity_approved
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment available quantity when request is approved
CREATE TRIGGER update_equipment_quantity_on_approval_trigger
AFTER UPDATE ON equipment_request_items
FOR EACH ROW
WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
EXECUTE FUNCTION update_equipment_quantity_on_approval();

-- Function to update equipment available quantity when equipment is returned
CREATE OR REPLACE FUNCTION update_equipment_quantity_on_return()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL THEN
    UPDATE equipment_inventory
    SET available_quantity = available_quantity + NEW.quantity
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment available quantity when equipment is returned
CREATE TRIGGER update_equipment_quantity_on_return_trigger
AFTER UPDATE ON equipment_assignments
FOR EACH ROW
WHEN (NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL)
EXECUTE FUNCTION update_equipment_quantity_on_return();

-- Function to update equipment inventory updated_at timestamp
CREATE OR REPLACE FUNCTION update_equipment_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment inventory updated_at timestamp
CREATE TRIGGER update_equipment_inventory_updated_at_trigger
BEFORE UPDATE ON equipment_inventory
FOR EACH ROW
EXECUTE FUNCTION update_equipment_inventory_updated_at();