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
    <Card>
      <CardHeader>
        <CardTitle>Equipment Distribution by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="type"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              fill="#134866"
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
