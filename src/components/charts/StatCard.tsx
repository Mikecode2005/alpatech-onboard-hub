import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  footer?: ReactNode;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  footer,
  className,
  valueClassName,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden", 
        onClick && "cursor-pointer hover:shadow-md transition-shadow", 
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={valueClassName}>{value}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground ml-1">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
      {footer && <CardFooter className="px-4 py-3 border-t">{footer}</CardFooter>}
    </Card>
  );
};

export default StatCard;