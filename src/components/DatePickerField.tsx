import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import FormValidationMessage from './FormValidationMessage';

interface DatePickerFieldProps {
  label: string;
  name: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  validate?: (date: Date | undefined) => { isValid: boolean; errorMessage: string | null };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
  placeholder?: string;
  showValidMessage?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  calendarClassName?: string;
}

/**
 * A reusable date picker field component with built-in validation
 */
const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
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
  placeholder = 'Select a date',
  showValidMessage = false,
  minDate,
  maxDate,
  disabledDates,
  calendarClassName,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errorMessage: string | null }>({
    isValid: true,
    errorMessage: null,
  });
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    onChange(date);
    
    if (validate && validateOnChange) {
      const result = validate(date);
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

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      handleBlur();
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
      
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              displayError ? 'border-red-500 focus-visible:ring-red-500' : '',
              isValid ? 'border-green-500 focus-visible:ring-green-500' : ''
            )}
            disabled={disabled}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${name}-error` : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateChange}
            disabled={disabled || disabledDates}
            fromDate={minDate}
            toDate={maxDate}
            className={calendarClassName}
          />
        </PopoverContent>
      </Popover>
      
      <FormValidationMessage 
        message={displayError} 
        isValid={isValid}
        showValid={showValidMessage}
      />
    </div>
  );
};

export default DatePickerField;