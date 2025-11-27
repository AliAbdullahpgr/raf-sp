"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardStats } from "@/types";

interface EquipmentTypeChartProps {
  stats: DashboardStats;
}

export function EquipmentTypeChart({ stats }: EquipmentTypeChartProps) {
  const data = stats.equipmentByType;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Distribution by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No equipment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Equipment Distribution by Type
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="type"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              fontSize={10}
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                // Truncate long text and add ellipsis
                return value.length > 15
                  ? `${value.substring(0, 12)}...`
                  : value;
              }}
            />
            <YAxis
              fontSize={window.innerWidth > 640 ? 12 : 10}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value, name, props) => [value, name]}
              labelFormatter={(label) => `Equipment Type: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#2678E7"
              name="Equipment Count"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EquipmentTypeChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Distribution by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-full h-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
