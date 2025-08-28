import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  footerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  submitButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero";
  cancelButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * A container component for forms with consistent styling
 */
const FormContainer: React.FC<FormContainerProps> = ({
  title,
  description,
  children,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  isSubmitting = false,
  className = '',
  footerClassName = '',
  headerClassName = '',
  contentClassName = '',
  submitButtonVariant = 'hero',
  cancelButtonVariant = 'outline',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Card className={className}>
      <CardHeader className={headerClassName}>
        <CardTitle className="text-center">
          <div className="text-2xl font-bold mb-2">{title}</div>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-6 ${contentClassName}`}>
          {children}
        </CardContent>
        
        <CardFooter className={`flex justify-center ${footerClassName}`}>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button 
              type="submit"
              variant={submitButtonVariant}
              className="w-full text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : submitText}
            </Button>
            
            {onCancel && (
              <Button 
                type="button"
                variant={cancelButtonVariant}
                onClick={onCancel}
                className="w-full"
                disabled={isSubmitting}
              >
                {cancelText}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormContainer;