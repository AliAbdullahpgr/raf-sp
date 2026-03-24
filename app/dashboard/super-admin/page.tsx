"use client";

import { useEffect, useState, useCallback } from "react";
import { getSuperAdminOverview } from "@/actions/super-admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Eye,
  BarChart3,
  TrendingUp,
  Monitor,
  RefreshCw,
} from "lucide-react";


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

  // Sort departments by page views (most viewed first)
  const sortedDepts = [...data.departments].sort((a: any, b: any) => {
    const aViews = data.deptViewMap[a.id] || 0;
    const bViews = data.deptViewMap[b.id] || 0;
    return bViews - aViews;
  });

  // Find max views for progress bar scaling
  const maxViews = Math.max(...Object.values(data.deptViewMap as Record<string, number>), 1);

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
          <p className="text-gray-500 mt-1">
            Monitor page views and department dashboard access
          </p>
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

      {/* Top Stats */}
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
            <CardTitle className="text-sm font-medium text-gray-500">Admin Panel Views</CardTitle>
            <Monitor className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{data.adminPageViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Admin pages accessed</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Page Views Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Department Dashboard Access
          </CardTitle>
          <CardDescription>
            How many times each department's admin panel has been accessed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedDepts.map((dept: any, index: number) => {
              const views = data.deptViewMap[dept.id] || 0;
              const recentViews = data.recentPageViewMap[`/dashboard/${dept.id}`] || 0;
              const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;

              return (
                <div key={dept.id} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">
                        {dept.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {recentViews > 0 && (
                        <span className="text-green-600 text-xs font-medium">
                          +{recentViews} today
                        </span>
                      )}
                      <span className="font-semibold text-gray-700 min-w-[60px] text-right">
                        {views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {sortedDepts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No departments found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-orange-500" />
            All Page Views
          </CardTitle>
          <CardDescription>
            Breakdown of views by page URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Page</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500">Total Views</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500">Today</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.pageViewMap as Record<string, number>)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([page, count]) => (
                    <tr key={page} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs text-gray-600">{page}</td>
                      <td className="py-3 px-4 text-right font-semibold">{(count as number).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-green-600">
                        {(data.recentPageViewMap[page] || 0) > 0
                          ? `+${data.recentPageViewMap[page]}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                {Object.keys(data.pageViewMap).length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">
                      No page views recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
