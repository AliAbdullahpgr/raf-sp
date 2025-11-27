"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDashboardStats, getAllDepartmentsStats } from "@/actions/stats";
import { getDepartmentBySlug } from "@/actions/department-equipment";

interface DashboardStats {
  totalEquipment: number;
  availableCount: number;
  inUseCount: number;
  needsRepairCount: number;
  discardedCount: number;
  equipmentByType: { type: string; count: number }[];
  recentEquipment: any[];
  totalMaintenanceCost: number;
}

// Hook for fetching dashboard stats
export function useDashboardStats(departmentId?: string) {
  return useQuery({
    queryKey: departmentId
      ? queryKeys.dashboardStatsByDepartment(departmentId)
      : queryKeys.dashboardStats(),
    queryFn: () => getDashboardStats(departmentId),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });
}

// Hook for fetching dashboard stats across all departments
export function useAllDepartmentsStats() {
  return useQuery({
    queryKey: queryKeys.allDepartmentsStats(),
    queryFn: () => getAllDepartmentsStats(),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });
}

// Hook for fetching department stats by slug
export function useDepartmentStatsBySlug(departmentSlug: string) {
  return useQuery({
    queryKey: ["department-stats-by-slug", departmentSlug, "v2"],
    queryFn: async () => {
      // First get the department ID from the slug
      const deptResult = await getDepartmentBySlug(departmentSlug);
      if (!deptResult.success || !deptResult.data) {
        throw new Error(deptResult.message || "Department not found");
      }

      // Then get the stats for that department
      const stats = await getDashboardStats(deptResult.data.id);
      return stats;
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}
