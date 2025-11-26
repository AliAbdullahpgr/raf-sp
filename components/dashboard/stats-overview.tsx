"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types";
import {
  Package,
  CheckCircle,
  Clock,
  Wrench,
  Trash2,
  DollarSign,
} from "lucide-react";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Available",
      value: stats.availableCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "In Use",
      value: stats.inUseCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Needs Repair",
      value: stats.needsRepairCount,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Discarded",
      value: stats.discardedCount,
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Total Maintenance Cost",
      value: `$${stats.totalMaintenanceCost.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
