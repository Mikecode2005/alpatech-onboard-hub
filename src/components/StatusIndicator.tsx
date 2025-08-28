import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'default' 
  | 'pending';

export interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  label,
  showLabel = false,
  className,
  animate = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-purple-500';
      case 'default':
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2';
      case 'lg':
        return 'h-4 w-4';
      case 'md':
      default:
        return 'h-3 w-3';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      case 'md':
      default:
        return 'text-xs';
    }
  };

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span 
        className={cn(
          'rounded-full',
          getStatusColor(),
          getStatusSize(),
          animate && 'animate-pulse'
        )}
      />
      {showLabel && (
        <span className={cn('font-medium', getTextSize())}>
          {displayLabel}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;