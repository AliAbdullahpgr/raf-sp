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
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment.toLocaleString(),
      icon: Package,
      color: "text-[#2678E7]",
      bgColor: "bg-[#2678E7]/10",
      trend: "+20%",
      trendUp: true,
      subtitle: "From the last month",
    },
    {
      title: "Available",
      value: stats.availableCount.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+10%",
      trendUp: true,
      subtitle: "From the last month",
    },
    {
      title: "In Use",
      value: stats.inUseCount.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "+5%",
      trendUp: true,
      subtitle: "From the last month",
    },
    {
      title: "Needs Repair",
      value: stats.needsRepairCount.toLocaleString(),
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "-15%",
      trendUp: false,
      subtitle: "From the last month",
    },
    {
      title: "Discarded",
      value: stats.discardedCount.toLocaleString(),
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "-10%",
      trendUp: false,
      subtitle: "From the last month",
    },
    {
      title: "Total Maintenance Cost",
      value: `$${stats.totalMaintenanceCost.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+25%",
      trendUp: true,
      subtitle: "From the last month",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      stat.trendUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
