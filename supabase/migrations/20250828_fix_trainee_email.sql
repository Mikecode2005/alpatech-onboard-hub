-- Fix the trainee_email foreign key constraint issue

-- First, modify the passcodes table to use UUID instead of text for trainee_email
ALTER TABLE IF EXISTS passcodes 
DROP CONSTRAINT IF EXISTS passcodes_trainee_email_fkey;

-- Update the passcodes table to use user_id instead of trainee_email
ALTER TABLE IF EXISTS passcodes 
ADD COLUMN user_id UUID;

-- Update existing records to match user_id from users table based on email
UPDATE passcodes p
SET user_id = u.id
FROM users u
WHERE p.trainee_email = u.email;

-- Add foreign key constraint to user_id
ALTER TABLE IF EXISTS passcodes
ADD CONSTRAINT passcodes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Make similar changes to other tables with trainee_email foreign key
-- welcome_policy_forms
ALTER TABLE IF EXISTS welcome_policy_forms
DROP CONSTRAINT IF EXISTS welcome_policy_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS welcome_policy_forms
ADD COLUMN user_id UUID;

UPDATE welcome_policy_forms w
SET user_id = u.id
FROM users u
WHERE w.trainee_email = u.email;

ALTER TABLE IF EXISTS welcome_policy_forms
ADD CONSTRAINT welcome_policy_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- course_registration_forms
ALTER TABLE IF EXISTS course_registration_forms
DROP CONSTRAINT IF EXISTS course_registration_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS course_registration_forms
ADD COLUMN user_id UUID;

UPDATE course_registration_forms c
SET user_id = u.id
FROM users u
WHERE c.trainee_email = u.email;

ALTER TABLE IF EXISTS course_registration_forms
ADD CONSTRAINT course_registration_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- medical_screening_forms
ALTER TABLE IF EXISTS medical_screening_forms
DROP CONSTRAINT IF EXISTS medical_screening_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS medical_screening_forms
ADD COLUMN user_id UUID;

UPDATE medical_screening_forms m
SET user_id = u.id
FROM users u
WHERE m.trainee_email = u.email;

ALTER TABLE IF EXISTS medical_screening_forms
ADD CONSTRAINT medical_screening_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- training_assignments
ALTER TABLE IF EXISTS training_assignments
DROP CONSTRAINT IF EXISTS training_assignments_trainee_email_fkey;

ALTER TABLE IF EXISTS training_assignments
ADD COLUMN user_id UUID;

UPDATE training_assignments t
SET user_id = u.id
FROM users u
WHERE t.trainee_email = u.email;

ALTER TABLE IF EXISTS training_assignments
ADD CONSTRAINT training_assignments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- bosiet_forms
ALTER TABLE IF EXISTS bosiet_forms
DROP CONSTRAINT IF EXISTS bosiet_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS bosiet_forms
ADD COLUMN user_id UUID;

UPDATE bosiet_forms b
SET user_id = u.id
FROM users u
WHERE b.trainee_email = u.email;

ALTER TABLE IF EXISTS bosiet_forms
ADD CONSTRAINT bosiet_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- fire_watch_forms
ALTER TABLE IF EXISTS fire_watch_forms
DROP CONSTRAINT IF EXISTS fire_watch_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS fire_watch_forms
ADD COLUMN user_id UUID;

UPDATE fire_watch_forms f
SET user_id = u.id
FROM users u
WHERE f.trainee_email = u.email;

ALTER TABLE IF EXISTS fire_watch_forms
ADD CONSTRAINT fire_watch_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- cser_forms
ALTER TABLE IF EXISTS cser_forms
DROP CONSTRAINT IF EXISTS cser_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS cser_forms
ADD COLUMN user_id UUID;

UPDATE cser_forms c
SET user_id = u.id
FROM users u
WHERE c.trainee_email = u.email;

ALTER TABLE IF EXISTS cser_forms
ADD CONSTRAINT cser_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- usee_uact_forms
ALTER TABLE IF EXISTS usee_uact_forms
DROP CONSTRAINT IF EXISTS usee_uact_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS usee_uact_forms
ADD COLUMN user_id UUID;

UPDATE usee_uact_forms u
SET user_id = u2.id
FROM users u2
WHERE u.trainee_email = u2.email;

ALTER TABLE IF EXISTS usee_uact_forms
ADD CONSTRAINT usee_uact_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- size_forms
ALTER TABLE IF EXISTS size_forms
DROP CONSTRAINT IF EXISTS size_forms_trainee_email_fkey;

ALTER TABLE IF EXISTS size_forms
ADD COLUMN user_id UUID;

UPDATE size_forms s
SET user_id = u.id
FROM users u
WHERE s.trainee_email = u.email;

ALTER TABLE IF EXISTS size_forms
ADD CONSTRAINT size_forms_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

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

-- Create similar policies for other toolbox talk tables