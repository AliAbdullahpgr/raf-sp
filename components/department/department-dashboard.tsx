"use client";

import { useDepartmentStatsBySlug } from "@/hooks/use-dashboard";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { EquipmentStatusChart } from "@/components/dashboard/equipment-status-chart";
import { EquipmentTypeChart } from "@/components/dashboard/equipment-type-chart";
import { LoadingState } from "@/components/ui/loading-spinner";
import { BarChart3 } from "lucide-react";

interface DepartmentDashboardProps {
  departmentId: string; // This is actually the slug
}

export function DepartmentDashboard({
  departmentId: departmentSlug,
}: DepartmentDashboardProps) {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useDepartmentStatsBySlug(departmentSlug);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-[#2678E7]" />
        <h2 className="text-xl font-semibold text-gray-900">
          Overview of Equipment Inventory and Statistics
        </h2>
      </div>

      <LoadingState
        isLoading={isLoading}
        error={error}
        loadingText="Loading department statistics..."
        errorText="Failed to load department statistics"
        onRetry={() => refetch()}
      >
        {stats ? (
          <>
            <StatsOverview stats={stats} />
            <div className="grid gap-6 lg:grid-cols-2">
              <EquipmentStatusChart stats={stats} />
              <EquipmentTypeChart stats={stats} />
            </div>
          </>
        ) : !isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No statistics available</p>
            <p className="text-sm text-gray-400">
              Statistics will be displayed once equipment data is available
            </p>
          </div>
        ) : null}
      </LoadingState>
    </div>
  );
}
