"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/types";
import { EquipmentStatus } from "@prisma/client";

/**
 * Get dashboard statistics with role-based filtering
 * - ADMIN users see stats across all departments
 * - DEPT_HEAD users see stats only for their assigned department
 */
export async function getDashboardStats(
  departmentId?: string
): Promise<DashboardStats> {
  try {
    const session = await auth();

    // If no session, treat as public view (show all data)
    let role = "PUBLIC";
    let userDepartmentId = null;

    if (session && session.user) {
      role = session.user.role;
      userDepartmentId = session.user.departmentId;
    }

    // Determine which department to filter by
    let filterDepartmentId: string | undefined;

    if (role === "ADMIN") {
      // Admin can optionally filter by department, or see all
      filterDepartmentId = departmentId;
    } else if (role === "DEPT_HEAD") {
      // Department heads can only see their own department
      if (!userDepartmentId) {
        throw new Error("Department head must be assigned to a department");
      }
      filterDepartmentId = userDepartmentId;
    } else if (role === "PUBLIC") {
      // Public users can view specific department if provided
      filterDepartmentId = departmentId;
    } else {
      throw new Error("Invalid role");
    }

    // If we have a specific department ID, try to get stats from department-specific tables
    if (filterDepartmentId) {
      return await getDepartmentSpecificStats(filterDepartmentId);
    }

    // If no specific department, get stats from all department-specific tables
    return await getAllDepartmentsStats();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Get department-specific statistics from department-specific equipment tables
 */
async function getDepartmentSpecificStats(
  departmentId: string
): Promise<DashboardStats> {
  try {
    // Get all equipment from department-specific tables for this department
    const foodAnalysisEquipment =
      // @ts-ignore - Prisma client type issue
      await prisma.foodAnalysisLabEquipment.findMany({
        where: { departmentId },
      });

    // For now, just use the food analysis equipment
    // TODO: Add other department-specific tables
    const allEquipment = [...foodAnalysisEquipment];

    const totalEquipment = allEquipment.length;

    // Count by status (normalize status values)
    const statusCounts = allEquipment.reduce((acc, item) => {
      const status = normalizeStatus(item.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const availableCount = statusCounts.AVAILABLE || 0;
    const inUseCount = statusCounts.IN_USE || 0;
    const needsRepairCount = statusCounts.NEEDS_REPAIR || 0;
    const discardedCount = statusCounts.DISCARDED || 0;

    // Count by type
    const typeCounts = allEquipment.reduce((acc, item) => {
      const type = item.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const equipmentByType = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count);

    // Get recent equipment (last 10)
    const recentEquipment = allEquipment
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: normalizeStatus(item.status) as EquipmentStatus,
        purchaseDate: item.createdAt, // Use createdAt as purchaseDate for now
        department: { name: "Department" }, // We'll need to fetch this separately if needed
      }));

    // For now, set maintenance cost to 0 since department-specific tables don't have maintenance logs
    const totalMaintenanceCost = 0;

    return {
      totalEquipment,
      availableCount,
      inUseCount,
      needsRepairCount,
      discardedCount,
      equipmentByType,
      recentEquipment,
      totalMaintenanceCost,
    };
  } catch (error) {
    console.error("Error fetching department-specific stats:", error);
    throw error;
  }
}

/**
 * Normalize status values from different tables to standard enum values
 */
function normalizeStatus(status: string): EquipmentStatus {
  const statusUpper = status.toUpperCase();

  if (
    statusUpper.includes("FUNCTIONAL") ||
    statusUpper.includes("WORKING") ||
    statusUpper.includes("AVAILABLE")
  ) {
    return EquipmentStatus.AVAILABLE;
  }
  if (
    statusUpper.includes("NON_FUNCTIONAL") ||
    statusUpper.includes("NOT_WORKING") ||
    statusUpper.includes("REPAIR")
  ) {
    return EquipmentStatus.NEEDS_REPAIR;
  }
  if (
    statusUpper.includes("DISCARDED") ||
    statusUpper.includes("OUT_OF_ORDER")
  ) {
    return EquipmentStatus.DISCARDED;
  }
  if (statusUpper.includes("IN_USE") || statusUpper.includes("OCCUPIED")) {
    return EquipmentStatus.IN_USE;
  }

  return EquipmentStatus.AVAILABLE; // Default to available
}

/**
 * Get dashboard statistics for all departments (for viewing purposes)
 * All authenticated users can view this data
 */
export async function getAllDepartmentsStats(): Promise<DashboardStats> {
  try {
    // All departments stats are public - no authentication required

    // Get all equipment from department-specific tables
    const foodAnalysisEquipment =
      // @ts-ignore - Prisma client type issue
      await prisma.foodAnalysisLabEquipment.findMany();

    // For now, just use the food analysis equipment
    // TODO: Add other department-specific tables
    const allEquipment = [...foodAnalysisEquipment];

    const totalEquipment = allEquipment.length;

    // Count by status (normalize status values)
    const statusCounts = allEquipment.reduce((acc, item) => {
      const status = normalizeStatus(item.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<EquipmentStatus, number>);

    const availableCount = statusCounts[EquipmentStatus.AVAILABLE] || 0;
    const inUseCount = statusCounts[EquipmentStatus.IN_USE] || 0;
    const needsRepairCount = statusCounts[EquipmentStatus.NEEDS_REPAIR] || 0;
    const discardedCount = statusCounts[EquipmentStatus.DISCARDED] || 0;

    // Count by type
    const typeCounts = allEquipment.reduce((acc, item) => {
      const type = item.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const equipmentByType = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count);

    // Get recent equipment (last 10)
    const recentEquipment = allEquipment
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: normalizeStatus(item.status),
        purchaseDate: item.createdAt, // Use createdAt as purchaseDate for now
        department: { name: "Department" }, // We'll need to fetch this separately if needed
      }));

    // For now, set maintenance cost to 0 since department-specific tables don't have maintenance logs
    const totalMaintenanceCost = 0;

    return {
      totalEquipment,
      availableCount,
      inUseCount,
      needsRepairCount,
      discardedCount,
      equipmentByType,
      recentEquipment,
      totalMaintenanceCost,
    };
  } catch (error) {
    console.error("Error fetching all departments stats:", error);
    throw error;
  }
}
