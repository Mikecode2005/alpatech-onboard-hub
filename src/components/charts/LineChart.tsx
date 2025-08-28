import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface LineChartProps {
  data: any[];
  xAxisDataKey: string;
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
  }[];
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number, name: string, props: TooltipProps<any, any>) => React.ReactNode;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisDataKey,
  lines,
  title,
  description,
  height = 300,
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
      <RechartsLineChart
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
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            dot={line.dot !== false}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
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

export default LineChart;