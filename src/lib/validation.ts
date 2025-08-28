/**
 * Form validation utilities for Alpatech Onboard Hub
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (supports international format)
export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation that allows for international formats
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Name validation (allows letters, spaces, hyphens, and apostrophes)
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return nameRegex.test(name) && name.trim().length > 1;
};

// Passcode validation (4-digit numeric)
export const isValidPasscode = (passcode: string): boolean => {
  const passcodeRegex = /^\d{4}$/;
  return passcodeRegex.test(passcode);
};

// Custom passcode validation (any numeric)
export const isValidCustomPasscode = (passcode: string): boolean => {
  const passcodeRegex = /^\d+$/;
  return passcodeRegex.test(passcode);
};

// Required field validation
export const isRequired = (value: string | undefined | null): boolean => {
  return !!value && value.trim().length > 0;
};

// Date validation (checks if date is valid and not in the future)
export const isValidPastDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return !isNaN(date.getTime()) && date <= today;
};

// Date validation (checks if date is valid and not in the past)
export const isValidFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison
  
  return !isNaN(date.getTime()) && date >= today;
};

// Age validation (checks if age is within reasonable range)
export const isValidAge = (age: number): boolean => {
  return age >= 16 && age <= 100;
};

// File size validation (in bytes)
export const isValidFileSize = (fileSize: number, maxSizeInBytes: number): boolean => {
  return fileSize <= maxSizeInBytes;
};

// Image file type validation
export const isValidImageType = (fileType: string): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(fileType);
};

// Form validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Generic form validator
export const validateForm = <T extends Record<string, any>>(
  form: T,
  validationRules: Record<keyof T, (value: any) => boolean>,
  errorMessages: Record<keyof T, string>
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  for (const field in validationRules) {
    if (Object.prototype.hasOwnProperty.call(validationRules, field)) {
      const isFieldValid = validationRules[field](form[field]);
      
      if (!isFieldValid) {
        errors[field] = errorMessages[field];
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
};

// Form field validation hook for real-time validation
export const validateField = <T>(
  value: T,
  validationFn: (value: T) => boolean,
  errorMessage: string
): { isValid: boolean; errorMessage: string | null } => {
  const isValid = validationFn(value);
  return {
    isValid,
    errorMessage: isValid ? null : errorMessage
  };
};