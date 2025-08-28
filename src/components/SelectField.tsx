import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import FormValidationMessage from './FormValidationMessage';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  validate?: (value: string) => { isValid: boolean; errorMessage: string | null };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  placeholder?: string;
  showValidMessage?: boolean;
}

/**
 * A reusable select field component with built-in validation
 */
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
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
  placeholder = 'Select an option',
  showValidMessage = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errorMessage: string | null }>({
    isValid: true,
    errorMessage: null,
  });

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    
    if (validate && validateOnChange) {
      const result = validate(newValue);
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
      
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        disabled={disabled}
        onOpenChange={(open) => {
          if (!open) handleBlur();
        }}
      >
        <SelectTrigger 
          id={name}
          className={`${displayError ? 'border-red-500 focus-visible:ring-red-500' : ''} 
                     ${isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <FormValidationMessage 
        message={displayError} 
        isValid={isValid}
        showValid={showValidMessage}
      />
    </div>
  );
};

export default SelectField;