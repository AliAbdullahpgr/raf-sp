"use client";

import { useEffect, useState, useCallback } from "react";
import { getSuperAdminOverview } from "@/actions/super-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, BarChart3, RefreshCw } from "lucide-react";

export default function AdminDashboardViewsPage() {
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

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gray-500">Loading...</div></div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Failed to load data</div>;
  }

  const sorted = Object.entries(data.adminDeptViewMap as Record<string, number>).sort(([, a], [, b]) => b - a);
  const maxViews = Math.max(...Object.values(data.adminDeptViewMap as Record<string, number>), 1);
  const totalViews = sorted.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            Admin Dashboard Views
          </h1>
          <p className="text-gray-500 mt-1">Views on /dashboard/[dept] pages — logged-in users only</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchData(true)} disabled={refreshing} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{totalViews.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Departments w/ Views</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{sorted.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Departments</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalDepartments}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Dashboard Usage by Department
          </CardTitle>
          <CardDescription>Ranked by total admin dashboard views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sorted.map(([slug, views]: [string, number], index: number) => {
              const name = data.slugNameMap[slug] || slug;
              const percentage = (views / maxViews) * 100;
              const recentViews = data.recentPageViewMap[`/dashboard/${slug}`] || 0;
              return (
                <div key={slug}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">{index + 1}</span>
                      <span className="font-medium text-gray-800">{name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {recentViews > 0 && (
                        <span className="text-green-600 text-xs font-medium">+{recentViews} today</span>
                      )}
                      <span className="font-semibold text-gray-700 min-w-[60px] text-right">{views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="ml-8 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500" style={{ width: `${Math.max(percentage, 2)}%` }} />
                  </div>
                </div>
              );
            })}
            {sorted.length === 0 && <div className="text-center py-8 text-gray-400">No admin dashboard views yet</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
