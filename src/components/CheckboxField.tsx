import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FormValidationMessage from './FormValidationMessage';

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  validate?: (checked: boolean) => { isValid: boolean; errorMessage: string | null };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  description?: string;
}

/**
 * A reusable checkbox field component with built-in validation
 */
const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error = null,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  className = '',
  description,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errorMessage: string | null }>({
    isValid: true,
    errorMessage: null,
  });

  const handleCheckedChange = (checked: boolean) => {
    onChange(checked);
    
    if (validate && validateOnChange) {
      const result = validate(checked);
      setValidationResult(result);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    
    if (validate && validateOnBlur) {
      const result = validate(checked);
      setValidationResult(result);
    }
    
    if (onBlur) {
      onBlur();
    }
  };

  // Determine the error message to display
  const displayError = touched ? (error || validationResult.errorMessage) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          onBlur={handleBlur}
          disabled={disabled}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : undefined}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor={name}
            className="flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <FormValidationMessage message={displayError} />
    </div>
  );
};

export default CheckboxField;