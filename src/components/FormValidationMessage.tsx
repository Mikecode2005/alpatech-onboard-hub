import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormValidationMessageProps {
  message: string | null;
  isValid?: boolean;
  showValid?: boolean;
}

/**
 * A component to display form validation messages
 * 
 * @param message - The validation message to display
 * @param isValid - Whether the field is valid
 * @param showValid - Whether to show a success message when valid
 */
const FormValidationMessage: React.FC<FormValidationMessageProps> = ({
  message,
  isValid = false,
  showValid = false,
}) => {
  if (!message && !(isValid && showValid)) return null;

  if (isValid && showValid) {
    return (
      <div className="flex items-center mt-1 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-1" />
        <span>Valid</span>
      </div>
    );
  }

  if (!isValid && message) {
    return (
      <div className="flex items-center mt-1 text-sm text-red-500">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{message}</span>
      </div>
    );
  }

  return null;
};

export default FormValidationMessage;