/**
 * Utility functions for form handling
 */

import { ValidationResult } from './validation';

/**
 * Creates a form state handler with validation
 * 
 * @param initialState - The initial form state
 * @param validateFn - Optional validation function
 * @returns Form state handlers
 */
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  validateFn?: (form: T) => ValidationResult
) {
  let formState = { ...initialState };
  let errors: Record<string, string> = {};
  let touched: Record<string, boolean> = {};
  
  // Update a single field
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    formState = { ...formState, [field]: value };
    touched = { ...touched, [field]: true };
    
    if (validateFn) {
      const result = validateFn(formState);
      errors = result.errors;
    }
    
    return formState;
  };
  
  // Update multiple fields at once
  const updateFields = (updates: Partial<T>) => {
    formState = { ...formState, ...updates };
    
    // Mark updated fields as touched
    Object.keys(updates).forEach(key => {
      touched[key] = true;
    });
    
    if (validateFn) {
      const result = validateFn(formState);
      errors = result.errors;
    }
    
    return formState;
  };
  
  // Reset the form to initial state
  const resetForm = () => {
    formState = { ...initialState };
    errors = {};
    touched = {};
    return formState;
  };
  
  // Mark all fields as touched and validate
  const validateForm = () => {
    // Mark all fields as touched
    Object.keys(formState).forEach(key => {
      touched[key] = true;
    });
    
    if (validateFn) {
      const result = validateFn(formState);
      errors = result.errors;
      return result.isValid;
    }
    
    return true;
  };
  
  // Get error for a specific field
  const getFieldError = (field: keyof T): string | undefined => {
    return touched[field as string] ? errors[field as string] : undefined;
  };
  
  // Check if a field is touched
  const isFieldTouched = (field: keyof T): boolean => {
    return !!touched[field as string];
  };
  
  // Mark a field as touched
  const touchField = (field: keyof T) => {
    touched = { ...touched, [field]: true };
  };
  
  return {
    formState,
    errors,
    touched,
    updateField,
    updateFields,
    resetForm,
    validateForm,
    getFieldError,
    isFieldTouched,
    touchField,
  };
}

/**
 * Formats form data for submission
 * 
 * @param formData - The form data to format
 * @returns Formatted form data
 */
export function formatFormData<T extends Record<string, any>>(formData: T): FormData {
  const data = new FormData();
  
  Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof File) {
      data.append(key, value);
    } else if (value instanceof Date) {
      data.append(key, value.toISOString());
    } else if (value === null || value === undefined) {
      // Skip null or undefined values
    } else if (typeof value === 'object') {
      data.append(key, JSON.stringify(value));
    } else {
      data.append(key, String(value));
    }
  });
  
  return data;
}

/**
 * Serializes form data to JSON
 * 
 * @param formData - The form data to serialize
 * @returns Serialized form data
 */
export function serializeFormData<T extends Record<string, any>>(formData: T): Record<string, any> {
  const serialized: Record<string, any> = {};
  
  Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (value instanceof File) {
      // Skip files as they can't be serialized to JSON
      serialized[key] = null;
    } else {
      serialized[key] = value;
    }
  });
  
  return serialized;
}

/**
 * Extracts form field errors from a server response
 * 
 * @param error - The error object from the server
 * @returns Field errors
 */
export function extractFieldErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  if (error?.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0] as string;
      } else if (typeof messages === 'string') {
        fieldErrors[field] = messages;
      }
    });
  }
  
  return fieldErrors;
}