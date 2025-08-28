import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped' | 'error';
}

export interface ProgressTrackerProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onStepClick?: (step: Step) => void;
  showLabels?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  orientation = 'horizontal',
  size = 'md',
  className,
  onStepClick,
  showLabels = true
}) => {
  const isVertical = orientation === 'vertical';
  
  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-full w-full" />;
      case 'current':
        return <Circle className="h-full w-full" />;
      case 'error':
        return <AlertCircle className="h-full w-full" />;
      default:
        return <Circle className="h-full w-full" />;
    }
  };
  
  const getStepColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 border-green-500';
      case 'current':
        return 'text-blue-500 border-blue-500';
      case 'error':
        return 'text-red-500 border-red-500';
      case 'skipped':
        return 'text-gray-400 border-gray-400';
      default:
        return 'text-gray-300 border-gray-300';
    }
  };
  
  const getStepSize = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6';
      case 'lg':
        return 'h-10 w-10';
      default:
        return 'h-8 w-8';
    }
  };
  
  const getConnectorColor = (index: number) => {
    const currentStep = steps[index];
    const nextStep = steps[index + 1];
    
    if (!nextStep) return '';
    
    if (currentStep.status === 'completed') {
      return 'bg-green-500';
    } else if (currentStep.status === 'error' || nextStep.status === 'error') {
      return 'bg-red-500';
    } else if (currentStep.status === 'current') {
      return 'bg-blue-500';
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div 
      className={cn(
        'flex',
        isVertical ? 'flex-col space-y-4' : 'flex-row items-center justify-between',
        className
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={cn(
              'flex',
              isVertical ? 'flex-row items-center' : 'flex-col items-center',
              onStepClick ? 'cursor-pointer' : ''
            )}
            onClick={() => onStepClick && onStepClick(step)}
          >
            <div 
              className={cn(
                'rounded-full border-2 flex items-center justify-center',
                getStepSize(),
                getStepColor(step.status)
              )}
            >
              {getStepIcon(step.status)}
            </div>
            
            {showLabels && (
              <div 
                className={cn(
                  'text-sm',
                  isVertical ? 'ml-3' : 'mt-2 text-center',
                  step.status === 'current' ? 'font-medium' : '',
                  step.status === 'completed' ? 'text-green-700' : '',
                  step.status === 'error' ? 'text-red-700' : '',
                  step.status === 'skipped' ? 'text-gray-500' : '',
                  step.status === 'upcoming' ? 'text-gray-500' : ''
                )}
              >
                <div className="font-medium">{step.title}</div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                )}
              </div>
            )}
          </div>
          
          {index < steps.length - 1 && (
            <div 
              className={cn(
                isVertical 
                  ? 'w-0.5 h-8 ml-3.5' 
                  : 'h-0.5 flex-1 mx-2',
                getConnectorColor(index)
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressTracker;