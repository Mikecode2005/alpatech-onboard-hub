import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface BarChartProps {
  data: any[];
  xAxisDataKey: string;
  bars: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  title?: string;
  description?: string;
  height?: number;
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number, name: string, props: TooltipProps<any, any>) => React.ReactNode;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey,
  bars,
  title,
  description,
  height = 300,
  stacked = false,
  showGrid = true,
  showLegend = true,
  className = '',
  formatYAxis,
  formatTooltip
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisDataKey} />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={formatTooltip} />
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  if (title || description) {
    return (
      <Card className={className}>
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {chart}
        </CardContent>
      </Card>
    );
  }

  return chart;
};

export default BarChart;