"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return null;
  }
  return session;
}

export async function getSuperAdminOverview(): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    const [totalDepartments, totalUsers] = await Promise.all([
      prisma.department.count(),
      prisma.user.count(),
    ]);

    // Get departments with page view counts
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { equipment: true, users: true, outgoingRequests: true, incomingRequests: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Get page view counts per department page
    const pageViews = await prisma.pageView.groupBy({
      by: ["page"],
      _count: { id: true },
    });

    // Get page views from last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentPageViews = await prisma.pageView.groupBy({
      by: ["page"],
      where: { createdAt: { gte: oneDayAgo } },
      _count: { id: true },
    });

    // Get total page views
    const totalPageViews = await prisma.pageView.count();
    const todayPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: oneDayAgo } },
    });

    // Get admin page views (pages starting with /dashboard/admin)
    const adminPageViews = await prisma.pageView.count({
      where: { page: { startsWith: "/dashboard/admin" } },
    });

    // Get page views grouped by department
    const deptPageViews = await prisma.pageView.groupBy({
      by: ["departmentId"],
      where: { departmentId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Build a map of departmentId -> view count
    const deptViewMap: Record<string, number> = {};
    for (const d of deptPageViews) {
      if (d.departmentId) deptViewMap[d.departmentId] = d._count.id;
    }

    // Build page view map
    const pageViewMap: Record<string, number> = {};
    for (const pv of pageViews) {
      pageViewMap[pv.page] = pv._count.id;
    }
    const recentPageViewMap: Record<string, number> = {};
    for (const pv of recentPageViews) {
      recentPageViewMap[pv.page] = pv._count.id;
    }

    return {
      success: true,
      data: {
        totalDepartments,
        totalUsers,
        totalPageViews,
        todayPageViews,
        adminPageViews,
        departments,
        deptViewMap,
        pageViewMap,
        recentPageViewMap,
      },
    };
  } catch (error) {
    console.error("Super admin overview error:", error);
    return { success: false, message: "Failed to load overview" };
  }
}

export async function getAllDepartmentsWithDetails(): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: {
          select: {
            equipment: true,
            users: true,
            outgoingRequests: true,
            incomingRequests: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Get page views per department
    const deptPageViews = await prisma.pageView.groupBy({
      by: ["departmentId"],
      where: { departmentId: { not: null } },
      _count: { id: true },
    });

    const deptViewMap: Record<string, number> = {};
    for (const d of deptPageViews) {
      if (d.departmentId) deptViewMap[d.departmentId] = d._count.id;
    }

    return { success: true, data: { departments, deptViewMap } };
  } catch (error) {
    console.error("Get all departments error:", error);
    return { success: false, message: "Failed to load departments" };
  }
}

export async function getDepartmentPageViews(departmentId: string): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    // Get daily page views for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const views = await prisma.pageView.findMany({
      where: {
        departmentId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, page: true },
    });

    // Group by day
    const dailyViews: Record<string, number> = {};
    for (const v of views) {
      const day = v.createdAt.toISOString().split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    }

    const totalViews = await prisma.pageView.count({ where: { departmentId } });

    return {
      success: true,
      data: { dailyViews, totalViews, recentViews: views.length },
    };
  } catch (error) {
    console.error("Get department page views error:", error);
    return { success: false, message: "Failed to load page views" };
  }
}
