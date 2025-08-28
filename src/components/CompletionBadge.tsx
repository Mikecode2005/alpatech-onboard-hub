import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export type CompletionStatus = 
  | 'completed' 
  | 'in-progress' 
  | 'pending' 
  | 'overdue' 
  | 'failed' 
  | 'expired' 
  | 'cancelled' 
  | 'not-required' 
  | 'unknown';

export interface CompletionBadgeProps {
  status: CompletionStatus;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  customLabel?: string;
}

const CompletionBadge: React.FC<CompletionBadgeProps> = ({
  status,
  showIcon = true,
  showLabel = true,
  className,
  size = 'md',
  customLabel
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          variant: 'success' as const,
          icon: <CheckCircle />,
          label: 'Completed'
        };
      case 'in-progress':
        return {
          variant: 'default' as const,
          icon: <Clock />,
          label: 'In Progress'
        };
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: <Clock />,
          label: 'Pending'
        };
      case 'overdue':
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle />,
          label: 'Overdue'
        };
      case 'failed':
        return {
          variant: 'destructive' as const,
          icon: <XCircle />,
          label: 'Failed'
        };
      case 'expired':
        return {
          variant: 'outline' as const,
          icon: <XCircle />,
          label: 'Expired'
        };
      case 'cancelled':
        return {
          variant: 'outline' as const,
          icon: <XCircle />,
          label: 'Cancelled'
        };
      case 'not-required':
        return {
          variant: 'outline' as const,
          icon: <CheckCircle />,
          label: 'Not Required'
        };
      case 'unknown':
      default:
        return {
          variant: 'outline' as const,
          icon: <HelpCircle />,
          label: 'Unknown'
        };
    }
  };

  const { variant, icon, label } = getStatusConfig();
  const displayLabel = customLabel || label;

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0 px-2';
      case 'lg':
        return 'text-sm py-1 px-3';
      default:
        return 'text-xs py-0.5 px-2.5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={cn(
        'flex items-center gap-1 font-medium',
        getSizeClass(),
        className
      )}
    >
      {showIcon && (
        <span className={cn(getIconSize(), 'flex-shrink-0')}>
          {icon}
        </span>
      )}
      {showLabel && displayLabel}
    </Badge>
  );
};

// Add success variant to Badge component
// This should be added to the Badge component in your UI library
// If you're using shadcn/ui, you can extend the variants in your theme
// For this example, we're assuming the success variant is already defined

export default CompletionBadge;