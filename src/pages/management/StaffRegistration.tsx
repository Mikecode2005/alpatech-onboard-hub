import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/state/appState';
import FormContainer from '@/components/FormContainer';
import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import FormSection from '@/components/FormSection';
import { isValidEmail, isRequired, validateField } from '@/lib/validation';
import { getStaffRoles, Role } from '@/lib/rbac';

interface StaffRegistrationForm {
  email: string;
  name: string;
  role: Role;
  password: string;
  confirmPassword: string;
}

const StaffRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState<StaffRegistrationForm>({
    email: '',
    name: '',
    role: 'Other Staff',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Convert staff roles to select options
  const roleOptions = getStaffRoles().map(role => ({
    value: role,
    label: role,
  }));
  
  const handleChange = (field: keyof StaffRegistrationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Special handling for password confirmation
    if (field === 'password' && form.confirmPassword) {
      validatePasswordMatch(value, form.confirmPassword);
    }
    if (field === 'confirmPassword') {
      validatePasswordMatch(form.password, value);
    }
  };
  
  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (!isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate name
    if (!isRequired(form.name)) {
      newErrors.name = 'Name is required';
    }
    
    // Validate role
    if (!isRequired(form.role)) {
      newErrors.role = 'Role is required';
    }
    
    // Validate password
    if (!isRequired(form.password)) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual staff registration with Supabase
      // For now, we'll just simulate a successful registration
      
      setTimeout(() => {
        toast({
          title: 'Staff Registration Successful',
          description: `${form.name} has been registered as ${form.role}`,
        });
        
        setIsSubmitting(false);
        navigate('/management/manage-users');
      }, 1500);
    } catch (error) {
      console.error('Error registering staff:', error);
      toast({
        title: 'Registration Failed',
        description: 'There was an error registering the staff member',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Helmet>
        <title>Staff Registration | Alpatech Training Portal</title>
        <meta name="description" content="Register new staff members for the Alpatech Training Portal" />
      </Helmet>
      
      <FormContainer
        title="Staff Registration"
        description="Register a new staff member for the Alpatech Training Portal"
        onSubmit={handleSubmit}
        submitText="Register Staff Member"
        onCancel={() => navigate('/management/manage-users')}
        isSubmitting={isSubmitting}
      >
        <FormSection title="Staff Information">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="staff.email@alpatech.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            error={errors.email}
            validate={(value) => validateField(value, isValidEmail, 'Please enter a valid email address')}
            validateOnBlur
          />
          
          <FormField
            label="Full Name"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            error={errors.name}
            validate={(value) => validateField(value, isRequired, 'Name is required')}
            validateOnBlur
          />
          
          <SelectField
            label="Role"
            name="role"
            options={roleOptions}
            value={form.role}
            onChange={(value) => handleChange('role', value)}
            required
            error={errors.role}
          />
        </FormSection>
        
        <FormSection title="Security">
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            error={errors.password}
            validate={(value) => validateField(
              value,
              (v) => isRequired(v) && v.length >= 8,
              'Password must be at least 8 characters'
            )}
            validateOnBlur
          />
          
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            required
            error={errors.confirmPassword}
          />
        </FormSection>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> New staff members will be able to log in using the email and password provided here.
            Please ensure the email address is correct and communicate the password securely to the staff member.
          </p>
        </div>
      </FormContainer>
    </div>
  );
};

export default StaffRegistration;