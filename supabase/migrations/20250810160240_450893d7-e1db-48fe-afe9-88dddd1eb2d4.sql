-- Create user profiles table for authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

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

-- Create passcodes table for user generation
CREATE TABLE public.passcodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.passcodes ENABLE ROW LEVEL SECURITY;

-- Create policies for passcodes
CREATE POLICY "Training coordinators can manage passcodes" 
ON public.passcodes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Training Coordinator', 'Chief Operations Officer')
  )
);

CREATE POLICY "Anyone can view unused passcodes for validation" 
ON public.passcodes 
FOR SELECT 
USING (is_used = false AND expires_at > now());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'Trainee'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();