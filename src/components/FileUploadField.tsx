import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Upload, FileCheck } from 'lucide-react';
import FormValidationMessage from './FormValidationMessage';
import { isValidFileSize, isValidImageType } from '@/lib/validation';

interface FileUploadFieldProps {
  label: string;
  name: string;
  accept?: string;
  maxSizeInKB?: number;
  value?: File | null;
  dataUrl?: string | null;
  onChange: (file: File | null, dataUrl?: string | null) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  className?: string;
  showPreview?: boolean;
  previewHeight?: string;
  previewWidth?: string;
  validateTypes?: boolean;
}

/**
 * A reusable file upload field component with built-in validation
 */
const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept = 'image/*',
  maxSizeInKB = 200,
  value,
  dataUrl,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error = null,
  className = '',
  showPreview = true,
  previewHeight = '100px',
  previewWidth = 'auto',
  validateTypes = true,
}) => {
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTouched(true);
    
    if (!file) {
      onChange(null, null);
      setValidationError(null);
      return;
    }
    
    // Validate file size
    const maxSizeInBytes = maxSizeInKB * 1024;
    if (!isValidFileSize(file.size, maxSizeInBytes)) {
      setValidationError(`File size must be less than ${maxSizeInKB}KB`);
      onChange(null, null);
      return;
    }
    
    // Validate file type if required
    if (validateTypes && accept.includes('image') && !isValidImageType(file.type)) {
      setValidationError('Invalid file type. Please upload an image file.');
      onChange(null, null);
      return;
    }
    
    setIsLoading(true);
    
    // Read file as data URL for preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setValidationError('Error reading file');
        onChange(null, null);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(file);
      setIsLoading(false);
    }
    
    setValidationError(null);
  };

  const handleBlur = () => {
    setTouched(true);
    if (onBlur) onBlur();
  };

  const clearFile = () => {
    onChange(null, null);
    setValidationError(null);
  };

  // Determine the error message to display
  const displayError = touched ? (error || validationError) : null;
  
  // Determine if the field is valid
  const isValid = touched && !error && !validationError && (value || dataUrl);

  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={name} className="flex">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="space-y-2">
        {!value && !dataUrl ? (
          <div className="relative">
            <Input
              id={name}
              name={name}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              onBlur={handleBlur}
              disabled={disabled || isLoading}
              className={`${displayError ? 'border-red-500 focus-visible:ring-red-500' : ''} 
                         ${isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              aria-invalid={!!displayError}
              aria-describedby={displayError ? `${name}-error` : undefined}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {value?.name || 'File uploaded'}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              disabled={disabled || isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          {accept === 'image/*' 
            ? `Accepted formats: JPEG, PNG, GIF, WEBP. Maximum size: ${maxSizeInKB}KB.`
            : `Maximum size: ${maxSizeInKB}KB.`
          }
        </p>
        
        {showPreview && dataUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Preview:</p>
            <div className="border rounded p-2 bg-background">
              <img 
                src={dataUrl} 
                alt="Preview" 
                style={{ 
                  height: previewHeight, 
                  width: previewWidth, 
                  objectFit: 'contain' 
                }} 
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
      
      <FormValidationMessage 
        message={displayError} 
        isValid={isValid}
      />
    </div>
  );
};

export default FileUploadField;