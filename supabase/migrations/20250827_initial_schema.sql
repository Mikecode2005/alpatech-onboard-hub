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


