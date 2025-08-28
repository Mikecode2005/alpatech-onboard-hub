import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FormValidationMessage from './FormValidationMessage';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  validate?: (value: string) => { isValid: boolean; errorMessage: string | null };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  autoComplete?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  pattern?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  showValidMessage?: boolean;
}

/**
 * A reusable form field component with built-in validation
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error = null,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  className = '',
  autoComplete,
  maxLength,
  min,
  max,
  pattern,
  inputMode,
  showValidMessage = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errorMessage: string | null }>({
    isValid: true,
    errorMessage: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    
    if (validate && validateOnChange) {
      const result = validate(e.target.value);
      setValidationResult(result);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    
    if (validate && validateOnBlur) {
      const result = validate(value);
      setValidationResult(result);
    }
    
    if (onBlur) {
      onBlur();
    }
  };

  // Determine the error message to display
  const displayError = touched ? (error || validationResult.errorMessage) : null;
  
  // Determine if the field is valid
  const isValid = touched && !error && (!validate || validationResult.isValid);

  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={name} className="flex">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`${displayError ? 'border-red-500 focus-visible:ring-red-500' : ''} 
                   ${isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
        autoComplete={autoComplete}
        maxLength={maxLength}
        min={min}
        max={max}
        pattern={pattern}
        inputMode={inputMode}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${name}-error` : undefined}
      />
      
      <FormValidationMessage 
        message={displayError} 
        isValid={isValid}
        showValid={showValidMessage}
      />
    </div>
  );
};

export default FormField;