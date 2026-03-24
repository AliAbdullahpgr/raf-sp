"use client";

import { useEffect, useState, useCallback } from "react";
import { getSuperAdminOverview } from "@/actions/super-admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  BarChart3,
  TrendingUp,
  Monitor,
  RefreshCw,
  Building2,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const result = await getSuperAdminOverview();
    if (result.success) setData(result.data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading overview...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Failed to load data</div>;
  }

  const totalPublicViews = Object.values(data.publicDeptViewMap as Record<string, number>).reduce((s, v) => s + v, 0);
  const totalAdminViews = Object.values(data.adminDeptViewMap as Record<string, number>).reduce((s, v) => s + v, 0);

  // Top 5 for quick summary
  const topPublic = Object.entries(data.publicDeptViewMap as Record<string, number>)
    .sort(([, a], [, b]) => b - a).slice(0, 5);
  const topAdmin = Object.entries(data.adminDeptViewMap as Record<string, number>)
    .sort(([, a], [, b]) => b - a).slice(0, 5);
  const maxPublic = Math.max(...Object.values(data.publicDeptViewMap as Record<string, number>), 1);
  const maxAdmin = Math.max(...Object.values(data.adminDeptViewMap as Record<string, number>), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            Super Admin
          </h1>
          <p className="text-gray-500 mt-1">Overview of site traffic and department activity</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data.todayPageViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalDepartments}</div>
            <p className="text-xs text-gray-500 mt-1">Active departments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Two summary cards side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Public Views Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4 text-blue-500" />
                Public Department Views
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">{totalPublicViews.toLocaleString()} total · top 5 shown</p>
            </div>
            <Link href="/dashboard/super-admin/department-views">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPublic.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No views yet</p>}
              {topPublic.map(([slug, views]: [string, number]) => {
                const name = data.slugNameMap[slug] || slug;
                const pct = maxPublic > 0 ? (views / maxPublic) * 100 : 0;
                return (
                  <div key={slug}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-800">{name}</span>
                      <span className="text-gray-500">{views.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard Views Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Monitor className="h-4 w-4 text-purple-500" />
                Admin Dashboard Views
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">{totalAdminViews.toLocaleString()} total · top 5 shown</p>
            </div>
            <Link href="/dashboard/super-admin/admin-views">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAdmin.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No views yet</p>}
              {topAdmin.map(([slug, views]: [string, number]) => {
                const name = data.slugNameMap[slug] || slug;
                const pct = maxAdmin > 0 ? (views / maxAdmin) * 100 : 0;
                return (
                  <div key={slug}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-800">{name}</span>
                      <span className="text-gray-500">{views.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
