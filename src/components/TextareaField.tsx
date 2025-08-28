import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormValidationMessage from './FormValidationMessage';

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  validate?: (value: string) => { isValid: boolean; errorMessage: string | null };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  showValidMessage?: boolean;
}

/**
 * A reusable textarea field component with built-in validation
 */
const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
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
  rows = 3,
  maxLength,
  showValidMessage = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errorMessage: string | null }>({
    isValid: true,
    errorMessage: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`${displayError ? 'border-red-500 focus-visible:ring-red-500' : ''} 
                   ${isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${name}-error` : undefined}
      />
      
      {maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {value.length}/{maxLength} characters
        </div>
      )}
      
      <FormValidationMessage 
        message={displayError} 
        isValid={isValid}
        showValid={showValidMessage}
      />
    </div>
  );
};

export default TextareaField;